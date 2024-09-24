'use strict';
const { Booking } = require('../models');
/** @type {import('sequelize-cli').Migration} */
const bookingArray = [
  {
    spotId: 1,
    userId: 3,
    startDate: "2024-09-23",
    endDate: "2024-09-26",
  },
  {
    spotId: 2,
    userId: 3,
    startDate: "2024-09-29",
    endDate: "2024-10-03",
  },
  {
    spotId: 1,
    userId: 2,
    startDate: "2024-09-25",
    endDate: "2024-09-27",
  },
  {
    spotId: 6,
    userId: 1,
    startDate: "2024-09-23",
    endDate: "2024-09-28",
  },
  {
    spotId: 3,
    userId: 2,
    startDate: "2024-10-01",
    endDate: "2024-10-05",
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
    for (const booking of bookingArray) {
      booking.startDate = new Date(booking.startDate + 'T15:00:00');
      booking.endDate = new Date(booking.endDate + 'T11:00:00');
      const newBooking = await Booking.create(booking);
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    for (const booking of bookingArray) {
      booking.startDate = new Date(booking.startDate + 'T15:00:00');
      booking.endDate = new Date(booking.endDate + 'T11:00:00');
      const newBooking = await Booking.destroy({
        where: booking
      });
    }
  }
};
