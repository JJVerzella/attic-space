const express = require("express");
const cors = require("cors");
require("dotenv/config");
const userRoutes = require("./routes/userRoutes");
const fileRoutes = require("./routes/fileRoutes");
const connect = require("./configs/db");

const PORT = process.env.PORT || 5000;
const app = express();

connect();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/files", fileRoutes);

const server = app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

module.exports = server;
