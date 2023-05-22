const mongoose = require("mongoose");

const atlasConnectionString = `mongodb+srv://shadybarakat2019:12345@food-ordering.erztsrb.mongodb.net/food-ordering?retryWrites=true&w=majority`;
// const localConnectionString =  'mongodb://localhost:27017/food-ordering'
mongoose
  .connect(atlasConnectionString, { useNewUrlParser: true })
  .then(() => {
    console.log(`connection done to mongo db`);
  })
  .catch((e) => {
    console.error("Connection error", e.message);
  });

const db = mongoose.connection;

module.exports = db;
