const mongoose = require('mongoose');
const Cruisespot = require('../models/cruisespot');
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
mongoose.connect('mongodb://localhost:27017/yelp-cruise', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection erro:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
  await Cruisespot.deleteMany({});

  for (let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 200) + 10;
    const cruise = new Cruisespot({
      author: '60f9daefae5c5455385edb5b',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quia voluptatibus, animi vel aliquid eaque iusto beatae, veniam et maxime dicta, officia ut natus doloremque est sint incidunt! Nam, incidunt vel?',
      price,
      "geometry": {
        "type": "Point",
        "coordinates": [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ]
      },
      images: [
        {
          url: 'https://res.cloudinary.com/dshjqilr7/image/upload/v1627098733/YelpCruise/rrd6q4gwdfxvewq4ar4t.jpg',
          filename: 'YelpCruise/rrd6q4gwdfxvewq4ar4t'
        },
        {
          url: 'https://res.cloudinary.com/dshjqilr7/image/upload/v1627098733/YelpCruise/pqima0h7l7hpab1ibwcs.jpg',
          filename: 'YelpCruise/pqima0h7l7hpab1ibwcs'
        }
      ]
    })
    await cruise.save();
  }

}

seedDB().then(() => {
  mongoose.connection.close();
});