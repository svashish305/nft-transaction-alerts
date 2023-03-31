import Event from "../models/event.js";

export const createEvent = async (params = {}) => {
  try {
    const { userid, verb, noun, timestamp, properties } = params;
    const event = await Event.create({
      userid,
      verb,
      noun,
      timestamp,
      properties,
    });
    return event;
  } catch (error) {
    console.log("create event error: ", error);
    throw error;
  }
};

export const getEvents = async () => {
  try {
    const events = await Event.findAll();
    return events;
  } catch (error) {
    console.log("get events error: ", error);
    throw error;
  }
};
