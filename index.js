const express = require("express");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth")
const usersRoute = require("./routes/users")
const movieRoute = require("./routes/movies")

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

app.use("/api/users", usersRoute)

app.use("/api/movies", movieRoute)



const port = process.env.PORT || 8800;
app.listen(port, () => {
  console.log("Server is running");
});
