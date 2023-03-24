const express = require("express");
const router = express.Router();
const { Post, User, Draft, PostsImage, Search } = require("../../db/models");

// edit images route
router.put("/:id", async (req, res) => {
  try {
    const { url, postId, draftId } = req.body;
    const image = await PostsImage.findByPk(req.params.id);
    if (image) {
      await image.update({ url, postId, draftId });
      return res.status(200).json({ image });
    } else {
      return res.status(404).json({ message: "Image not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
