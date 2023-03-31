import User from "../models/user.js";

export const createUser = async (params) => {
  try {
    const { name, email } = params;
    const user = await User.create({ name, email });
    return user;
  } catch (error) {
    console.log("create user error: ", error);
    throw error;
  }
}

export const getUsers = async () => {
  try {
    const users = await User.findAll();
    return users;
  } catch (error) {
    console.log("get users error: ", error);
    throw error;
  }
}