"use strict";
const { SpotImage } = require("../models");
const { demoSpotImages } = require("../../utils/demo-data");

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    console.log("demoSpotImages length", demoSpotImages.length);
    const allImages = demoSpotImages.map((spot) => {
      const images = spot.images.map((img) => ({
        spotId: spot.spotId,
        url: img.url,
        preview: img.preview || false,
      }));
      return images;
    });
    console.log("inserting images into spot", allImages);
    await SpotImage.bulkCreate(allImages);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const spotIds = demoSpotImages.map((spot) => spot.spotId);
    await SpotImage.destroy({
      where: {
        spotId: {
          [Sequelize.Op.in]: spotIds,
        },
      },
    });
  },
};
