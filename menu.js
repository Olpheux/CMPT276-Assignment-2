const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const { DB } = require('pg');
var db = new DB({
  connectionString: "postgres://postgres:admin@localhost/cmpt276a2" // oh god hardcoding credentials
})

var app = express()

app.get('/database', (req,res)=>{
  var getBoxList = `SELECT * FROM boxes`;
  db.query(getBoxList, (error,result) =>{
    if(error){
      res.end(error);
    }
    else{
      // Need to get boxList somehow?
      boxList = { results : result.rows }
      res.render('pages/menu', boxList)
    }
  })
})

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/menu'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
