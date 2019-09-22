var express = require('express');
var app = express();
var favicon = require('serve-favicon')
var path = require('path')
var morgan = require('morgan')
var cookieParser = require('cookie-parser');
var session = require('express-session')
var parser = require('body-parser');
var Parse = require('parse/node');
var PORT = process.env.PORT || 5000

Parse.initialize("KF4YtLAwJgriUKo3ZazzIK8RjA5bIjiMiXkoZL1S", "5cCXSAnDx5nWHtUJj7SpO3Xi9wfO5MDiTv2EEemh");
Parse.serverURL = "https://parseapi.back4app.com/";
const {SECRET_KEY} = require('./config')

var Registration = Parse.Object.extend("Registration");
var History = Parse.Object.extend("History");

app.use(favicon(__dirname + '/public/favicon.ico'));
app.set('Secret', SECRET_KEY );
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(cookieParser());
app.use(parser.json());
app.use(parser.urlencoded({extended:false}));
// app.use(morgan('combined'))
// morgan(':method :url :status :res[content-length] - :response-time ms')

var sess = session({
    secret:"abcd", 
    saveUninitialized : true, 
    resave : true,
    cookie: {  }
})

if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie = {
        secure: true
    } 
}

app.use(sess);
app.use('/',require('./routes/auth'))
app.use('/student',require('./routes/student'))
app.use('/admin',require('./routes/admin'))
app.use('/admin/u',require('./routes/protectedAdminRoutes'))



app.get('/', async function(req, res) {
    let isLoggedIn = req.session.isLoggedIn
    if(!isLoggedIn) {
        res.redirect('/login')
        return
    }
    var query = new Parse.Query(Registration);
    console.log(req.session.currentUserObjectId);
    query.equalTo("objectId",req.session.currentUserObjectId);
    //fetch the latest record to avoid forget password handling
    query.descending("createdAt");
    const results = await query.find();
    if(results.length > 0 ) {
        var data = results[0]
        res.render('pages/index',{
            isLoggedIn:true,
            rrn:data.get("RRN"),
            name:data.get("Name"),
            year:data.get("Year"),
            section:data.get("Section"),
            score:data.get("Score"),
        });
    }else{
        res.render('pages/index',{
            isLoggedIn:false
        });
        return
    }

   
});

app.get('/leaderboard/:page',async (req,res)=>{
    // let isLoggedIn = req.session.isLoggedIn
    // if(!isLoggedIn) {
    //     res.redirect('/login')
    //     return
    // }

    var currentPage = parseInt(req.params.page)
    const countQuery = new Parse.Query(Registration);
    const totalRecords = await countQuery.count();
    const maxpage = Math.ceil(totalRecords / 10)
    console.log(totalRecords,maxpage)
    var scoreQuery = new Parse.Query(Registration);
    scoreQuery.descending("Score");
    scoreQuery.select("RRN","Name","Score");
    scoreQuery.limit = 10
    scoreQuery.skip = currentPage * 10
    const results = await scoreQuery.find();
    let leaderboard = []
    for(let i=0;i<results.length;i++){
        leaderboard.push({
            position:i+1,
            name:results[i].get("Name"),
            score:results[i].get("Score"),
            rrn:results[i].get("RRN"),
        })
    }
    res.render('pages/leaderboard',{
        isLoggedIn:req.session.isLoggedIn,
        leaderboard,
        page:currentPage + 1,
        maxpage
    })
})

app.get('/events',(req,res)=>{
    let isLoggedIn = req.session.isLoggedIn
    res.render('pages/events',{
        isLoggedIn
    })
})

app.get('/history',async (req,res)=>{
    let isLoggedIn = req.session.isLoggedIn

    if(!isLoggedIn) {
        res.redirect('/login')
        return
    }
    var historyQuery = new Parse.Query(History);
    historyQuery.descending("createdAt");
    historyQuery.equalTo("Student",req.session.rrn);
    const results = await historyQuery.find();
    let history = []
    for(let i=0;i<results.length;i++){
        history.push(results[i].get("Message"))
    }

    res.render('pages/history',{
        isLoggedIn,
        history
    })
})
//handle 404
// app.get("*",(req,res)=>{
//     res.redirect('/')
// })

app.listen(PORT,()=>{
    console.log("Server running on port: " + PORT)
});