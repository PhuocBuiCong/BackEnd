const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./config/db");
const port = 8000;
const ProductController = require("./app/controllers/ProductController");
const UserController = require("./app/controllers/UserController");
const verifyToken = require("./middleware/auth");

require("dotenv").config();
app.use(express.json());
app.use(cors());

//connect to db
db.connect();

//Config router get data

// Authentication
// POST register
app.post("/api/register", UserController.register);

// POST Login
app.post("/api/login", UserController.login);

app.get("/api/user", verifyToken, (req, res) => {
  return res.status(200).json({
    message: "Protected route",
    elements: [
      {
        name: "phuocbc",
      },
      {
        name: "tips js",
      },
    ],
  });
});
// --------------------------------------------------------------//
// API GET/products
app.get("/api/products", ProductController.index);

// API GET/product/id
app.get("/api/product/:id", ProductController.getProductById);

//API UPDATE/product/id
app.put("/api/:id/update", ProductController.update);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});