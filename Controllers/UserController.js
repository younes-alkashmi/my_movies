const bcrypt = require("bcrypt");
const User = require("../Models/User");

const getUsers = async (req, res) => {
  const id = req.params.id;

  try {
    const admin = await User.findById(id);

    if (admin && admin.isAdmin) {
      const users = await User.find();
      res.status(200).json(users);
    } else {
      res.status(403).json("Access denied.");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  const id = req.params.id;
  const { _id, password } = req.body;

  if (id === _id) {
    try {
      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }
      const user = await User.findByIdAndUpdate({ _id: id }, req.body, {
        new: true,
      });

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(403).json("Access denied, you can only update your own account");
  }
};

const deleteUser = async (req, res) => {
  const id = req.params.id;
  const { _id, password } = req.body;

  try {
    const user = await User.findById(_id);
    const valid =
      user && password ? await bcrypt.compare(password, user.password) : false;

    if (id === _id && valid) {
      await User.findByIdAndDelete(_id);
      res.status(200).json(`${user.username} deleted successfully.`);
    } else {
      res.status(403).json("Action denied");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const upgrade = async (req, res) => {
  const id = req.params.id;
  const { email } = req.body;
  try {
    const admin = await User.findById(id);
    const user = await User.findOne({ email });
    if (user && admin && admin.isAdmin) {
      user.isAdmin = true;
      await user.save();
      res.status(200).json("User updated successfully.");
    } else {
      res.status(403).json("Action denied.");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  const id = req.params.id;
  const { username } = req.body;
  try {
    const admin = await User.findById(id);
    if (admin) {
      const user = await User.find({ username });
      res.status(200).json(user);
    } else {
      res.status(403).json("Access denied.");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { updateUser, deleteUser, upgrade, getUser, getUsers };
