const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

const { Pool } = require('pg');
var pool = new Pool({
  
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

var app = express();
 
// Pretty sure this shouldn't occur, package.json should
// attempt to redirect you to menu.ejs first, but...
app.get('/', (req, res)=>{
  var getBoxList = `SELECT *  FROM boxes`;
  pool.query(getBoxList, (error,result) =>{
    if(error){
      console.log(error);
    }
    else{
      boxList = {results : result.rows }
      res.render('pages/menu', {boxList: boxList})
    }
  })
});


app.get('/menu', (req, res)=>{
  var getBoxList = `SELECT * FROM boxes`;
  pool.query(getBoxList, (error,result) =>{
    if(error){
      console.log(error);
    }
    else{
      var boxList = {results : result.rows };
      res.render('pages/menu', {boxList: boxList});
    }
  })
});

app.get('/singleBox', (res)=>{
  var boxname = '' // Need to pass a specific name into this function somehow
  var getBoxSingle = `SELECT ` + boxname + ` FROM boxes`; // Does JS include spaces when you concat?
  pool.query(getBoxSingle, (error,result) =>{
    if(error){
      res.end(error);
    }
    else{
      singleBox = { results : result.rows }
      res.render('pages/singleBox', {singleBox: singleBox});
    }
  })
});

app.get('/modifyBox.ejs/:boxName', (res)=>{
  var getBoxSingle = `SELECT ` + boxname + ` FROM boxes`; // Does JS include spaces when you concat?
  pool.query(getBoxSingle, (error,result) =>{
    if(error){
      res.end(error);
    }
    else{
      singleBox = { results : result.rows }
      res.render('pages/modifyBox', {singleBox: singleBox});
    }
  })
});

app.post('/modifyBox.ejs', (res)=>{
  // Not sure how to configure this best. Can we load all necessary data into
  // an array and save that or something?? Or do we just set one variable per value we
  // want to save and semi-hardcode it...?
  //
  // Function does nothing for now.
});

app.get('/addBox', (req,res)=>{
  res.render('pages/addBox');
});

app.post('/addBox', (req,res)=>{
console.log(req);

  var { nameInput, colorInput, hexInput, heightInput, widthInput, areaInput } = req.body;

  pool.query('INSERT INTO boxes (Name, ColorName, ColorHex, Height, Width, Area) VALUES ($1, $2, $3, $4, $5, $6)', [nameInput, colorInput, hexInput, heightInput, widthInput, areaInput], (error, res) => {
    if (error) {
      throw error;
    }
    res.redirect('/menu');
  })
});

app.get('/deleteBox/:boxName', (res)=>{
  // Doesn't yet do anything, obviously
  // Should send delete command to the DB, then redirect back to main page
  //
  // Because this doesn't actually need to render a specific page,
  // it's okay that deleteBox.ejs isn't a real file. Express will just
  // intercept the request and execute this function instead, which we can
  // get to just send us back to main, which will now have this box missing.
}); 

app
  .use(express.static(path.join(__dirname, 'public')))
  .use(express.static('public'))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/menu'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


// Lifted from https://stackoverflow.com/a/67612277
// Not 100% sure what this does, but seems to allow Express to properly handle
// the results of an HTML form and actually pass the body through?
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({limit: '5000mb', extended: true, parameterLimit: 100000000000}));
