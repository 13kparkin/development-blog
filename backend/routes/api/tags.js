const express = require("express");
const router = express.Router();
const { Tag } = require("../../db/models");

// Seed tags /api/tags/seed
router.get("/seed", async (req, res, next) => {
    try {
        const tags = await Tag.bulkCreate([
            { tag: "Projects" },
            { tag: "JavaScript" },
            { tag: "React" },
            { tag: "Redux" },
            { tag: "Node" },
            { tag: "Express" },
        
        ]);
        return res.status(200).json({ tags });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// Get all tags /api/tags/
router.get("/", async (req, res, next) => {
    try {
        const tags = await Tag.findAll();
        return res.status(200).json({ tags });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single tag /api/tags/:id
router.get("/:id", async (req, res, next) => {
    try {
        const tag = await Tag.findByPk(req.params.id);
        return res.status(200).json({ tag });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create new tag /api/tags/
router.post("/", async (req, res, next) => {
    const { tag, draftId, postId } = req.body;
    try {
        const tag = await Tag.create({ 
            tag, 
            draftId, 
            postId
        });
        return res.status(200).json({ tag });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update tag /api/tags/:id
router.put("/:id", async (req, res, next) => {
    const { tag, draftId, postId } = req.body;
    try {
        const tag = await Tag.findByPk(req.params.id);
        await tag.update({
            tag,
            draftId,
            postId
        });
        return res.status(200).json({ tag });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;