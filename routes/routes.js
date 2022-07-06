const { response } = require('express');
const pool = require('../data/config');

const router = app => {
  app.get('/',(req,res)=>{
    res.send({
      message: 'Node.js and Express REST API 2.0'
    });
  });
  app.get('/tovars',(req,res)=>{
    let numPerPage = parseInt(req.query.npp,10) || 5;
    let page = parseInt(req.query.page,10) || 0;
    let skip = page * numPerPage;
    let numRows;
    let numPages;

    pool.query('SELECT count(*) as numRows FROM tovars', (error01,result01) => {
      if(error01) throw error01;
      numRows = result01[0].numRows;
      numPages = Math.ceil(numRows/numPerPage);
      
      let limit = skip + ',' + numPerPage;
      console.log(`numRows = ${numRows} numPages = ${numPages}`);

      pool.query('SELECT * FROM tovars LIMIT '+limit, (error02,result02) => {
        if(error02) throw error02;
        res.send(result02);
      });
    });
    
    // pool.query('SELECT * FROM tovars', (error,result) => {
    //   if(error) throw error;
    //   res.send(result);
    // });
//    res.send(req.query);
  });
  app.get('/tovars/:id',(req,res)=>{
    const id = req.params.id;
    pool.query('SELECT * FROM tovars WHERE id = ?',id, (error,result) => {
      if(error) throw error;
      res.send(result);
    });
  });

};

module.exports = router;