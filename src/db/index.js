const mongoose = require("mongoose");

mongoose.configOpts = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

module.exports = mongoose.connect(process.env.MONGO_URI, mongoose.configOpts);
