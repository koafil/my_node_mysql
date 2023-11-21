const { response } = require('express');
const pool = require('../data/config');

const router = app => {
  app.get('/',(req,res)=>{
    res.send({
      message: 'Node.js and Express REST API 2.0'
    });
  });

  app.get('/articul',(req,res)=>{
    let numRows;
    pool.query('SELECT count(articul) as numRows FROM tovars', (error01,result01) => {
      if (error01) throw error01;
      numRows = result01[0].numRows;
      console.log(`\\articul numRows = ${numRows} `);
    });
    pool.query('SELECT articul FROM tovars', (error02,result02) => {
      if (error02) throw error02;
      let articulList = result02.map(item=>{
        return item.articul;
      });
      res.send({total: numRows, rowData: articulList});
    });
  });

  app.get('/tovars',(req,res)=>{
    let findKey = req.query.s || "";
    let findKeyArr = req.query.ss || "";
    let numPerPage = parseInt(req.query.npp,10) || 5;
    let page = parseInt(req.query.page,10) || 1;
    let skip = (page - 1) * numPerPage;
    let numRows;
    let numPages;
//    console.log(JSON.parse(findKeyArr));
//    console.log(findKeyArr);
    if (!findKey && !findKeyArr){
      pool.query('SELECT count(*) as numRows FROM tovars', (error01,result01) => {
        if(error01) throw error01;
        numRows = result01[0].numRows;
        numPages = Math.ceil(numRows/numPerPage);

        let limit = skip + ',' + numPerPage;
        console.log(`numRows = ${numRows} numPages = ${numPages}`);

        pool.query('SELECT * FROM tovars LIMIT '+limit, (error02,result02) => {
          if(error02) throw error02;
          res.send({total: numRows, rowData: result02});
        });
      });
    } else if(findKey){
      pool.query(`SELECT count(*) as numRows FROM tovars WHERE articul LIKE '%${findKey}%'`, (error01,result01) => {
        if(error01) throw error01;
        numRows = result01[0].numRows;
        numPages = Math.ceil(numRows/numPerPage);

        let limit = skip + ',' + numPerPage;
        console.log(`numRows = ${numRows} numPages = ${numPages} findKey = ${findKey}`);

        pool.query(`SELECT * FROM tovars WHERE articul LIKE '%${findKey}%' LIMIT ${limit}`, (error02,result02) => {
          if(error02) throw error02;
          res.send({findKey, total: numRows, rowData: result02});
      });
      });
    } else {
      let findKeyArrParsed = JSON.parse(findKeyArr);
      console.log(findKeyArrParsed);
      console.log(`count = ${findKeyArrParsed.length}`);
      let strLike= "";
      if(findKeyArrParsed.length){
        strLike=`WHERE articul LIKE '%${findKeyArrParsed[0]}%'`;
        findKeyArrParsed.forEach((v,i,a) => {
          if(i){
            strLike=`${strLike} OR articul LIKE '%${v}%'`
          }
        });
      }
      console.log(strLike);
      pool.query(`SELECT count(*) as numRows FROM tovars ${strLike}`, (error01,result01) => {
        if(error01) throw error01;
        numRows = result01[0].numRows;
        numPages = Math.ceil(numRows/numPerPage);

        let limit = skip + ',' + numPerPage;
        console.log(`numRows = ${numRows} numPages = ${numPages} findKey = ${findKey}`);

        pool.query(`SELECT * FROM tovars ${strLike} LIMIT ${limit}`, (error02,result02) => {
          if(error02) throw error02;
          res.send({findKey, total: numRows, rowData: result02});
        });
      });
    }
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