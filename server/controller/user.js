const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const {
  passwordEncryption,
  idEncryption,
} = require("../utils/authentication.js");

//register user
const registerController = async (req, res) => {
  try {
    console.log(req.body);
    const { name, username, password, email, phone, admin } = req.body;
    if (!name || !username || !password || !email || !phone || !admin) {
      return res.status(400).send({ message: "Please fill all Details" });
    }
    const exist = await User.findOne({ username: username });
    console.log(exist);
    if (exist) {
      return res.status(409).send({ message: "Please Enter Unique username" });
    }
    const hashedPassword = await passwordEncryption(password);
    const userData = await User.create({
      username: username,
      password: hashedPassword,
      name: name,
      email: email,
      phone: phone,
      admin: admin,
    });
    res.status(201).send({ message: "successfully inserted", userData });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

//login user
const loginController = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send({ message: "Please fill all Details" });
    }
    const exist = await User.findOne({ username: username });
    if (!exist) {
      return res.status(409).send({ message: "username not exists" });
    }
    const passwordMatch = await bcrypt.compare(password, exist.password);

    if (!passwordMatch) {
      return res.status(403).send({ message: "password mismatch" });
    }
    const token = await idEncryption(exist._id);
    return res.status(200).send({
      message: "Successfully Login",
      data: {
        name: exist.name,
        username: exist.username,
        admin: exist.admin,
        token,
      },
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = { registerController, loginController };
