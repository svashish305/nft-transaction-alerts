import { Sequelize } from "sequelize";
import db from "../util/database.js";
import User from "./user.js";

const Event = db.define("event", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  userid: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "users",
      key: "id",
    },
  },
  verb: Sequelize.STRING,
  noun: Sequelize.STRING,
  timestamp: Sequelize.DATE,
  properties: Sequelize.JSON,
});
await Event.sync();
Event.belongsTo(User, { foreignKey: "userid" });

export default Event;
