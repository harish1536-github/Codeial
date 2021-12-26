const mongoose = require("mongoose");
const env = require("./environment");
// mongoose.connect('mongodb://localhost/codeial_development');

//connect to the database and acquire the connection if it is succedfull
mongoose.connect(`mongodb://localhost:27017/codeial_production`);
// mongoose.connect(`mongodb://localhost/demo`);

//To verify the connection we will write this

//this give us access to the database
const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error connecting to MongoDB"));

//up and running and printing on the console
db.once("open", function () {
  console.log("Connected to Database :: MongoDB");
});

module.exports = db;
