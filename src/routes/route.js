const express = require('express');

const router = express.Router();

// All controllers api import hear
const { createUser, loginUser, createCompaign, redirect,toggleCampaign } = require("../controllers/controller.js");


// Check Creadentail and Authorization from middle ware
const { userAuth } = require("../middleware/middleware.js")


// API for user routes
router.post("/api/users", createUser)
router.post("/api/login", loginUser);


router.post("/createCompaign",userAuth,  createCompaign);
router.get("/api/redirect",/*middleware.userAuth*/  redirect);
router.get("/api/admin/campaigns", /*middleware.userAuth*/toggleCampaign);



module.exports = router;