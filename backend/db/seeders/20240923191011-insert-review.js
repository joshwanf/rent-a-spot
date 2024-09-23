'use strict';
const { Review } = require('../models');
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
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
    await Review.bulkCreate(
      [        
        {
          spotId: 1,
          userId: 1,
          review: 'Fantastic experience! Really enjoyed the amenities provided!',
          stars: 5
        },
        {
          spotId: 2,
          userId: 2,
          review: 'Fantastic experience! Really enjoyed the amenities provided!',
          stars: 5
        },
      ],
      options
    );
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await Review.destroy(
      {
        where: {
          id: 1,
        }
      }
    );
  }
};
