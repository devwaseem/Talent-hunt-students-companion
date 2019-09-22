const ProtectedRoutes = require('express').Router();
const {decrypt} = require('../crypto')
const {SECRET_KEY,REGISTERATION_SCORE,PASSCODE,WINNER1_SCORE,RUNNER2_SCORE,RUNNER3_SCORE} = require('../config')
var jwt = require('jsonwebtoken')
var Parse = require('parse/node')
var Registration = Parse.Object.extend("Registration");
var History = Parse.Object.extend("History");

ProtectedRoutes.use((req, res, next) =>{
    const iv = req.headers['token_iv']
    const encryptedData = req.headers['token_data']
    if (iv && encryptedData) {
        var cipher = {iv,encryptedData}
        let token = decrypt(cipher)
        jwt.verify(token,SECRET_KEY, (err, decoded) =>{      
            if (err) {
                return res.json({ 
                    success: false,
                    message: 'Session expired. Please login Again'
                });    
            }
            // else if(decoded !== req.session.adminPayload){
            //     return res.json({ 
            //         success: false,
            //         message: 'Intrusion detected. Restarting server...'
            //     });   
            // }
            else {
                
                req.decoded = decoded;    
                next();
            }
        })
    } else {
      res.send({ 
            success:false,
            message: 'Problem with Login. Please login again!' 
      });

    }
  });


ProtectedRoutes.post('/:type',async (req,res)=>{
    const rrn = req.body.r
    const passcode = req.body.p
    let scoreIncrement = 0
    const type = parseInt(req.params.type)
    let textType = ""
    //type check
    if(type === 0){
        scoreIncrement = REGISTERATION_SCORE 
        textType = "Participating"
    }else if(type===1){
        scoreIncrement = WINNER1_SCORE
        textType = "Winning 1st Position"
    }else if(type===2){
        scoreIncrement = RUNNER2_SCORE
        textType = "Winning 2nd Position"
    }else if(type===3){
        scoreIncrement = RUNNER3_SCORE
        textType = "Winning 3rd Position"
    }else{
        return res.send({
            success:false,
            message:"Invalid address, Please try again!"
        })
    }

    if((type > 0) && (!passcode || passcode==="")){
        return res.send({
            success:false,
            message:"Invalid Passcode, Please try again!"
        })
    }

    if(type > 0 && passcode !== PASSCODE){
        return res.send({
            success:false,
            message:"Incorrect Passcode, Please try again!"
        })
    }

    var query = new Parse.Query(Registration);
    query.equalTo("RRN",rrn);
    query.descending("createdAt");
    const results = await query.find();
    if(results.length === 0) {
        req.session.currentAdminObjectId = undefined
        res.json({
            success:false,
            message:"RRN not found. Please Check the RRN again",
        })
        return
    }
    let data = results[0]
    let previousScore = parseInt(data.get("Score"))
    let newScore = previousScore + scoreIncrement
    data.set("Score",newScore)
    data.save()
    .then(()=>{
        let history = new History()
        let event = req.session.adminEvent
        let message = "You Earned " + scoreIncrement + "pts by " + textType + " in "+ event 
        history.set("Message",message);
        history.set("Student",rrn);
        history.set("Coordinator",req.session.adminRRN);
        history.set("CoordinatorName",req.session.adminName);
        history.set("Event",event);
        history.set("Score",scoreIncrement + "");
        history.save()
        res.send({
            success:true,
            message:"Score Updated Successfully"
        })
    })
    .catch((error)=>{
        console.log(error.message)
        res.send({
            success:false,
            message:"Problem updating the score. Please try again later."
        })
    })
    
})



module.exports = ProtectedRoutes