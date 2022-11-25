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

//========================================= 3rd point api ========================================================


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

//==================================== 4th point api ===========================================

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

//========================================== 6th point api ================================

let createCompaign = async function (req, res) {
    try {
        const requestBody = req.body;

        if (!isValidReqestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "Invalid request parameter. Please provide compaign details" });   
        }

        // Object Destructuring 
        let {id,userId, short_token, name, offers, enabled} = requestBody;

        // // Validation 

        let userDetails = await usersModel.findById({ _id: userId });
        if (!userDetails) {
            return res.status(404).send({ status: false, msg: "User does not exists" });
        }

        if (userId != req.userId) {
            return res.status(403).send({ status: false, message: "You Are Not Unauthorized" });
        }

        if (!isValid(id)) {
            return res.status(400).send({ status: false, msg: "Id is required" });   
        };

        if (!isValid(short_token)) {
            return res.status(400).send({ status: false, msg: "short_token is required" });    
        };
      
        if (!isValid(name)) {
            return res.status(400).send({ status: false, msg: "name is require" });     
        };

        if (!isValid(offers)) {
            return res.status(400).send({ status: false, msg: "offers is required" })     
        };

        // if (Array.isArray(offers)) {
        //     if (offers.length == 0) {
        //         return res.status(400).send({ status: false, message: "offers should not be empty" });
        //     }
        // }

        // if (Array.isArray(offers)) {
        //     for (let i = 0; i < offers.length; i++) {
        //         if (!isValid(offers[i])) {
        //             return res.status(400).send({ status: false, message: "Please enter the offers" });
        //         }
        //     }
        // }

        let compaignData = { id, short_token, name, offers,enabled }
        

        //compaignData = JSON.parse(JSON.stringify(compaignData));
        
        let newCompaign = await compaignModel.create(compaignData);
        res.status(201).send({ status: true, message: "compaignData created successfully", data: newCompaign })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

//========================================== 7th point apis ==================


const redirect = async function (req, res){
    const short_token = req.query.short_token;
    const click_id = req.query.click_id;
    

    //Find campaign
    const campaign = await compaignModel.findOne({short_token: short_token});

    if(!campaign){
          return res.status(404).send({message: "Campaign not found"});
    }
    if(!campaign.enabled){
          return res.status(404).send({message: "Campaign not enabled"});
    }
    const offers = campaign.offers;
    // console.log(typeof(offers))

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
    
    if(click_id){
          offer_url = offer_url.replace("{click_id}", click_id);
    }
    return res.status(200).redirect(offers);
}


//================================= 8th point Apis ========================

const toggleCampaign = async function (req, res){
    const id = req.params._id;

    
    const campaign = await compaignModel.findById(id);
    if(!campaign){
          return res.status(404).send({message: "Campaign not found"});
    };

    campaign.enabled = !campaign.enabled;
    const compaign_data = await campaign.save();
    return res.status(200).send({message: "Campaign toggled successfully", data :compaign_data});
}



module.exports = { createUser, loginUser,createCompaign ,toggleCampaign, redirect };