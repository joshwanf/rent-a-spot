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
    SpotImage.bulkCreate(allImages);
    // for (const spot of demoSpotImages) {
    //   console.log("inserting images into spot", spot);
    //   const images = spot.images.map((image) => ({
    //     spotId: spot.spotId,
    //     url: image.url,
    //     preview: image.preview || false,
    //   }));
    //   SpotImage.bulkCreate(images);
    //   // for (const image of images) {
    //   // }
    // }
    // for (const spotImages of demoSpotImages) {
    //   for (const image of spotImages.images) {
    //     SpotImage.create({
    //       spotId: spotImages.spotId,
    //       url: image.url,
    //       preview: image.preview || false,
    //     });
    //   }
    // }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const spotIds = demoSpotImages.map((spot) => spot.spotId);
    SpotImage.destroy({
      where: {
        spotId: {
          [Sequelize.Op.in]: spotIds,
        },
      },
    });
    // for (const spotImages of demoSpotImages) {
    //   for (const image of spotImages.images) {
    //     SpotImage.destroy({
    //       where: {
    //         spotId: spotImages.spotId,
    //         url: image.url,
    //         preview: image.preview || false,
    //       },
    //     });
    //   }
    // }
  },
};
