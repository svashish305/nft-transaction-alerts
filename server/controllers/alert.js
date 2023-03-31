import { getRuleAlertsMap } from "../services/alert.js";

export const sendAlert = async (req, res) => {
  try {
    const ruleAlertsMap = await getRuleAlertsMap();
    res.status(200).json(ruleAlertsMap);
  } catch (error) {
    console.log("Send alert error: ", error);
    res.status(400).json({ error: error.message });
  }
};
