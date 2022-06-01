
const fs = require("fs");
const csvParser = require("csv-parser");
const fastCsv = require("fast-csv");
//const sqlite3 = require('sqlite3').verbose();

//let sql;
const result = [];

// const db = new sqlite3.Database("./timetable.db", sqlite3.OPEN_READWRITE, (err) => {
//     if(err) return console.log(err.message);
// });

const parseData = function () {    
    //sql = `CREATE TABLE timetables(id INTEGER PRIMARY KEY, restaurant , timetable)`;
    //db.run(sql);

    // sql = `INSERT INTO timetables(restaurant, timetable) VALUES (?,?)`
    // db.run(sql,["mike","10:00"],(err) =>{
    //     if(err) return console.log(err.message);
    // })
    
    fs.createReadStream("./parse.csv")
    .pipe(csvParser(
        {
            delimiter:'/\r\n|\r/'
        }
    ))
    .on("data", (data) => {
        result.push(data);
        //console.log(data);
    })
    .on("end" , () => {
        console.log(result);

    })
}


parseData()

const parsecsv = function () {
    


const options = {
  objectMode: true,
  delimiter: ",",
  quote: null,
  headers: true,
  renameHeaders: false,
};

const data = [];

fs.createReadStream("./parse.csv")
  .pipe(fastCsv.parse(options))
  .on("error", (error) => { console.log(error);
  })
  .on("data", (row) => {
    data.push(row);
  })
  .on("end", (rowCount) => {
    console.log(rowCount);
    console.log(data);
  });
}



//parsecsv()

const getListTimetable = function () {
    // sql = `SELECT * FROM timetables`;
    // db.all(sql, [] , (err,rows) => {
    //     if(err) return console.log(err.message);
    //     rows.forEach((row) => { console.log(row); });
    // });
}
