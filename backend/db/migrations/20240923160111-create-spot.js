'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Spots', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ownerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users' }
      },
      address: {
        type: Sequelize.TEXT,
      },
      city: {
        type: Sequelize.TEXT
      },
      state: {
        type: Sequelize.TEXT
      },
      country: {
        type: Sequelize.TEXT
      },
      lat: {
        type: Sequelize.FLOAT
      },
      lng: {
        type: Sequelize.FLOAT
      },
      name: {
        type: Sequelize.TEXT
      },
      description: {
        type: Sequelize.TEXT
      },
      price: {
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.addIndex(
      'Spots',
      ['address', 'city', 'state', 'country'],
      {
        unique: true
      }
    )
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Spots');
  }
};