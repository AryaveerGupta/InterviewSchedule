// importing the packages . 
const express = require('express');
const mongoose = require('mongoose');
const interview = require('./models/interview');
const User = require('./models/User');
const alert = require('alert');
const { response } = require('express');
const ejs = require('ejs');
const path = require('path');
// express app . 
const app = express();

// middlewares .  
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


// database connect , the listening on port 3000 will start when conneection is made .   
const dbURL = 'mongodb+srv://Aryaveer:1234@interview.jibosvz.mongodb.net/test';
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        app.listen(3000);
        console.log("Connected To DB Successfully!");
    })
    .catch((error) => console.log(error));

// get requestes to get the pages . 
app.get('/', async (req, res) => {
    res.render("home");
});

app.get('/edit', async (req, res) => {
    res.render("edit");
});

// upcoming interviews . 
app.get('/upcoming', async (req, res) => {
    // we will send the page , and the interviews , by populate the particitant array will contain the entire data of the user .   
    const inter = await interview.find().populate("participants");
    res.render("upcoming",
        {
            inter: inter,
        });
});

app.get('/create', async (req, res) => {

    const users = await User.find();
    res.render("create", {
        users: users
    });
});

// this if for testing . 
app.post('/createTemp', async (req, res) => {

    console.log(req.body);
    res.status(200).send("success")
})

const validation = async (new_inter) => {
    //if start >  end . 
    if (new_inter.start >= new_inter.end) {
        alert("end is less than start.");
        res.status(400).send("Their is a error");
    }

    // no of participants .
    if (new_inter.participants.length < 2) {
        alert("Number of participants less than 2.");
        res.status(400).send("Their is a error");
    }

    let flag = true;

    // all_inter are the interviews where participants are common with the new interview . 
    const all_inter = await interview.find({ participants: { $elemMatch: { $in: new_inter.participants } } });
    console.log(all_inter);

    // now if the time of these interview clashes with the new , throw an error . 
    for (let i = 0; i < all_inter.length; i++) {
        const inter = all_inter[i];
        if ((inter.start > new_inter.start && inter.start < new_inter.end) || (inter.end > new_inter.start && inter.end < new_inter.end) || (inter.start < new_inter.start && inter.end > new_inter.end)) {
            alert("participants have an overlap in interviews.");
            flag = false;
            break;
        }
    }
    return flag ; 
}

// to create the interview .  
app.post('/create', async (req, res) => {
    const new_inter = new interview(req.body); // req has the same schema as req.body . 
    // throwing a errors.
    console.log(req.body);
    
    let flag = validation(new_inter) ; 

    if (flag == true) {
        new_inter.save()
            .then((result) => alert("interview has been created."))
            .catch((err) => console.log(err));
    }
});

// updateing . 
app.post('/edit/:id', (req, res) => {

    const id = req.params.id;
    const inter = interview.findById(id) ; 
    let flag =  validation(inter) ;   
    if(flag == true)
    {
        interview.findByIdAndUpdate(id, { start: req.body.start, end: req.body.end, participants: req.body.participants })
        .then(result => {
            console.log(result);
            res.status(200).send(result);
        })
        .catch(err => {
            console.log(err);
        })
    }
});

// creating a get request to show all the interviews . 
app.get('/upcoming', async (req, res) => {
    const interviews = await interview.find();
    console.log(interviews);
    if (!interviews) {
        res.status(404).send("No interviews scheduled");
    }
    else {
        res.status(200).send(interviews);
    }
});

