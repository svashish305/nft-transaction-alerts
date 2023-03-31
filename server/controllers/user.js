import { faker } from "@faker-js/faker";
import User from "../models/user.js";

export const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.create({ name, email });
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const createUsers = async (req, res) => {
  try {
    const users = [];
    for (let i = 0; i < 1000; i++) {
      const user = {
        name: faker.name.fullName(),
        email: faker.internet.email().toLowerCase(),
        role: faker.helpers.arrayElement(["admin", "user"]),
      };
      users.push(user);
    }
    const newUsers = await User.bulkCreate(users);
    res.status(201).json({ newUsers });
  } catch (error) {
    console.log("Bulk create users error: ", error);
    res.status(400).json({ error: error.message });
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};
