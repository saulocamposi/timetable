
const fs = require("fs");
const sqlite3 = require('sqlite3').verbose();
let db; 

const setupDb = () => {
  	 db = new sqlite3.Database("./timetable.db", sqlite3.OPEN_READWRITE, (err) => {
     if(err) return console.log(err.message);
 });
}

const dropDb = () => {}

const createTables = () =>{
  let sql_restaurant_table = `CREATE TABLE restaurants(id INTEGER PRIMARY KEY, restaurant)`;
  let sql_timetable_table = `CREATE TABLE timetables(id INTEGER, days, time )`;
   db.run(sql_restaurant_table);
   db.run(sql_timetable_table);
}

const parseData = function () {    
    

    // sql = `INSERT INTO timetables(restaurant, timetable) VALUES (?,?)`
    // db.run(sql,["mike","10:00"],(err) =>{
    //     if(err) return console.log(err.message);
    // })

    let sql_restaurant_insert = `INSERT INTO restaurants(restaurant) VALUES (?)`;
    let sql_timetable_insert = `INSERT INTO timetables(days, time) VALUES (?,?)`;
    
    let csvJson = parseCSV();

    csvJson.forEach( element => {      
      db.run(sql_restaurant_insert,[element.restaurant],(err) =>{
        if(err) return console.log(err.message);
      });
      
      element.timetable.forEach( element => {
        db.run(sql_timetable_insert,[element.days, element.time],(err) =>{
          if(err) return console.log(err.message);
        })
      });
      
    })

    
    
   
}




const getListTimetable = function () {
     sql = `SELECT * FROM timetables`;
     db.all(sql, [] , (err,rows) => {
         if(err) return console.log(err.message);
         rows.forEach((row) => { console.log(row); });
     });

     sql = `SELECT * FROM restaurants`;
     db.all(sql, [] , (err,rows) => {
         if(err) return console.log(err.message);
         rows.forEach((row) => { console.log(row); });
     });
}

const parseCSV = () => {
  let file = fs.readFileSync('parse.csv', 'utf8');
  let dataInLines = file.split(/\r?\n/);
  let json = jsonSlice(dataInLines);
  return json;
}
const sliceRestaurants = (element) =>{ return element.slice(0,element.indexOf(',')) }
const time = (element) => { return element.slice(element.indexOf(',')+1) }

const jsonSlice = (dataInLines) => {
  dataInLines.forEach((element,index) => {
      dataInLines[index] = {      
           restaurant : sliceRestaurants(element),     
           timetable : parseTimetable(time(element))
          };
       });
       return dataInLines;
}

const parseTimetable = (time) => {
  let a = time.split("/");
  a.forEach((element,index) => {
      let e = element.trim();
      let days =  e.slice(0,e.indexOf(' '));
      let time = e.slice(e.indexOf(' '));
      time = time.trim()
      a[index] =   { days : days, time : time } ;
  });
  return a;
}

//let tx = '"Mon-Thu, Sun 11:30 am - 10 pm  / Fri-Sat 11:30 am - 11 pm"';
//console.log(parseTimetable(tx)); 

//console.log(JSON.stringify(parseCSV()));

//1console.log(parseCSV());

setupDb();
//createTables();

//parseData();

getListTimetable();