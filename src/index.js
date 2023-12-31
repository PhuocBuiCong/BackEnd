const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./config/db");
const port = 8000;
const ProductController = require("./app/controllers/ProductController");
const UserController = require("./app/controllers/UserController");
const verifyToken = require("./middleware/auth");
const bodyParser = require("body-parser");

require("dotenv").config();
app.use(express.json({ limit: "50mb", extended: true }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);
app.use(cors());
app.use(express.json());

//connect to db
db.connect();

//Config router get data

// Authentication
// POST register
app.post("/api/signup", UserController.signup);

// POST Login
app.post("/api/login", UserController.login);

// POST refresh
app.post("/api/refresh", UserController.refresh);

app.get("/api/home", (req, res) => {
  return res.status(200).json("home page");
});

app.post("/api/user", UserController.getUser);

app.post("/api/updateUser", UserController.update);

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
