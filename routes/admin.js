var router = require('express').Router();
var Parse = require('parse/node')
var sha1 = require('sha1');
var Coordinators = Parse.Object.extend("Coordinators");
var Registration = Parse.Object.extend("Registration");
const cryptoRandomString = require('crypto-random-string');
var jwt = require('jsonwebtoken')
var {encrypt} = require('../crypto')
const {
    SECRET_KEY,
    REGISTERATION_SCORE,
    } = require('../config')


router.get('/',(req,res)=>{
    const { isAdminLoggedIn }  = req.session
    if(!isAdminLoggedIn) {
        res.redirect('/admin/login')
        return
    }
    res.render('pages/admin/index',{
        isAdminLoggedIn
    })
})

router.get('/login',(req,res)=>{
    let { isAdminLoggedIn }  = req.session
    if(isAdminLoggedIn) {
        res.redirect('/admin/')
        return
    }

    res.render('pages/admin/login',{
        isAdminLoggedIn
    })
})

router.get('/register',(req,res)=>{
    const { isAdminLoggedIn }  = req.session
    const registrationsAllowed = process.env.ALLOW_REGISTRATIONS
    if(isAdminLoggedIn && registrationsAllowed === "ALLOW") {
        res.redirect('/admin/')
        return
    }
    
    res.render('pages/admin/register',{
        isAdminLoggedIn:false
    })
})

router.get('/logout',(req,res)=>{
    req.session.isAdminLoggedIn = undefined
    res.redirect('/admin')
})


router.post('/login',async (req,res)=>{
    const {email,password} = req.body
    const securePassword = sha1(password)
    //for decryption game
    let payload = cryptoRandomString({length: 256, type: 'base64'});
    var token = jwt.sign(payload, SECRET_KEY);
    var cipherToken = encrypt(token);
    
    var query = new Parse.Query(Coordinators);
    query.equalTo("Email",email);
    const results = await query.find();
    if(results.length === 0) {
        req.session.currentAdminObjectId = undefined
        res.json({
            success:false,
            message:"Email not found. Please register",
        })
        return
    }
    //worst case: multiple registerations since no forget password mechanism
    //best case: almost 90% only 1 object will be found
    for (let i = 0; i < results.length; i++) {
        var object = results[i];
        if(securePassword === object.get("SecurePassword")){
            req.session.isAdminLoggedIn = true
            req.session.currentAdminObjectId = object.id
            req.session.adminEvent = object.get("Event")
            req.session.adminRRN = object.get("RRN")
            req.session.adminName = object.get("Name")
            req.session.adminPayload = payload
            res.json({
                success:true,
                token:cipherToken,
                message:"Login successful",
            })
            return
        }
    }
    res.json({
        success:false,
        message:"Login failed, Please check your Password. if problem persist please contact the event Coordinator",
    })
})

router.post('/register',async (req,res)=>{
    const {rrn,name,phone,email,password,event} = req.body

    var query = new Parse.Query(Coordinators);
    query.equalTo("RRN",rrn);
    const results = await query.find();
    if(results.length > 0) {
        res.json({
            success:false,
            message:"RRN already exists, Please login to continue.",
        })   
        return
    }

    let hashedPassword = sha1(password);
    let coordinator = new Coordinators();
    coordinator.set("RRN",rrn);
    coordinator.set("Name",name);
    coordinator.set("PhoneNumber",phone);
    coordinator.set("Email",email);
    coordinator.set("SecurePassword",hashedPassword);
    coordinator.set("Event",event);
    coordinator.save()
    .then(() => {
        res.json({
            success:true,
            message:"Registration successful",
        })
    })
    .catch((err) => {
        console.log(err.message)
        res.json({
            success:false,
            message:"Error in Registering, Please try again!",
        })
    })
})


module.exports = router;