
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
  let sql_restaurant_table = `CREATE TABLE restaurants(id INTEGER PRIMARY KEY, restaurant, timetable)`;  
   db.run(sql_restaurant_table);
  
}

const parseData =  () => {    

    let sql_restaurant_insert = `INSERT INTO restaurants(restaurant,timetable) VALUES (?,?)`;
    let csvJson = parseCSV();

    csvJson.forEach( element => {      
      db.run(sql_restaurant_insert,[element.restaurant, element.timetable],(err) =>{
        if(err) return console.log(err.message);
      });
    });
   
}

const searchOpenRestaurants = function (date) {
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
           timetable : time(element)
          };
       });
       return dataInLines;
}

const weekdays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const weekdaysObj = {'Mon': 1,'Tue' : 2 ,'Wed' : 3,'Thu':4,'Fri':5,'Sat' :6 ,'Sun':0 };
const parseTimetable = (time) => {
  let a = time.split("/");
  a.forEach((element,index) => {
      let e = element.trim();
      e = e.replace('"','') 
      let days =  e.slice(0,e.indexOf(' '));
      let time = e.slice(e.indexOf(' '));
      time = time.trim();
      let timereplaced = containsAndReplace(time,weekdays,"")
      if( timereplaced != ""){
        time = timereplaced.str;
        days = days.concat(timereplaced.usedElement);
      };
      days = days.replace(',','-');
      let numberDays = daysInNumber(days,weekdaysObj);
      console.log(numberDays);
      

      

      a[index] =   { days : days, time : time } ;
  });
  return a;
}

// weekdays.some(element => {
//   if (times.includes(element)) {
//     return true;
//   }
//   return false;
// });

// const contains = weekdays.some(element => {
//   if (str.includes(element)) {
//     return true;
//   }
//   return false;
// });

const containsAndReplace = (str,arr,pattern) => {
  let elem = ""
    arr.some(element => {
     if(str.includes(element)){
      str = str.replace(element,pattern);
      str = str.trim();
      elem = {usedElement: element, str: str};
     }     
   });
   return elem;
};

const daysInNumber = (days,obj) => {
  days = days.split("-");
  console.log(days);
  days.forEach((element,index) => {
    days[index] = obj.element
  });
   return days;
};


let tx = '"Mon-Thu, Sun 11:30 am - 10 pm  / Fri-Sat 11:30 am - 11 pm"';
let txa = 'Sun 11:30 am - 10 pm';
//console.log(parseTimetable(tx));
parseTimetable(tx)
//console.log(contains(txa,weekdays)); 

//console.log(JSON.stringify(parseCSV()));

//1console.log(parseCSV());

//setupDb();
//createTables();

//parseData();
//a = new Date('June 19, 2022 23:15:30')
//searchOpenRestaurants(a);