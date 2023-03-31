'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TagDraftPost extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TagDraftPost.init({
    postId: {
      type: DataTypes.INTEGER,
    },
    draftId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Drafts' }
    },
    tagId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Tags' }
    }
  }, {
    sequelize,
    modelName: 'TagDraftPost',
  });
  return TagDraftPost;
};