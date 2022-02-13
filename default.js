const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const { Pool } = require('pg');
var pool = new Pool({
  connectionString: "postgres://rusmgvqfhtxhfj:ce7ce46007e9ef72f8df9734a8105ccebe1d6ac5939cf1c2b37a5200e1f63a88@ec2-3-227-195-74.compute-1.amazonaws.com:5432/d7vrcnlr3b50c1" 
  // Github rightfully complains about this, it's a REALLY bad idea...
  // normally. In this case it's meaningless data, so who cares.
})

var app = express()

// Pretty sure this shouldn't occur, package.json should
// attempt to redirect you to menu.ejs first, but...
app.get('/', (res)=>{
  var getMinimalList = `SELECT Name, Color FROM boxes`;
  pool.query(getMinimalList, (error,result) =>{
    if(error){
      res.end(error);
    }
    else{
      minimalList = {results : result.rows }
      res.render('pages/menu', {minimalList: minimalList})
    }
  })
})

app.get('/menu', (req, res)=>{
  var getMinimalList = `SELECT Name, Color FROM boxes`;
  pool.query(getMinimalList, (error,result) =>{
    if(error){
      res.end(error);
    }
    else{
      var minimalList = {results : result.rows };
      res.render('pages/menu.ejs', {minimalList: minimalList});
    }
  })
})

app.get('/singleBox.ejs', (res)=>{
  var boxname = '' // Need to pass a specific name into this function somehow
  var getBoxSingle = `SELECT ` + boxname + ` FROM boxes`; // Does JS include spaces when you concat?
  pool.query(getBoxSingle, (error,result) =>{
    if(error){
      res.end(error);
    }
    else{
      singleBox = { results : result.rows }
      res.render('pages/singleBox.ejs', singleBox);
    }
  })
})

app.get('/modifyBox.ejs/:boxName', (res)=>{
  var getBoxSingle = `SELECT ` + boxname + ` FROM boxes`; // Does JS include spaces when you concat?
  pool.query(getBoxSingle, (error,result) =>{
    if(error){
      res.end(error);
    }
    else{
      singleBox = { results : result.rows }
      res.render('pages/modifyBox.ejs', singleBox);
    }
  })
})

app.post('/modifyBox.ejs', (res)=>{
  // Not sure how to configure this best. Can we load all necessary data into
  // an array and save that or something?? Or do we just set one variable per value we
  // want to save and semi-hardcode it...?
  //
  // Function does nothing for now.
})

app.post('/addBox.ejs', (res)=>{
  // This needs to add a new entry to the DB, while the above
  // modifies an existing entry.
})

app.get('/deleteBox/:boxName', (res)=>{
  // Doesn't yet do anything, obviously
  // Should send delete command to the DB, then redirect back to main page
  //
  // Because this doesn't actually need to render a specific page,
  // it's okay that deleteBox.ejs isn't a real file. Express will just
  // intercept the request and execute this function instead, which we can
  // get to just send us back to main, which will now have this box missing.
}); 

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/menu'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
