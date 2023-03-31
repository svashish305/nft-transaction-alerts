import { createUser, getUsers } from "../services/user.js"

export const createUserController = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await createUser({ name, email });
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getUsersController = async (req, res, next) => {
  try {
    const users = await getUsers();
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};
