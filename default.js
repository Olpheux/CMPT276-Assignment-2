const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || 5000;

const { Pool } = require('pg');
var pool = new Pool({
  
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

var app = express();

app.use(bodyParser.urlencoded({extended: true,}))
 
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

app.get('/singleBox/:boxname', (req, res)=>{
  pool.query(`SELECT * FROM boxes WHERE \"Name\"=$1`, [req.params.boxname], (error,result) =>{
    if(error){ throw error; }
    else{
      singleBox = { results : result.rows }
      res.render('pages/singleBox', {singleBox: singleBox});
    }
  })
});

app.get('/modifyBox/:boxName', (req, res)=>{
  pool.query(`SELECT * FROM boxes WHERE \"Name\"=$1`, [req.params.boxName], (error,result) =>{
    if(error){ throw error; }
    else{
      singleBox = { results : result.rows }
      res.render('pages/modifyBox', {singleBox: singleBox});
    }
  })
});

app.post('/modifyBox/:boxName', (req, res)=>{
  
  var { nameInput, colorInput, hexInput, heightInput, widthInput, areaInput, IDInputDisabled } = req.body;

  console.log("====DEBUG====");
  console.log(req.body);
  console.log("======")

  pool.query(`UPDATE public.boxes SET \"Name\"=$1, \"ColorName\"=$2, \"ColorHex\"=$3, \"Height\"=$4, \"Width\"=$5, \"Area\"=$6 WHERE \"ID\"=$7`, [nameInput, colorInput, hexInput, heightInput, widthInput, areaInput, IDInputDisabled], (error,result) =>{
    if(error){ throw error; }
    else{
      res.redirect('/menu');
    }
  })
});

app.get('/addBox', (req,res)=>{
  res.render('pages/addBox');
});

app.post('/addBox', (req,res)=>{

  var { nameInput, colorInput, hexInput, heightInput, widthInput, areaInput } = req.body;

  pool.query(`INSERT INTO public.boxes(\"Name\", \"ColorName\", \"ColorHex\", \"Height\", \"Width\", \"Area\") VALUES ($1, $2, $3, $4, $5, $6)`, [nameInput, colorInput, hexInput, heightInput, widthInput, areaInput], (error, res) => {
    if (error) { throw error; }
  })

  var getBoxList = `SELECT *  FROM boxes`;
  pool.query(getBoxList, (error,result) =>{
    if(error){
      console.log(error);
    }
    else{
      res.redirect('/menu')
    }
  })
});

app.get('/deleteBox/:boxName', (req, res)=>{
  pool.query(`DELETE FROM boxes WHERE \"Name\"=$1`, [req.params.boxName], (error, result)=>{
    if(error){ throw error; }
    else{
      res.redirect('/menu');
    }
  })
}); 

app
  .use(express.static(path.join(__dirname, 'public')))
  .use(express.static('public'))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/menu'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))