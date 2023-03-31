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
    console.log("Connection to DB has been established successfully.");
    console.log(`Server running on port: ${PORT}`);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    await sequelize.close();
  }
});
