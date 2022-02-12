const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const { Pool } = require('pg');
var pool = new Pool({
  connectionString: "postgres://rusmgvqfhtxhfj:ce7ce46007e9ef72f8df9734a8105ccebe1d6ac5939cf1c2b37a5200e1f63a88@ec2-3-227-195-74.compute-1.amazonaws.com:5432/d7vrcnlr3b50c1" 
  // oh god hardcoding credentials
  // Github rightfully complains about this, it's a REALLY bad idea...
  // normally. In this case it's meaningless data, so who cares.
})

var app = express()

// Does this work? Is the 'get' I was using previously
// referring to the HTML request type??
app.getAll('/database', (res)=>{
  var getBoxList = `SELECT * FROM boxes`;
  pool.query(getBoxList, (error,result) =>{
    if(error){
      res.end(error);
    }
    else{
      boxList = { results : result.rows }
      res.render('pages/menu', boxList) // Do I need this? If it's executing on the .ejs page, doesn't this happen already?
    }
  })
})

app.getMinimal('/database', (res)=>{
  var getMinimalList = `SELECT Name, Color FROM boxes`;
  pool.query(getMinimalList, (error,result) =>{
    if(error){
      res.end(error);
    }
    else{
      minimalList = {results : result.rows }
      res.render('pages/menu', boxList)
    }
  })
})

// see above
app.getOne('/database', (res)=>{
  var boxname = '' // Need to pass a specific name into this function somehow
  var getBoxSingle = `SELECT ` + boxname + ` FROM boxes`; // Does JS include spaces when you concat?
  pool.query(getBoxSingle, (error,result) =>{
    if(error){
      res.end(error);
    }
    else{
      singleBox = { results : result.rows }
      res.render('pages/singleBox.ejs', singleBox); // See above, may be unnecessary?
    }
  })
})


// see above; though this should be a post instead of get
app.save('/database', (res)=>{
  // Not sure how to configure this best. Can we load all necessary data into
  // an array and save that or something?? Or do we just set one variable per value we
  // want to save and semi-hardcode it...?
  //
  // Function does nothing for now.
})

app.deleteBox(); // Doesn't yet do anything, obviously
                 // Should send delete command to the DB, then redirect back to main page

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/menu'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
