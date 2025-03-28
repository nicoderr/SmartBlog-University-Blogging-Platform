const express = require("express");
const router = express.Router();
const { addPostToIndex, searchPosts } = require("../controllers/ElasticSearchController");

router.post("/index", addPostToIndex);
router.post("/search", searchPosts);

module.exports = router;
