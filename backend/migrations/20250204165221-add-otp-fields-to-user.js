module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.addColumn("Users", "otp_code", {
          type: Sequelize.STRING,
          allowNull: true,
      });
      await queryInterface.addColumn("Users", "otp_expiry", {
          type: Sequelize.DATE,
          allowNull: true,
      });
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.removeColumn("Users", "otp_code");
      await queryInterface.removeColumn("Users", "otp_expiry");
  }
};
