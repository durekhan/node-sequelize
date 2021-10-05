"use strict";

module.exports = {
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable("postcategory", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        onDelete:'CASCADE',
        primaryKey: true,
      },
      postId:{
        type: DataTypes.INTEGER,
        field: 'post_id',
        references: {
          model: 'post',
          field: 'id'
        },
        onDelete:'CASCADE'
      },
      categoryId:{
        type: DataTypes.INTEGER,
        field: 'category_id',
        references: {
          model: 'category',
          field: 'id'
        },
        onDelete:'CASCADE'
      },
      createdAt: {
        type: DataTypes.DATE,
        field: "created_at",
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: "updated_at",
      },
      deletedAt: {
        type: DataTypes.DATE,
        field: "deleted_at",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
   return queryInterface.dropTable("postcategory");
  },
};
