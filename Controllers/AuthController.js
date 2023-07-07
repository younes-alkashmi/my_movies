const User = require("../Models/User");
const Admin = require("../Models/Admin");
const UserSchema = require("../Validators/UserValidator");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
     const { email, password } = req.body;

     try {
          UserSchema.validateSync(
               { email, password },
               { abortEarly: false, stripUnknown: true },
          );

          const user = await User.findOne({ email });

          if (user && password) {
               const verified = await bcrypt.compare(password, user.password);
               user.password = undefined;

               if (verified) res.status(200).json(user);
               else res.status(403).json("Access denied");
          } else {
               res.status(404).json("User not found");
          }
     } catch (error) {
          res.status(422).json({ errors: error.errors });
          // res.status(500).json({ message: error.message });
     }
};

const register = async (req, res) => {
     const { email, password } = req.body;
     try {
          const data = await UserSchema.validate(req.body, {
               abortEarly: false,
               stripUnknown: true,
          });

          if (await User.findOne({ email }))
               return res.status(400).json("Email is found");

          const salt = await bcrypt.genSalt(10);
          req.body.password = await bcrypt.hash(password, salt);

          const user = await User.create(req.body);
          user.password = undefined;
          res.status(201).json(user);
     } catch (error) {
          res.status(422).json({ errors: error.errors });
          // res.status(500).json({ message: error.message });
     }
};

const signup = async (req, res) => {
     const { email, password } = req.body;
     try {
          const data = await UserSchema.validate(req.body, {
               abortEarly: false,
               stripUnknown: true,
          });

          if (await Admin.findOne({ email }))
               return res.status(400).json("Email is found");

          const salt = await bcrypt.genSalt(10);
          req.body.password = await bcrypt.hash(password, salt);

          const user = await Admin.create(req.body);
          user.password = undefined;
          res.status(201).json(user);
     } catch (error) {
          res.status(422).json({ errors: error.errors });
     }
};

const adminLogin = async (req, res) => {
     try {
          UserSchema.validateSync(req.body, {
               abortEarly: false,
               stripUnknown: true,
          });

          const user = await Admin.findOne({ email });

          if (user && password) {
               const verified = await bcrypt.compare(password, user.password);
               user.password = undefined;

               if (verified) res.status(200).json(user);
               else res.status(403).json("Access denied");
          } else {
               res.status(404).json("User not found");
          }
     } catch (error) {
          res.status(422).json({ errors: error.errors });
          // res.status(500).json({ message: error.message });
     }
};

module.exports = { login, register, adminLogin, signup };
