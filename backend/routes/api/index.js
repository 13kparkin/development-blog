// backend/routes/api/index.js
const router = require("express").Router();
const sessionRouter = require("./session.js");
const usersRouter = require("./users.js");
const postsRouter = require("./posts.js");
const draftsRouter = require("./drafts.js");
const imagesRouter = require("./images.js");
const digitalBrainRouter = require("./DigitalBrainApi.js");
const searchesRouter = require("./searches.js");
const tagsRouter = require("./tags.js");
const { restoreUser } = require("../../utils/auth.js");

// Connect restoreUser middleware to the API router
// If current user session is valid, set req.user to the user in the database
// If current user session is not valid, set req.user to null

//routes
router.use(restoreUser);
router.use("/session", sessionRouter);
router.use("/users", usersRouter);
router.use("/posts", postsRouter);
router.use("/drafts", draftsRouter);
router.use("/images", imagesRouter);
router.use("/digitalBrain", digitalBrainRouter);
router.use("/searches", searchesRouter);
router.use("/tags", tagsRouter);

router.post("/test", (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;
