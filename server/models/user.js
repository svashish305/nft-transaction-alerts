import { Sequelize } from "sequelize";
import db from "../util/database.js";

const User = db.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  email: Sequelize.STRING,
  role: Sequelize.STRING,
});
await User.sync();

export default User;
