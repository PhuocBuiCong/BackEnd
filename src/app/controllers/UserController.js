const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
class UserController {
  //  logic register
  async register(req, res, next) {
    try {
      const { email, password } = req.body;
      const oldUser = await User.findOne({ email });
      if (oldUser) {
        return res
          .status(409)
          .send(
            "User Already Exist. Please Login or Sign up for another email"
          );
      }

      // Create hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("hashed password: ", hashedPassword);

      // Create user in our database
      const newUser = new User({ email, password: hashedPassword });
      newUser
        .save()
        .then(() => {
          res.status(201).json({
            message: "OK",
            user: { _id: newUser.id, email: newUser.email },
          });
        })
        .catch((err) => {
          console.error("Error saving user to the database:", err);
          res.status(500).json({ message: "Failed to create user" });
        });
    } catch (error) {}
  }

  // logic login

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      console.log(email, password);
      if (!email || !password) {
        res.status(400);
        throw new Error("All field can not be left blank");
      }

      const user = await User.findOne({ email });

      //compare password input with hashed password in db
      if (user && (await bcrypt.compare(password, user.password))) {
        //create access token
        const accessToken = jwt.sign(
          {
            user: {
              email: user.email,
              id: user.id,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "30s" }
        );

        //create refresh token
        const refreshToken = jwt.sign(
          {
            user: {
              email: user.email,
              id: user.id,
            },
          },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "7d" }
        );

        // Save refresh token in our database
        user.refreshToken = refreshToken;
        await user.save();

        res.status(200).json({
          message: " Authenication successfull",
          accessToken,
          refreshToken,
        });
      } else {
        res.status(401);
        throw new Error("Email or password is not valid");
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "An error occurred during login" });
    }
  }
}

module.exports = new UserController();
