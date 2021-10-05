const {Sequelize, Model, DataTypes} = require('sequelize');

class Postcategory extends Model {
  static associate(models) {
    Postcategory.belongsTo(models.Posts,{foreignKey:'postId'});
    Postcategory.belongsTo(models.Categories,{foreignKey:'categoryId'});
  }
}

Postcategory.init({
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
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at'
  },
  deletedAt: {
    type: DataTypes.DATE,
    field: 'deleted_at'
  }
}, {
  defaultScope: {
    attributes: { exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'] },
  },
  modelName: 'postcategory',
  paranoid: true,
  underscored: true,
  freezeTableName: true,
  sequelize: global.sequelize
});

module.exports = Postcategory;
