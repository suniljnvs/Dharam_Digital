const express = require('express');

const router = express.Router();

// User Details
const { createUser, loginUser } = require("../controllers/controller.js");

// // Blog Details
// const { createBlog, GetBlog, updateBlog, deleteBlogById, deleteBlogByQuerParmas } = require('../controller/blogController');

// Check Creadentail and Authorization from middle ware
const { userAuth } = require("../middleware/middleware.js")


// API for user routes
router.post("/api/users", createUser)
router.post("/api/login", loginUser);

// API for blogs routes
// router.post("/blogs", autherAuth, createBlog);

// router.get("/blogs", autherAuth, GetBlog);

// router.put("/blogs/:blogId", autherAuth, updateBlog);

// router.delete("/blogs/:blogId", autherAuth, deleteBlogById);

// router.delete("/blogs", autherAuth, deleteBlogByQuerParmas);



module.exports = router;