'use strict';
const { Review } = require('../models');
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
const reviewArray = [
  {
    spotId: 1,
    userId: 3,
    review: 'Fantastic experience! Really enjoyed the amenities provided!',
    stars: 5
  },
  {
    spotId: 3,
    userId: 2,
    review: 'The staff were so nice!',
    stars: 5
  },
];

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
    for (const review of reviewArray) {
      const newReview = await Review.create(review);
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    for (const review of reviewArray) {
      const curReview = await Review.destroy({
        where: review
      });
    }
  }
};
