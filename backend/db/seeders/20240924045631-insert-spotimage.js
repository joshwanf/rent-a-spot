'use strict';
const { SpotImage } = require('../models');
/** @type {import('sequelize-cli').Migration} */
const imageArray = [
  {
    spotId: 1,
    images: [
      { url: 'living-room-1.png' },
      { url: 'living-room-2.png' },
      { url: 'bedroom-1.png' },
      { url: 'bedroom-2.png' },
      { url: 'bedroom-3.png' },
      { url: 'bathroom-1.png' },
      { url: 'bathroom-2.png' },
      { url: 'front-1.png', preview: true },
    ]
  },
  {
    spotId: 2,
    images: [
      { url: 'living-room-1.png' },
      { url: 'living-room-2.png' },
      { url: 'bedroom-1.png' },
      { url: 'bedroom-2.png' },
      { url: 'bathroom-1.png' },
      { url: 'front-1.png', preview: true },
    ]
  },
  {
    spotId: 3,
    images: [
      { url: 'living-room-1.png' },
      { url: 'living-room-2.png' },
      { url: 'bedroom-1.png' },
      { url: 'bedroom-2.png' },
      { url: 'bedroom-3.png' },
      { url: 'bathroom-1.png' },
      { url: 'bathroom-2.png' },
      { url: 'front-1.png', preview: true },
    ]
  },
  {
    spotId: 4,
    images: [
      { url: 'living-room-1.png' },
      { url: 'living-room-2.png' },
      { url: 'bedroom-1.png' },
      { url: 'bedroom-2.png' },
      { url: 'bedroom-3.png' },
      { url: 'bathroom-1.png' },
      { url: 'bathroom-2.png' },
      { url: 'front-1.png', preview: true },
    ]
  },
  {
    spotId: 5,
    images: [
      { url: 'living-room-1.png' },
      { url: 'living-room-2.png' },
      { url: 'bedroom-1.png' },
      { url: 'bedroom-2.png' },
      { url: 'bedroom-3.png' },
      { url: 'bathroom-1.png' },
      { url: 'bathroom-2.png' },
      { url: 'front-1.png', preview: true },
    ]
  },
  {
    spotId: 6,
    images: [
      { url: 'living-room-1.png' },
      { url: 'living-room-2.png' },
      { url: 'bedroom-1.png' },
      { url: 'bedroom-2.png' },
      { url: 'bedroom-3.png' },
      { url: 'bathroom-1.png' },
      { url: 'bathroom-2.png' },
      { url: 'front-1.png', preview: true },
    ]
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
    for (const spotImages of imageArray) {
      for (const image of spotImages.images) {
        SpotImage.create({
          spotId: spotImages.spotId,
          url: image.url,
          preview: image.preview || false
        });
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
    for (const spotImages of imageArray) {
      for (const image of spotImages.images) {
        SpotImage.destroy({
          where: {
            spotId: spotImages.spotId,
            url: image.url,
            preview: image.preview || false
          }
        });
      }
    }
  }
};
