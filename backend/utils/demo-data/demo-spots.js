const demoSpots = [
  {
    ownerId: 2, // jane.smith
    spots: [
      {
        address: "456 Oak Ave",
        city: "San Francisco",
        state: "California",
        country: "USA",
        lat: 37.7749,
        lng: -122.4194,
        name: "Charming Victorian Home",
        description:
          "Enjoy the charm of a Victorian home just steps away from Golden Gate Park.",
        price: 200,
      },
    ],
  },
  {
    ownerId: 3, // alice.johnson
    spots: [
      {
        address: "321 Birch St",
        city: "Santa Monica",
        state: "California",
        country: "USA",
        lat: 34.0194,
        lng: -118.4912,
        name: "Beachside Bungalow",
        description: "A cozy bungalow just steps from the beach.",
        price: 180,
      },
      {
        address: "987 Sunset Blvd",
        city: "Santa Monica",
        state: "California",
        country: "USA",
        lat: 34.0194,
        lng: -118.4912,
        name: "Ocean View Retreat",
        description: "Relax in this retreat with stunning ocean views.",
        price: 220,
      },
    ],
  },
  {
    ownerId: 5, // charlie.davis
    spots: [
      {
        address: "246 Spruce St",
        city: "Sacramento",
        state: "California",
        country: "USA",
        lat: 38.5816,
        lng: -121.4944,
        name: "Modern Studio",
        description: "A modern studio close to downtown.",
        price: 90,
      },
      {
        address: "369 Fir Dr",
        city: "Sacramento",
        state: "California",
        country: "USA",
        lat: 38.5816,
        lng: -121.4944,
        name: "Elegant Apartment",
        description: "An elegant apartment with great amenities.",
        price: 130,
      },
    ],
  },
  {
    ownerId: 6, // diana.miller
    spots: [
      {
        address: "975 Ash Blvd",
        city: "Los Angeles",
        state: "California",
        country: "USA",
        lat: 34.0522,
        lng: -118.2437,
        name: "Sunny Studio Near the Beach",
        description: "Enjoy the sun in this studio located near the beach.",
        price: 160,
      },
    ],
  },
  {
    ownerId: 1, // john.doe
    spots: [
      {
        address: "123 Maple St",
        city: "Los Angeles",
        state: "California",
        country: "USA",
        lat: 34.0522,
        lng: -118.2437,
        name: "Cozy Apartment in Downtown",
        description:
          "A beautiful and cozy apartment in the heart of downtown LA.",
        price: 150,
      },
    ],
  },
  {
    ownerId: 8, // frank.martinez
    spots: [
      {
        address: "852 Chestnut St",
        city: "San Diego",
        state: "California",
        country: "USA",
        lat: 32.7157,
        lng: -117.1611,
        name: "Downtown Loft",
        description: "A trendy loft in the heart of downtown San Diego.",
        price: 210,
      },
    ],
  },
  {
    ownerId: 4, // bob.brown
    spots: [
      {
        address: "135 Elm St",
        city: "San Diego",
        state: "California",
        country: "USA",
        lat: 32.7157,
        lng: -117.1611,
        name: "Charming Cottage",
        description: "A quaint cottage with a beautiful garden.",
        price: 120,
      },
    ],
  },
  {
    ownerId: 9, // grace.hernandez
    spots: [
      {
        address: "258 Maple St",
        city: "Los Angeles",
        state: "California",
        country: "USA",
        lat: 34.0522,
        lng: -118.2437,
        name: "Lovely Guest House",
        description: "A lovely guest house with private amenities.",
        price: 110,
      },
    ],
  },
  {
    ownerId: 10, // heidi.lopez
    spots: [
      {
        address: "741 Pine Rd",
        city: "San Francisco",
        state: "California",
        country: "USA",
        lat: 37.7749,
        lng: -122.4194,
        name: "Elegant Flat",
        description: "An elegant flat in the heart of the city.",
        price: 240,
      },
    ],
  },
  {
    ownerId: 11, // ivan.gonzalez
    spots: [
      {
        address: "123 Birch Ct",
        city: "Santa Barbara",
        state: "California",
        country: "USA",
        lat: 34.4208,
        lng: -119.6982,
        name: "Charming Beachfront Cottage",
        description: "A charming cottage right on the beach.",
        price: 250,
      },
    ],
  },
  {
    ownerId: 12, // judy.wilson
    spots: [
      {
        address: "654 Spruce Blvd",
        city: "Irvine",
        state: "California",
        country: "USA",
        lat: 33.6846,
        lng: -117.8265,
        name: "Modern Family Home",
        description: "A spacious family home with a backyard.",
        price: 300,
      },
    ],
  },
  {
    ownerId: 13, // karl.anderson
    spots: [
      {
        address: "321 Cedar Ln",
        city: "Riverside",
        state: "California",
        country: "USA",
        lat: 33.9533,
        lng: -117.3962,
        name: "Comfortable Apartment",
        description: "A comfortable apartment in a quiet neighborhood.",
        price: 120,
      },
    ],
  },
  {
    ownerId: 14, // lara.thomas
    spots: [
      {
        address: "135 Oak Dr",
        city: "Bakersfield",
        state: "California",
        country: "USA",
        lat: 35.3733,
        lng: -119.0187,
        name: "Spacious Loft",
        description: "A spacious loft with modern amenities.",
        price: 170,
      },
      {
        address: "246 Pine Ave",
        city: "Bakersfield",
        state: "California",
        country: "USA",
        lat: 35.3733,
        lng: -119.0187,
        name: "Luxury Suite",
        description: "A luxury suite in a prime location.",
        price: 350,
      },
    ],
  },
  {
    ownerId: 15, // luis.clark
    spots: [
      {
        address: "777 River Rd",
        city: "Napa",
        state: "California",
        country: "USA",
        lat: 38.2975,
        lng: -122.2869,
        name: "Charming Vineyard House",
        description: "A charming house set in a beautiful vineyard.",
        price: 300,
      },
    ],
  },
  {
    ownerId: 16, // nancy.adams
    spots: [
      {
        address: "321 Ocean Ave",
        city: "Santa Cruz",
        state: "California",
        country: "USA",
        lat: 36.9741,
        lng: -122.0308,
        name: "Beachfront Villa",
        description: "A stunning villa right on the beach.",
        price: 400,
      },
    ],
  },
  {
    ownerId: 7, // emily.jones
    spots: [
      {
        address: "789 Elm St",
        city: "Los Angeles",
        state: "California",
        country: "USA",
        lat: 34.0522,
        lng: -118.2437,
        name: "Luxury Apartment",
        description: "A luxury apartment with city views.",
        price: 280,
      },
      {
        address: "321 Willow St",
        city: "Los Angeles",
        state: "California",
        country: "USA",
        lat: 34.0522,
        lng: -118.2437,
        name: "Stylish Studio",
        description: "A stylish studio perfect for solo travelers.",
        price: 150,
      },
    ],
  },
  {
    ownerId: 7, // alice.smith
    spots: [
      {
        address: "245 Maple Ave",
        city: "Austin",
        state: "Texas",
        country: "USA",
        lat: 30.2672,
        lng: -97.7431,
        name: "Modern Loft",
        description:
          "Stylish loft in the heart of the city, close to nightlife.",
        price: 150,
      },
    ],
  },
  {
    ownerId: 1,
    spots: [
      {
        address: "101 Ocean Blvd",
        city: "Miami",
        state: "Florida",
        country: "USA",
        lat: 25.7617,
        lng: -80.1918,
        name: "Beachfront Villa",
        description: "Luxurious villa with stunning ocean views.",
        price: 300,
      },
      {
        address: "102 Ocean Blvd",
        city: "Miami",
        state: "Florida",
        country: "USA",
        lat: 25.7617,
        lng: -80.1918,
        name: "Beachfront Villa",
        description: "Luxurious villa with stunning ocean views.",
        price: 300,
      },
      {
        address: "103 Ocean Blvd",
        city: "Miami",
        state: "Florida",
        country: "USA",
        lat: 25.7617,
        lng: -80.1918,
        name: "Beachfront Villa",
        description: "Luxurious villa with stunning ocean views.",
        price: 300,
      },
      {
        address: "104 Ocean Blvd",
        city: "Miami",
        state: "Florida",
        country: "USA",
        lat: 25.7617,
        lng: -80.1918,
        name: "Beachfront Villa",
        description: "Luxurious villa with stunning ocean views.",
        price: 300,
      },
      {
        address: "105 Ocean Blvd",
        city: "Miami",
        state: "Florida",
        country: "USA",
        lat: 25.7617,
        lng: -80.1918,
        name: "Beachfront Villa",
        description: "Luxurious villa with stunning ocean views.",
        price: 300,
      },
    ],
  },
  {
    ownerId: 3, // emma.jones
    spots: [
      {
        address: "50 Pine St",
        city: "New York",
        state: "New York",
        country: "USA",
        lat: 40.7128,
        lng: -74.006,
        name: "Cozy Apartment",
        description: "A cozy apartment in a vibrant neighborhood.",
        price: 200,
      },
    ],
  },
  {
    ownerId: 10, // michael.brown
    spots: [
      {
        address: "789 Birch Dr",
        city: "Seattle",
        state: "Washington",
        country: "USA",
        lat: 47.6062,
        lng: -122.3321,
        name: "Spacious House",
        description:
          "A spacious house surrounded by nature, ideal for families.",
        price: 250,
      },
    ],
  },
];

