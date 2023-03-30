const express = require("express");
const router = express.Router();
const { Search } = require("../../db/models");


// Get all searches limited to 5 api/searches
router.get("/", async (req, res) => {

    
    const searches = await Search.findAll();


    const sortedSearches = searches.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    const limitedSearches = sortedSearches.slice(0, 5);
    return res.json(limitedSearches);
});

// Get search history for a specific user limited to 5  api/searches/:userId
router.get("/:userId", async (req, res) => {
    const { userId } = req.params;
    const searches = await Search.findAll({
        where: {
            userId
        }
    });

    const sortedSearches = searches.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    const limitedSearches = sortedSearches.slice(0, 5);
    return res.json(limitedSearches);
});

// Post a new search api/searches
router.post("/", async (req, res) => {
    const { searchHistory, userId } = req.body;
    const newSearch = await Search.create({ 
        history: searchHistory, 
        userId });
    return res.json(newSearch);
});


module.exports = router;