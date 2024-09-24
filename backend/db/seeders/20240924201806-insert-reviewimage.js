'use strict';

/** @type {import('sequelize-cli').Migration} */
const imageArray = [
  {
    reviewId: 1,
    images: [
      { url: 'image-1.png' },
      { url: 'image-2.png' },
      { url: 'image-1.png' },
    ]
  },
  {
    reviewId: 2,
    images: [
      { url: 'image-1.png' },
      { url: 'image-2.png' },
      { url: 'image-1.png' },
    ]
  },
  {
    reviewId: 3,
    images: [
      { url: 'image-1.png' },
      { url: 'image-2.png' },
      { url: 'image-1.png' },
    ]
  },
  {
    reviewId: 4,
    images: [
      { url: 'image-1.png' },
      { url: 'image-2.png' },
      { url: 'image-1.png' },
    ]
  },
  {
    reviewId: 5,
    images: [
      { url: 'image-1.png' },
      { url: 'image-2.png' },
      { url: 'image-1.png' },
    ]
  },
]
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
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
