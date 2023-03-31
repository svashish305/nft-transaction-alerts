import { createEvent, getEvents } from "../services/event";

export const createEventController = async (req, res) => {
  try {
    const { body } = req;
    const { userid, verb, noun, properties } = body;
    const timestamp = new Date();
    const newEvent = await createEvent({
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

export const getEventsController = async (req, res) => {
  try {
    const allEvents = await getEvents();
    res.status(200).json(allEvents);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
