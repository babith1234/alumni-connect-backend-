const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const routes = require("./routes/routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

dotenv.config()

const port = process.env.PORT;
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log(err);
  });

  app.use("/", routes);


app.listen(port, () => {
  console.log(`server running at ${port}`);
});
