'use strict';
const { ReviewImage } = require('../models');
/** @type {import('sequelize-cli').Migration} */
const imageArray = [
  {
    reviewId: 1,
    images: [
      { url: 'image-1.png' },
      { url: 'image-2.png', preview: true },
      { url: 'image-1.png' },
    ]
  },
  {
    reviewId: 2,
    images: [
      { url: 'image-1.png' },
      { url: 'image-2.png' },
      { url: 'image-1.png', preview: true },
    ]
  },
  {
    reviewId: 3,
    images: [
      { url: 'image-1.png', preview: true },
      { url: 'image-2.png' },
      { url: 'image-1.png' },
    ]
  },
  {
    reviewId: 4,
    images: [
      { url: 'image-1.png', preview: true },
      { url: 'image-2.png' },
      { url: 'image-1.png' },
    ]
  },
  {
    reviewId: 5,
    images: [
      { url: 'image-1.png' },
      { url: 'image-2.png' },
      { url: 'image-1.png', preview: true },
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
    for (const reviewImage of imageArray) {
      for (const image of reviewImage.images) {
        ReviewImage.create({
          reviewId: reviewImage.reviewId,
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
    for (const reviewImage of imageArray) {
      for (const image of reviewImage.images) {
        ReviewImage.destroy({
          where: {
            reviewId: reviewImage.reviewId,
            url: image.url,
            preview: image.preview || false
          }
        });
      }
    }
  }
};
