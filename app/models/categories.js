const {Sequelize, Model, DataTypes} = require('sequelize');

class Category extends Model {
  static associate(models) {
    Category.belongsToMany(models.Posts,{through: models.Postcategories,foreignKey:"categoryId",onDelete:'CASCADE'});
  }
}

Category.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
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
  modelName: 'category',
  paranoid: true,
  underscored: true,
  freezeTableName: true,
  sequelize: global.sequelize
});

module.exports = Category;
