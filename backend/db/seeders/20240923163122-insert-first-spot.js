'use strict';
const { Spot, User } = require('../models');
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const spotsArray = [
  {
    firstName: 'Demo',
    lastName: 'User',
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
        lng:  -75.17066000792538,
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
        description: "Near chic restaurants and shops in the trendy SoHo neighborhood",
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
        description: "Built in 1912, this haute hotel is an 8-minute walk from upscale shopping on Rodeo Drive",
        price: 499,
      },
    ]
  },
  {
    firstName: 'Fake',
    lastName: 'User1',
    spots: [
      {
        address: "1435 Brickell Ave",
        city: "Miami",
        state: "Florida",
        country: "United States of America",
        lat: 25.75913800608972,
        lng: -80.19204138870693,
        name: "Four Seasons Hotel Miami",
        description: "Set in the financial district, this upscale hotel overlooks Biscayne Bay",
        price: 868,
      },
      {
        address: "515 15th St NW",
        city: "Washington",
        state: "District of Colombia",
        country: "United States of America",
        lat: 38.897175671414224,
        lng:  -77.03323516122288,
        name: "Hotel Washington",
        description: "This artsy, modern hotel is housed in a storied 1917 beaux-arts building",
        price: 184,
      },
    ]
  },
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    for (const owner of spotsArray) {
      const ownerRecord = await User.findOne({
        where: {
          firstName: owner.firstName,
          lastName: owner.lastName
        }
      });
      if (ownerRecord) {
        for (const spot of owner.spots) {
          const newSpot = await Spot.create(
            {
              ownerId: ownerRecord.id,
              ...spot
            }
          );
          // console.log(newSpot);
        }
      }
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    for (const owner of spotsArray) {
      const ownerRecord = await User.findOne({
        where: {
          firstName: owner.firstName,
          lastName: owner.lastName
        }
      });
      for (const spot of owner.spots) {
        const newSpot = await Spot.destroy({
          where: {
            ownerId: ownerRecord.id,
            ...spot
          }
        });
      }
    }
    // return queryInterface.bulkDelete(
    //   options, 
    //   {
    //     name: { [Op.in]: ['App Academy'] }
    //   }, 
    //   {}
    // );
  }
};
