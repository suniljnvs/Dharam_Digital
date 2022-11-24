let usersModel = require("../models/usersModel");
let compaignModel = require("../models/compaignsModel.js");
let jwt = require("jsonwebtoken");


const isValid = function (value) {

    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
}

const isValidReqestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
}

//=================================================================================================


let createUser = async function (req, res) {
    try {
        const requestBody = req.body;

        if (!isValidReqestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "Invalid request parameter. Please provide user details" });
            
        }

        // Object Destructuring 
        let {title, fname, lname, gender, email, password } = requestBody;

        // Validation 

        if (!isValid(title)) {
            return res.status(400).send({ status: false, msg: "Title is required" });
           
        };

        if (!isValid(fname)) {
            return res.status(400).send({ status: false, msg: "First name is required" });
            
        };
      
        if (!isValid(gender)) {
            return res.status(400).send({ status: false, msg: "gender should be among  Male, female, Other" });
            
        };

        if (!isValid(email)) {
            return res.status(400).send({ status: false, msg: "Email is required" })     
        };

        let emailIsAllreadyUsed = await usersModel.findOne({ email }) 
        if (emailIsAllreadyUsed) {
            return res.status(400).send({ status: false, msg: "Try another email,this email is already used "});
            
        };

        if (!isValid(password)) {
            return res.status(400).send({ status: false, msg: "Password is required" });
            
        };

        const userData = { title,fname, lname, gender, email, password }
        const newUser = await usersModel.create(userData);
        res.status(201).send({ status: true, message: "User created successfully", data: newUser })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

//====================================< login User >===========================================

const loginUser = async function(req, res){
    try {
        let requestBody = req.body;

        if (!isValidReqestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "Invalid request parameter. Please provide login details" });    
        };

        const { email, password } = requestBody;

        // validation 
        if (!isValid(email)) {
            return res.status(400).send({ status: false, msg: "Email is required" });     
        };

        if (!isValid(password)) {
            return res.status(400).send({ status: false, msg: "Password is required" });     
        };

        const user = await usersModel.findOne({ email, password });

        if (!user) {
            return res.status(400).send({ status: false, message: "Invalid login credential" });     
        };

        let token = await jwt.sign({
            userId: user._id,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 10 * 60 * 60
        },
         "Dharam_Digital");

        res.header('x-api-key', token);
        res.status(201).send({ status: true, message: "User login successfully", data: { token } })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    };
};

//==========================================================================




const redirect = async function (req, res){
    const short_token = req.query.short_token;
    const click_id = req.query.click_id;

    //Find campaign
    const campaign = await campaignModels.findOne({short_token: short_token});
    //If campaign not found or not enabled, serve error accordingly
    if(!campaign){
          return res.status(404).send({message: "Campaign not found"});
    }
    if(!campaign.enabled){
          return res.status(404).send({message: "Campaign not enabled"});
    }
    const offers = campaign.offers;

    //Distribute offers in manner that ratio_percentage mentioned in offer object is maintained.
    let totalRatio = 0;
    for(let i = 0; i < offers.length; i++){
          totalRatio += offers[i].ratio_percentage;
    }
    let random = Math.floor(Math.random() * totalRatio);
    let offer_url = "";
    for(let i = 0; i < offers.length; i++){
          random -= offers[i].ratio_percentage;
          if(random < 0){
                offer_url = offers[i].offer_url;
                break;
          }
    }
    //Replace macro {click_id} if present in offer_url with value received in click_id query parameter.
    if(click_id){
          offer_url = offer_url.replace("{click_id}", click_id);
    }
    return res.redirect(offer_url);
}


//================================= 8 Apis =====================

const toggleCampaign = async function (req, res){
    const id = req.params.id;
    const campaign = await compaignModel.findById(id);
    if(!campaign){
          return res.status(404).json({message: "Campaign not found"});
    }
    campaign.enabled = !campaign.enabled;
    await campaign.save();
    return res.status(200).send({message: "Campaign toggled successfully"});
}




module.exports = { createUser, loginUser,toggleCampaign, redirect };