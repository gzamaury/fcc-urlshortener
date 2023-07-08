const mongoose = require("mongoose");

// close the mongoose connection after running the tests
afterAll(async () => {
  await mongoose.connection.close();
});