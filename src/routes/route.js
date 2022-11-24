const express = require('express');

const router = express.Router();

// User Details
const { createUser, loginUser, createCompaign, redirect,toggleCampaign } = require("../controllers/controller.js");

// // Blog Details
// const { createBlog, GetBlog, updateBlog, deleteBlogById, deleteBlogByQuerParmas } = require('../controller/blogController');

// Check Creadentail and Authorization from middle ware
const { userAuth } = require("../middleware/middleware.js")


// API for user routes
router.post("/api/users", createUser)
router.post("/api/login", loginUser);

// API for blogs routes
router.post("/createCompaign",  createCompaign);
router.get("/api/redirect",  redirect);
router.get("/api/toggle",  toggleCampaign);

// router.get("/blogs", autherAuth, GetBlog);

// router.put("/blogs/:blogId", autherAuth, updateBlog);

// router.delete("/blogs/:blogId", autherAuth, deleteBlogById);

// router.delete("/blogs", autherAuth, deleteBlogByQuerParmas);



module.exports = router;