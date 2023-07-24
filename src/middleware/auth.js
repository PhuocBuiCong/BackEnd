const jwt = require("jsonwebtoken");
const RefreshToken = require("../app/models/RefreshToken");

const verifyToken = async (req, res, next) => {
  try {
    if (req.headers["x-token"]) {
      const token = req.headers["x-token"];
      console.log("Token BE nhan dc ", token);
      const payload = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = payload;
      console.log("payload", payload);
      return next();
    }
  } catch (error) {
    console.error(error);
    if(error.name === "TokenExpiredError") {
      return res.status(200).json({
        code: 401,
        msg: error.message,
      });
    }
      return res.status(200).json({
        code: 500,
        msg: error,
      });

  }
  // const authHeader = req.header("Authorization");
  // const accessToken = authHeader && authHeader.split(" ")[1];
  // console.log(accessToken);
  // if (accessToken) {
  //   jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
  //     // if access token error or token expired
  //     if (err) {
  //       const refreshToken = req.body.refreshToken; // get refreshToken from body
  //       if (!refreshToken) {
  //         return res.sendStatus(401);
  //       }

  //       jwt.verify(
  //         refreshToken,
  //         process.env.REFRESH_TOKEN_SECRET,
  //         (err, decoded) => {
  //           if (err) {
  //             return res.sendStatus(401);
  //           }
  //           // check refreshToken have exist in db
  //           RefreshToken.findOne({ token: refreshToken }, (err, token) => {
  //             if (!token) return res.sendStatus(401);

  //             //create new access token
  //             const newAccessToken = jwt.sign(
  //               { userId: decoded.userId, email: decoded.email },
  //               process.env.ACCESS_TOKEN_SECRET,
  //               { expiresIn: "15s" }
  //             );

  //             //update new access token to request
  //             req.headers.authorization = newAccessToken;

  //             next();
  //           });
  //         }
  //       );
  //     } else {
  //       req.user = user;
  //       next();
  //     }
  //   });
  // } else {
  //   res.sendStatus(401);
  // }
};

module.exports = verifyToken;
