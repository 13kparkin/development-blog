const express = require("express");
const router = express.Router();
const { Post, User, Draft, PostsImage, Search } = require("../../db/models");


// Get all draft route /api/drafts/
router.get("/", async (req, res) => {
  try {
    const drafts = await Draft.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "username", "firstName", "lastName"],
        },
        {
          model: PostsImage,
        },
      ],
    });

    return res.status(200).json({ drafts });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Get all drafts by user /api/drafts/user/:id
router.get("/user/:id", async (req, res) => {
  try {
    const drafts = await Draft.findAll({
      where: {
        userId: req.params.id,
      },
      include: [
        {
          model: User,
          attributes: ["id", "username", "firstName", "lastName"],
        },
        {
          model: PostsImage,
        },
      ],
    });
    return res.status(200).json({ drafts });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Get draft by id route
router.get("/:id", async (req, res) => {
  try {
    const draft = await Draft.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["id", "username", "firstName", "lastName"],
        },
        {
          model: PostsImage
        },
      ],
    });

    return res.status(200).json({ draft });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});



// POST single drafts route /api/drafts/
router.post("/", async (req, res) => {
  try {
    const { title, body, userId, description } = req.body;

    const newDraft = await Draft.create({
      title,
      body,
      userId,
      description,
    });

    return res.status(200).json({ newDraft });
  } catch (err) {
    console.log(err.message)
    return res.status(500).json({ message: err.message });
  }
});

// Update draft by id route
router.put("/:id", async (req, res) => {
  try {
    const draft = await Draft.findByPk(req.params.id);
    const { title, body, description } = req.body;
    await draft.update({ title, body, description });
    return res.status(200).json({ draft });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Delete draft by id route
router.delete("/:id", async (req, res) => {
  try { 
    const draft = await Draft.findByPk(req.params.id);
    const posts = await Post.findAll({
      where: {
        draftId: req.params.id,
      },
    });
    await posts.forEach(async (post) => {
      await post.destroy();
    });
    const draftImages = await PostsImage.findAll({
      where: {
        draftId: req.params.id,
      },
    });
    await draftImages.forEach(async (image) => {
      await image.destroy();
    });
    await draft.destroy();
    return res.status(200).json({ message: "Draft deleted" });
  } catch (err) {
    console.log(err.message)
    return res.status(500).json({ message: err.message });
  }
});

// Create a image
router.post("/:id/images", async (req, res) => {
  console.log("body",req.body)
  try {
    
    const { postId, url, draftId } = req.body;
    
    const newImage = await PostsImage.create({
      postId,
      url,
      draftId,
    });
    return res.status(200).json({ newImage });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
