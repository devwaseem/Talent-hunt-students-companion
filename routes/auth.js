var router = require('express').Router();
var Parse = require('parse/node')
var Registration = Parse.Object.extend("Registration");


router.get('/login',(req,res)=>{
    if(req.session.isLoggedIn){
        res.redirect('/')
        return
    }
    res.render('pages/login', {
        isLoggedIn:false
    })
})

router.get('/register',(req,res)=>{
    if(req.session.isLoggedIn){
        res.redirect('/')
        return
    }

    res.render('pages/register', {
        isLoggedIn:false,
    })
})

router.get('/logout',(req,res)=>{
    req.session.isLoggedIn = undefined
    req.session.rrn = undefined
    req.session.currentUserObjectId = undefined
    res.redirect('/login')
})

router.post('/register',async (req,res)=>{
    const {rrn,name,year,section,email,phone} = req.body
    
    var query = new Parse.Query(Registration);
    query.equalTo("RRN",rrn);
    const results = await query.find();
    if(results.length > 0) {
        res.json({
            success:false,
            message:"RRN already exists, Please login to continue.",
        })   
        return
    }
    var registration = new Registration();
    registration.set("RRN",rrn)
    registration.set("Name",name)
    registration.set("Year",year)
    registration.set("Section",section)
    registration.set("email",email)
    registration.set("phoneNumber",phone)
    registration.set("Score",0)
    registration.save()
    .then(()=>{
        res.json({
            success:true,
            message:"Registration successful",
        })
    })
    .catch((error)=>{
        console.log(error.message)
        res.json({
            success:false,
            message:"Error in Registering, Please try again!",
        })
    })
})

router.post('/login',async (req,res)=>{
    const {rrn,phone} = req.body;
    var query = new Parse.Query(Registration);
    query.equalTo("RRN",rrn);
    query.ascending("createdAt");
    const results = await query.find();
    if(results.length === 0) {
        req.session.currentUserObjectId = undefined
        res.json({
            success:false,
            message:"RRN not found. Please register",
        })
        return
    }

    for (let i = 0; i < results.length; i++) {
        var object = results[i];
        if(phone === object.get("phoneNumber")){
            req.session.isLoggedIn = true
            req.session.currentUserObjectId = object.id
            req.session.rrn = rrn
            res.json({
                success:true,
                message:"Login successful",
            })
            return
        }
    }
    res.json({
        success:false,
        message:"Login failed, Please check your Phone number. if problem persist please contact the event Coordinator",
    })

})

module.exports = router