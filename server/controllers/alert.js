import { promises as fs } from "fs";
import path from "path";
import { QueryTypes } from "sequelize";
import db from "../util/database.js";

export const sendAlert = async (req, res) => {
  try {
    const data = await fs.readFile(path.resolve("./rules.txt"), "utf-8");
    const rules = data.toString().split("\n");

    let allUsersData = await db.query(`SELECT * FROM users`, {
      type: QueryTypes.SELECT,
    });
    const userInfoCache = {};
    allUsersData.forEach((user) => {
      const { id, email, role } = user;
      userInfoCache[id] = { email, role };
    });
    const allUserIds = allUsersData.map((user) => user.id);

    let usersWhoBoughtFirstNft = await db.query(
      `
        SELECT userid, COUNT(*) as count FROM events
        WHERE verb = 'buy' AND noun = 'nft'
        GROUP BY userid
        HAVING COUNT(*) = 1
      `,
      { type: QueryTypes.SELECT }
    );
    usersWhoBoughtFirstNft = usersWhoBoughtFirstNft.map(
      (record) => record.userid
    );

    let usersWhoSoldNftsInLast7Days = await db.query(
      `
        SELECT userid, COUNT(*) FROM events
        WHERE verb = 'sell' AND noun = 'nft' AND timestamp > (NOW() - interval '7 days')
        GROUP BY userid
      `,
      { type: QueryTypes.SELECT }
    );
    usersWhoSoldNftsInLast7Days = usersWhoSoldNftsInLast7Days.map(
      (record) => record.userid
    );
    const usersWhoHaveNotSoldNftsInLast7Days = allUserIds.filter(
      (id) => !usersWhoSoldNftsInLast7Days.includes(id)
    );

    let usersWhoBoughtMoreThan100NftsInLastHour = await db.query(
      `
        SELECT userid, COUNT(*) FROM events
        WHERE verb = 'buy' AND noun = 'nft' AND timestamp > (NOW() - interval '1 hour')
        GROUP BY userid
        HAVING COUNT(*) > 100
      `,
      { type: QueryTypes.SELECT }
    );
    usersWhoBoughtMoreThan100NftsInLastHour =
      usersWhoBoughtMoreThan100NftsInLastHour.map((record) => record.userid);

    const ruleAlertsMap = {};
    const firstTypeAlerts = [];
    const secondTypeAlerts = [];
    const thirdTypeAlerts = [];
    if (
      rules.includes(
        "Trigger a push notification on the very first NFT purchase for the user."
      )
    ) {
      usersWhoBoughtFirstNft.forEach((id) => {
        const message = `Congrats ${userInfoCache[id].email}! You bought your first NFT!`;
        console.log(message);
        firstTypeAlerts.push(message);
      });
    }
    if (
      rules.includes(
        "Alert NFT seller (user) if their NFTs are not sold after 7 days of listing them for sale."
      )
    ) {
      usersWhoHaveNotSoldNftsInLast7Days.forEach((id) => {
        const message = `Hey ${userInfoCache[id].email}! You have not sold any NFTs in last 7 days!`;
        console.log(message);
        secondTypeAlerts.push(message);
      });
    }
    if (
      rules.includes(
        "Alert operator if more than 100 NFTs are purchased by a user within an hour."
      )
    ) {
      usersWhoBoughtMoreThan100NftsInLastHour.forEach((id) => {
        const message = `Hey Operator! ${userInfoCache[id].email} has bought more than 100 NFTs in last hour!`;
        console.log(message);
        thirdTypeAlerts.push(message);
      });
    }
    ruleAlertsMap[rules[0]] = firstTypeAlerts;
    ruleAlertsMap[rules[1]] = secondTypeAlerts;
    ruleAlertsMap[rules[2]] = thirdTypeAlerts;

    res.status(200).json(ruleAlertsMap);
  } catch (error) {
    console.log("Send alert error: ", error);
    res.status(400).json({ error: error.message });
  }
};
