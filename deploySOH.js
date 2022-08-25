//  import http from 'http';
//  import pkg from 'pg';
  const http = require('http');
  const { Pool } = require('pg');

  const credentials = {
    user: "haridevajay",
    host: "localhost",
    database: "Secret_Of_Happiness",
    password: "7117",
    port: 5432,
  };

  async function createRow(dataRow)
  {
          const text = `
          INSERT INTO the_seven_fs(family,fitness,faith,field,finance,fun,friends)
          VALUES($1,$2,$3,$4,$5,$6,$7)
          `;
          const dataObj = JSON.parse(dataRow);
          const values = [dataObj.family,dataObj.fitness,dataObj.faith,dataObj.field,dataObj.finance,dataObj.fun,dataObj.friends];
          const pool = new Pool(credentials);
          const createdRow = await pool.query(text,values);
          await pool.end();
          return createdRow;
  }
  async function selectData()
  {
          const countText = `SELECT COUNT(1) FROM the_seven_fs`
          const pool = new Pool(credentials);
          const countObj = await pool.query(countText);
  //      console.log('countObj : ',countObj);
          const count = countObj.rows[0].count;
  //      console.log('count : ', count);
          let arrayOfObjects = [];
          for(let i = 1 ; i <= count ; i++)
          {
                  const text = `SELECT * FROM the_seven_fs WHERE sl_no = $1`;
                  const values=[i];
                  const  obj = await pool.query(text,values);
                  let pushObj= obj.rows[0];
                  arrayOfObjects.push(pushObj);
          }
          await pool.end();
          return arrayOfObjects;
  }
  async function focusAreas()
  {
          const countText = `SELECT COUNT(1) FROM the_seven_fs`
          const pool = new Pool(credentials);
          const countObj = await pool.query(countText);
          const count = countObj.rows[0].count;
          const text = `SELECT * FROM the_seven_fs WHERE sl_no = $1`
          const values = [count];
          const dataObj = await pool.query(text,values);
          return dataObj;
  }
  const server = http.createServer((req,res) =>
          {
                  let splitReq=req.url.split('/')
                  let endUrl= splitReq[splitReq.length-1];
                  let idNo=Number(endUrl);
                  if(req.method == 'POST' && endUrl == 'create')
                  {
                          (async() =>{
                                  req.on('data',chunk => {
                                          let data = chunk.toString();
                                          const dataInserted = createRow(data);
                                  });
                                  req.on('end',() => {
                                          res.write('Data Updated Successfully');
                                          res.end();
                                  });
                          })();
                  }
                  if(req.method == 'GET' && endUrl == 'all')
                  {
                          (async() => {
                                  const objectArray= await selectData();
  //                              console.log('objectArray',objectArray);
                                  const printArray = JSON.stringify(objectArray);
  //                              console.log('printArray : ',printArray)
                                  res.write(printArray);
                                  res.end();
                          })();
                  }
                  if(req.method == 'GET' && endUrl == 'focus')
                  {
                          (async() =>{
								  const initialObject = await focusAreas();
                                  const dataObject = initialObject.rows[0];
  //                              console.log('object : ',dataObject);
                                  let areasToFocus = [];
                                  let areas=Object.keys(dataObject);
                                  let objValues=Object.values(dataObject);
  //                              console.log('values : ',objValues );
                                  for(let i=1 ; i<areas.length ; i++)
                                  {
                                          if(objValues[i]<=3)
                                                  areasToFocus.push(areas[i]);
                                  }
                                  if(areasToFocus.length==0)
                                          areasToFocus.push('No Areas To Focus');
                                  const printAreasToFocus = JSON.stringify(areasToFocus);
                                  res.write(printAreasToFocus);
                                  res.end();
                          })();
                  }
          });
  server.listen(8008);
  console.log('The server is running on http://localhost:8008/');
