// scripts/update-image-categories.js
const mongoose = require('mongoose');
const { Image } = require('../src/models/Image');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/YOUR_DB_NAME';

async function updateCategories() {
  await mongoose.connect(MONGO_URI);

  // 1. Mummy YP Wedding Event -> Wedding Events
  const res1 = await Image.updateMany(
    { category: "Mummy YP Wedding Event" },
    { $set: { category: "Wedding Events" } }
  );
  console.log('Updated:', res1.modifiedCount, 'images from "Mummy YP Wedding Event" to "Wedding Events"');

  // 2. Mrs. Roli Akperi Celebrating 30+ Years of Service -> Corporate Events
  const res2 = await Image.updateMany(
    { category: "Mrs. Roli Akperi Celebrating 30+ Years of Service" },
    { $set: { category: "Corporate Events" } }
  );
  console.log('Updated:', res2.modifiedCount, 'images from "Mrs. Roli Akperi Celebrating 30+ Years of Service" to "Corporate Events"');

  await mongoose.disconnect();
}

updateCategories().catch(err => {
  console.error(err);
  process.exit(1);
});