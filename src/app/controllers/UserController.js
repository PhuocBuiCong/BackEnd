const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
class UserController {
  //  logic register
  async signup(req, res, next) {
    try {
      const { email, password, role } = req.body;
      const oldUser = await User.findOne({ email });
      if (oldUser) {
        return res
          .status(409)
          .send("User Already Exist. Please Sign up for another email");
      }

      // Create hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("hashed password: ", hashedPassword);

      // Create user in our database
      const newUser = new User({ email, password: hashedPassword, role });
      newUser
        .save()
        .then(() => {
          res.status(200).json({
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
            email: user.email,
            id: user.id,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "30s" }
        );
        let refreshToken = user.refreshToken;
        console.log("token in db :", refreshToken);
        if (!refreshToken) {
          refreshToken = jwt.sign(
            {
              email: user.email,
              id: user.id,
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }
          );
          console.log("old", refreshToken);
          // Save refresh token in our database
          user.refreshToken = refreshToken;
          await user.save();
        } else {
          const newRefreshToken = jwt.sign(
            {
              email: user.email,
              id: user.id,
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }
          );
          console.log("new", newRefreshToken);

          user.refreshToken = newRefreshToken;
          await user.save();
        }

        res.status(200).json({
          message: " Authenication successfull",
          id: user.id,
          accessToken,
          refreshToken: user.refreshToken, // Use the updated refresh token,
          role: user.role,
        });
      } else {
        res.status(401);
        throw new Error("Email or password is not valid");
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Email or password incorrect" });
    }
  }

  // api refresh token when token expired
  async refresh(req, res, next) {
    const { refreshToken } = req.body;
    try {
      const refreshDB = await User.findOne({ refreshToken });
      // check if token exists in db
      if (!refreshDB) {
        return res.status(401).json({ error: "Invalid refresh token" });
      }
      // Verify and decode the refresh token
      const decodedToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      console.log(decodedToken);
      // Generate a new access token
      const accessToken = jwt.sign(
        {
          email: decodedToken.email,
          id: decodedToken.id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30s" }
      );
      res.json({ accessToken });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Server error" });
    }
  }

  //api get user
  async getUser(req, res, next) {
    const { id } = req.body;
    console.log(id);
    try {
      if (!id) {
        res.status(400);
        throw new Error("Can not get user");
      }

      const user = await User.findOne({ _id: id });
      res.json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Server error" });
    }
  }
}
module.exports = new UserController();