const oldSpots = [
  {
    ownerId: 1,
    spots: [
      {
        address: "123 Disney Lane",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "App Academy",
        description: "Place where web developers are created",
        price: 123,
      },
      {
        address: "One N 19th St",
        city: "Philadelphia",
        state: "Pennsylvania",
        country: "United States of America",
        lat: 39.95593506998993,
        lng: -75.17066000792538,
        name: "Four Seasons Hotel Philadelphia",
        description: "Opposite Logan Square",
        price: 245,
      },
      {
        address: "310 W Broadway",
        city: "New York",
        state: "New York",
        country: "United States of America",
        lat: 40.72246544132899,
        lng: -74.00427697814119,
        name: "Soho Grand Hotel",
        description:
          "Near chic restaurants and shops in the trendy SoHo neighborhood",
        price: 275,
      },
      {
        address: "9641 Sunset Blvd",
        city: "Beverly Hills",
        state: "California",
        country: "United States of America",
        lat: 34.082532026513334,
        lng: -118.41319947262096,
        name: "The Beverly Hills Hotel",
        description:
          "Built in 1912, this haute hotel is an 8-minute walk from upscale shopping on Rodeo Drive",
        price: 499,
      },
    ],
  },
  {
    ownerId: 2,
    spots: [
      {
        address: "1435 Brickell Ave",
        city: "Miami",
        state: "Florida",
        country: "United States of America",
        lat: 25.75913800608972,
        lng: -80.19204138870693,
        name: "Four Seasons Hotel Miami",
        description:
          "Set in the financial district, this upscale hotel overlooks Biscayne Bay",
        price: 868,
      },
      {
        address: "515 15th St NW",
        city: "Washington",
        state: "District of Colombia",
        country: "United States of America",
        lat: 38.897175671414224,
        lng: -77.03323516122288,
        name: "Hotel Washington",
        description:
          "This artsy, modern hotel is housed in a storied 1917 beaux-arts building",
        price: 184,
      },
    ],
  },
];
module.exports = {
  demoSpots,
  oldSpots,
};
