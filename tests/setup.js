require("dotenv").config();

// sets the test database URI
process.env.MONGO_URI = process.env.MONGO_URI_TEST;
