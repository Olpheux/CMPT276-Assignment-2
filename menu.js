const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const { Pool } = require('pg');
var pool = new Pool({
  connectionString: "postgres://rusmgvqfhtxhfj:ce7ce46007e9ef72f8df9734a8105ccebe1d6ac5939cf1c2b37a5200e1f63a88@ec2-3-227-195-74.compute-1.amazonaws.com:5432/d7vrcnlr3b50c1" // oh god hardcoding credentials
})

var app = express()

app.get('/database', (res)=>{
  var getBoxList = `SELECT * FROM boxes`;
  pool.query(getBoxList, (error,result) =>{
    if(error){
      res.end(error);
    }
    else{
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
