const express = require("express");
const router = express.Router();
const { Post, User, Draft, PostsImage, Search } = require("../../db/models");
const Sequelize = require('sequelize');

// Seed posts route
router.get("/seed", async (req, res) => {
  try {
    const usersId = await User.findAll({ attributes: ["id"] });
    const usersIdArray = usersId.map((user) => user.id);
    for (let i = 0; i < 10; i++) {
      const newPost = await Post.create({
        title: `Post #${i}`,
        body: `Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

        The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham. It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).`,
        description: `Description for post #${i}`,
        userId: usersIdArray[Math.floor(Math.random() * usersIdArray.length)],
      });
    }
    return res.status(200).json({ message: "Posts seeded" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Get all post route /api/posts/
router.get("/", async (req, res) => {
  try {
    const posts = await Post.findAll({
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

    return res.status(200).json({ posts });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: err.message });
  }
});

// Get all posts by user /api/posts/user/:id
router.get("/user/:id", async (req, res) => {
    try {
        const posts = await Post.findAll({
            where: {
                userId: req.params.id
            },
        });
        return res.status(200).json({ posts });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// Get post by draft id route
router.get("/draft/:id", async (req, res) => {
  console.log("inside posts route", req.params.id)
  try {
    const postByDraftId = await Post.findAll({
      where: {
        draftId: req.params.id,
      }
    });

    return res.status(200).json({ postByDraftId });
  } catch (err) {
    console.log(err.message)
    return res.status(500).json({ message: err.message });
  }
});

            

// Get post by id route /api/posts/:id
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
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

    return res.status(200).json({ post });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});


// POST single posts route /api/posts/
router.post("/", async (req, res) => {
    try {
        const { title, body, userId, description, updatedAt, draftId } = req.body;
        
        const newPost = await Post.create({
        title,
        body,
        userId,
        description,
        draftId,
        updatedAt
        });

        const imageId = await Draft.findByPk(draftId, {
          include: [
            {
              model: PostsImage,
              attributes: ["id"],
            },
          ],
        });


        const image = await PostsImage.findByPk(imageId.dataValues.PostsImages[0].id);
        await image.update({ postId: newPost.id });

    
        return res.status(200).json({ newPost });
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: err.message });
    }
    }
);

// Update post by id route
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    const {title, body, description, draftId, updatedAt } = req.body;
   const updatedPost = await post.update({ title, body, description, updatedAt });

   const imageId = await Draft.findByPk(draftId, {
    include: [
      {
        model: PostsImage,
        attributes: ["id"],
      },
    ],
  });

  const image = await PostsImage.findByPk(imageId.dataValues.PostsImages[0].id);
  await image.update({ postId: updatedPost.id });
    return res.status(200).json({ updatedPost });
  } catch (err) {
    console.log(err.message)
    return res.status(500).json({ message: err.message });
  }
});


// Delete post by id route
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    await post.destroy();
    return res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Search posts by title and body api/posts/search/:id
router.get('/search/:id', async (req, res) => {
  

  try {
    const Op = Sequelize.Op;
    const search = req.params.id;
    const results = await Post.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: `%${search}%` } },
          { body: { [Op.iLike]: `%${search}%` } },
        ]
      },
    });
    // get images by post id
    const postsImages = await PostsImage.findAll({
      where: {
        postId: results.map((post) => post.id),
      },
    });

    const finalImageUrl = postsImages;

    // map through results and add image url to each post
    results.map((post) => {
      post.dataValues.imageUrl = finalImageUrl.filter(
        (image) => image.postId === post.id
      )[0].url;
    });

    console.log(results)

    

    
    return res.status(200).json({ results });
  } catch (err) {
    console.log(err.message)
    return res.status(500).json({ message: err.message });
  }
});




module.exports = router;