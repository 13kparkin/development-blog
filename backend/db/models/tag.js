'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Tag.belongsTo(models.Post, { foreignKey: 'postId', onDelete: 'CASCADE' })
      Tag.belongsTo(models.Draft, { foreignKey: 'draftId', onDelete: 'CASCADE' })
    }
  }
  Tag.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    tag: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true
    },
    draftId: {
      type: DataTypes.INTEGER
    },
    postId: {
      type: DataTypes.INTEGER,
    },
  }, {
    sequelize,
    modelName: 'Tag',
  });
  return Tag;
};