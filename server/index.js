import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import sequelize from "./util/database.js";
import userRoutes from "./routes/user.js";
import eventRoutes from "./routes/event.js";
import alertRoutes from "./routes/alert.js";
import { faker } from "@faker-js/faker";
import User from "./models/user.js";
import Event from "./models/event.js";

// CONFIGURATIONS
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// ROUTES
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/user", userRoutes);
app.use("/event", eventRoutes);
app.use("/alert", alertRoutes);

const PORT = process.env.PORT || 9000;

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection to PostgreSQL DB has been established successfully.");

    // ONE TIME ONLY: SEED THE DATABASE WITH MOCK DATA
    const userCount = (await User.count()) || 0;
    if (!userCount) {
      const users = [];
      for (let i = 0; i < 1000; i++) {
        const user = {
          name: faker.name.fullName(),
          email: faker.internet.email().toLowerCase(),
          role: faker.helpers.arrayElement(["operator", "user"]),
        };
        users.push(user);
      }

      const newUsers = await User.bulkCreate(users);
      console.log(`Created ${newUsers.length} users`);
    }

    // comment below lines to generate mock data to pass final rule.
    const eventCount = (await Event.count()) || 0;
    if (!eventCount) {
      const events = [];
      for (let i = 0; i < 1000; i++) {
        const event = {
          userid: faker.datatype.number({ min: 1, max: 1000 }),
          verb: faker.helpers.arrayElement(["buy", "post"]),
          noun: faker.helpers.arrayElement(["nft", "feedback"]),
          timestamp: faker.date.recent(8),
          properties: {
            merchantid: faker.datatype.number({ min: 1, max: 1000 }),
            ...JSON.parse(faker.datatype.json()),
          },
        };
        events.push(event);
      }
    }

    // uncomment below lines to generate mock data to pass final rule.
    // firstly, pick any first userid from events table where verb is buy and noun is nft
    // const events = [];
    // const thresholdEventCount = 100;
    // const halfHourAgoTimestamp = new Date(Date.now() - 60000 * 30);
    // for (let i = 0; i < thresholdEventCount + 1; i++) {
    //   const event = {
    //     userid: 513, // our picked userid
    //     verb: "buy",
    //     noun: "nft",
    //     timestamp: halfHourAgoTimestamp,
    //     properties: {
    //       merchangeid: 325, // merchantid in properties of the picked event whose userid is 513
    //       ...JSON.parse(faker.datatype.json()),
    //     },
    //   };
    //   events.push(event);
    // }
    const newEvents = await Event.bulkCreate(events);
    console.log(`Created ${newEvents.length} events`);

    console.log(`Server running on port: ${PORT}`);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    await sequelize.close();
  }
});
