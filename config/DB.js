const mongoose = require("mongoose");
const ConnectDB = async() => {
  try {
    // MongoDB Connect and monitor
    const db = await mongoose.connect(process.env.MONGO_URI)

    // db.on('error', (err) => {
    //   console.log(err)
    // })
    // db.once('open', () => {
    console.log(`Mongo connected: ${db.connection.host}`)
      // })
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

module.exports = ConnectDB;