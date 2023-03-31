import { promises as fs } from "fs";
import path from "path";
import { QueryTypes } from "sequelize";
import db from "../util/database.js";

const getRules = async () => {
  try {
    const data = await fs.readFile(path.resolve("./rules.txt"), "utf-8");
    const rules = data.toString().split("\n");
    return rules;
  } catch (error) {
    console.log("get rules error: ", error);
    throw error;
  }
};

const getUserCache = async () => {
  try {
    let allUsersData = await db.query(`SELECT * FROM users`, {
      type: QueryTypes.SELECT,
    });
    const userInfoCache = {};
    allUsersData.forEach((user) => {
      const { id, email, role } = user;
      userInfoCache[id] = { email, role };
    });
    console.log("allUsersData:-------------", allUsersData);
    return userInfoCache;
  } catch (error) {
    console.log("get user cache error: ", error);
    throw error;
  }
};

const getFirstNftBuyers = async () => {
  try {
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
    return usersWhoBoughtFirstNft;
  } catch (error) {
    console.log("get first nft buyers error: ", error);
    throw error;
  }
};

const getInactiveSellers = async () => {
  try {
    let usersWhoSoldNftsInLast7Days = await db.query(
      `
        SELECT properties ->> 'merchantid' AS sellerid FROM events 
        WHERE verb = 'buy' AND noun = 'nft' GROUP BY sellerid HAVING MAX(timestamp) < (NOW() - interval '7 days')
      `,
      { type: QueryTypes.SELECT }
    );
    usersWhoSoldNftsInLast7Days = usersWhoSoldNftsInLast7Days.map(
      (record) => record.sellerid
    );
    return usersWhoSoldNftsInLast7Days;
  } catch (error) {
    console.log("get inactive sellers error: ", error);
    throw error;
  }
};

const getHighVolumeBuyers = async () => {
  try {
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
    return usersWhoBoughtMoreThan100NftsInLastHour;
  } catch (error) {
    console.log("get high volume buyers error: ", error);
    throw error;
  }
};

export const getRuleAlertsMap = async () => {
  try {
    const rules = await getRules();
    const userInfoCache = await getUserCache();

    const ruleAlertsMap = {};
    const firstTypeAlerts = [];
    const secondTypeAlerts = [];
    const thirdTypeAlerts = [];
    if (
      rules.includes(
        "Trigger a push notification on the very first NFT purchase for the user."
      )
    ) {
      const usersWhoBoughtFirstNft = await getFirstNftBuyers();
      usersWhoBoughtFirstNft.forEach((id) => {
        const message = `Congrats ${userInfoCache?.[id]?.email}! You bought your first NFT!`;
        console.log(message);
        firstTypeAlerts.push(message);
      });
    }
    if (
      rules.includes(
        "Alert NFT seller (user) if their NFTs are not sold after 7 days of listing them for sale."
      )
    ) {
      const usersWhoHaveNotSoldNftsInLast7Days = await getInactiveSellers();
      usersWhoHaveNotSoldNftsInLast7Days.forEach((id) => {
        const message = `Hey ${userInfoCache?.[id]?.email}! You have not sold any NFTs in last 7 days!`;
        console.log(id, message);
        secondTypeAlerts.push(message);
      });
    }
    if (
      rules.includes(
        "Alert operator if more than 100 NFTs are purchased by a user within an hour."
      )
    ) {
      const usersWhoBoughtMoreThan100NftsInLastHour =
        await getHighVolumeBuyers();
      usersWhoBoughtMoreThan100NftsInLastHour.forEach((id) => {
        const message = `Hey Operator! ${userInfoCache?.[id]?.email} has bought more than 100 NFTs in last hour!`;
        console.log(message);
        thirdTypeAlerts.push(message);
      });
    }
    ruleAlertsMap[rules[0]] = firstTypeAlerts;
    ruleAlertsMap[rules[1]] = secondTypeAlerts;
    ruleAlertsMap[rules[2]] = thirdTypeAlerts;

    return ruleAlertsMap;
  } catch (error) {
    console.log("get rule alerts map error: ", error);
    throw error;
  }
};
