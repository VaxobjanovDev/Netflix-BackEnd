const express = require("express");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth")
const dotenv = require("dotenv") 
mongoose
  .connect("mongodb://localhost:27017/netflixClone", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection is succesfully"))
  .catch((err) => console.log(err));

dotenv.config()

const app = express();

app.use(express.json())

app.use("/api/auth", authRoute);


const port = process.env.PORT || 8800;
app.listen(port, () => {
  console.log("Server is running");
});
