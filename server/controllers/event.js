import { faker } from "@faker-js/faker";
import Event from "../models/event.js";

export const createEvent = async (req, res) => {
  try {
    const { body } = req;
    const { userid, verb, noun, properties } = body;
    const timestamp = new Date();
    const newEvent = await Event.create({
      userid,
      verb,
      noun,
      timestamp,
      properties,
    });
    res.status(201).json(newEvent);
  } catch (error) {
    console.log("Bulk create events error: ", error);
    res.status(400).json({ error: error.message });
  }
};

export const createEvents = async (req, res) => {
  try {
    const events = [];
    for (let i = 0; i < 1000; i++) {
      const event = {
        userid: faker.datatype.number({ min: 1, max: 1000 }),
        verb: faker.helpers.arrayElement(["buy", "post"]),
        noun: faker.helpers.arrayElement(["nft", "feedback"]),
        timestamp: faker.date.recent(8),
        properties: {
          merchangeid: faker.datatype.number({ min: 1, max: 1000 }),
          ...JSON.parse(faker.datatype.json()),
        },
      };
      events.push(event);
    }
    const newEvents = await Event.bulkCreate(events);
    res.status(201).json({ newEvents });

    // const events = [];
    // for (let i = 0; i < 101; i++) {
    //   const event = {
    //     userid: 874,
    //     verb: "buy",
    //     noun: "nft",
    //     timestamp: new Date( Date.now() - 60000 * 30),
    //     properties: {
    //       merchangeid: 265,
    //       ...JSON.parse(faker.datatype.json()),
    //     },
    //   };
    //   events.push(event);
    // }
    // const newEvents = await Event.bulkCreate(events);
    // res.status(201).json({ newEvents });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const allEvents = await Event.findAll();
    res.status(200).json(allEvents);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
