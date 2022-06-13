
const fs = require("fs");
const sqlite3 = require('sqlite3').verbose();
let db;

const setupDb = () => {
  db = new sqlite3.Database("./timetable.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.log(err.message);
  });
}

const dropDb = () => {
  let sql_restaurant_drop_table = `DROP TABLE restaurants`;
  db.run(sql_restaurant_drop_table);
}

const createTables = () => {
  let sql_restaurant_table = `CREATE TABLE restaurants(
                              id INTEGER PRIMARY KEY, 
                              restaurant, 
                              days,
                              time,
                              numberDays,
                              hourTimeBegin INTEGER,
                              hourTimeEnd INTEGER,
                              minTimeBegin INTEGER,
                              minTimeEnd INTEGER,
                              originalTime)`;
  db.run(sql_restaurant_table);
}

const freshDb = () => {
  setupDb();
  dropDb();
  createTables();
}

const parseData = () => {
  let sql_restaurant_insert = `INSERT INTO restaurants(
                                restaurant,
                                days,
                                time,
                                numberDays,
                                hourTimeBegin,
                                hourTimeEnd,
                                minTimeBegin,
                                minTimeEnd,
                                originalTime) VALUES (?,?,?,?,?,?,?,?,?)`;
  let csvJson = parseCSV();

  csvJson.forEach(restaurants => {
    restaurants.timetable.forEach(timetable => {
      let hourBegin = timetable.numberTimes[0].hour;
      let hourEnd = timetable.numberTimes[1].hour;

      let minBegin = timetable.numberTimes[0].min;
      let minEnd = timetable.numberTimes[1].min;

      db.run(sql_restaurant_insert,
        [restaurants.restaurant,
        timetable.days,
        timetable.time,
        timetable.numberDays,
          hourBegin,
          hourEnd,
          minBegin,
          minEnd,
        timetable.originalTime], (err) => {
          if (err) return console.log(err.message);
        });
    });
  });

}
const listAll = () => {
  sql = `SELECT * FROM restaurants`;
  db.all(sql, [], (err, rows) => {
    if (err) return console.log(err.message);
    rows.forEach((row) => { console.log(row); });
  });
}
const searchOpenRestaurants = function (date) {
  let day = date.getDay();
  let hour = date.getHours();
  let min = date.getMinutes();
  sql = ` SELECT * FROM restaurants 
              where numberDays LIKE '%' || ? || '%'
              AND hourTimeBegin <= ? AND minTimeBegin <= ? 
              AND hourTimeEnd >= ? AND minTimeEnd <= ?` ;
  db.all(sql, [day, hour, min, hour, min], (err, rows) => {
    if (err) return console.log(err.message);
    rows.forEach((row) => { console.log(row); });
  });
}

const parseCSV = () => {
  let file = fs.readFileSync('../db/rest_open_hours.csv', 'utf8');
  let dataInLines = file.split(/\r?\n/);
  let json = jsonSlice(dataInLines);
  return json;
}
const sliceRestaurants = (element) => { return element.slice(0, element.indexOf(',')) }
const time = (element) => { return element.slice(element.indexOf(',') + 1) }

const jsonSlice = (dataInLines) => {
  dataInLines.forEach((element, index) => {
    dataInLines[index] = {
      restaurant: sliceRestaurants(element),
      timetable: parseTimetable(time(element))
    };
  });
  return dataInLines;
}

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const weekdaysObj = { 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6, 'Sun': 0 };
const parseTimetable = (time) => {
  time = time.replaceAll('"', '')
  let originalTime = time;
  let a = time.split("/");
  a.forEach((element, index) => {
    let e = element.trim();
    let days = e.slice(0, e.indexOf(' '));
    let time = e.slice(e.indexOf(' '));
    time = time.trim();
    let timereplaced = containsAndReplace(time, weekdays, "")
    if (timereplaced != "") {
      time = timereplaced.str;
      days = days.concat(timereplaced.usedElement);
    };
    let numberDays = daysInNumber(days, weekdaysObj);
    let numberTimes = timeInNumber(time);
    a[index] = { days: days, time: time, numberDays: numberDays, numberTimes: numberTimes, originalTime: originalTime };
  });
  return a;
}

const containsAndReplace = (str, arr, pattern) => {
  let elem = ""
  arr.some(element => {
    if (str.includes(element)) {
      str = str.replace(element, pattern);
      str = str.trim();
      elem = { usedElement: element, str: str };
    }
  });
  return elem;
};

const range = (start, end, length = end - start + 1) =>
  Array.from({ length }, (_, i) => start + i)

// const daysInNumber = (days,weekdaysObj) => {
//   if (days.includes(",")) {
//     days = days.split(",");  
//   }else{
//     days = days.split("-");
//   }

//   days.forEach((element,index) => {
//     if (element.includes("-")) {
//       element = element.split("-");
//       days.push(...range(weekdaysObj[element[0]],weekdaysObj[element[1]]))      
//     }else{
//       //days[index] = obj[element];
//       console.log(element);
//       days[index] = weekdaysObj[element];
//     }    
//   });

//   days = filterList(days);
//   console.log(days);
//    return days;
// };


const daysInNumber = (days, weekdaysObj) => {

  //range plus day
  if (days.includes(",")) {
    days = days.split(",");
    days = rangePlusDay(days);
    days = filterList(days);
  } else {
    //range days
    if (days.includes("-")) {
      days = rangeDays(days);
      days = filterList(days);
    } else {
      if (!days.includes("-") && !days.includes(",")) {
        days = notRangeDay(days);
      }
    }
  } 
  return days;
};

const rangePlusDay = (days) => {
  days.forEach((element, index) => {
    if (element.includes("-")) {
      element = element.split("-");
      days.push(...range(weekdaysObj[element[0]], weekdaysObj[element[1]]))
    } else {
      days[index] = weekdaysObj[element];
    }
  });
  return days;
}

const rangeDays = (days) => {
  days = days.split("-");

  if(weekdaysObj[days[1]] == 0 && weekdaysObj[days[0]] == 6){
    days = new Array(weekdaysObj[days[0]], weekdaysObj[days[1]]);
  }

  if ((weekdaysObj[days[1]] - weekdaysObj[days[0]] + 1) != 0) {
    days.push(...range(weekdaysObj[days[0]], weekdaysObj[days[1]]));
  } else {
    days = new Array(weekdaysObj[days[0]], weekdaysObj[days[1]]);
  }
  return days;
}

const notRangeDay = (days) => {
  return parseInt(weekdaysObj[days]);
}

const filterList = (l) => {
  return l.filter(x => typeof x === "number");
}

const timeInNumber = (time) => {
  time = time.split("-");

  time.forEach((element, index) => {
    element = element.trim();
    if (element.includes('am')) {
      element = element.replace('am', '');
      element = timeSplit(element, 0);
    } else {
      element = element.replace('pm');
      element = element.trim();
      element = timeSplit(element, 1);
    }
    time[index] = element;
  })
  return time;
}

const timeSplit = (element, am) => {
  let timesplit = 0;
  let hour = 0;
  let min = 0;

  if (element.includes(":")) {
    element = element.split(":");
    hour = element[0];
    min = parseInt(element[1], 10);
    hour = parseInt(hour, 10);
    hour = (am == 1) ? hour + 12 : hour;
    timesplit = { hour: hour, min: min };
  } else {
    hour = element = parseInt(element, 10);
    hour = (am == 1) ? hour + 12 : hour;
    timesplit = { hour: hour, min: min };
  }
  return timesplit;
}

//parseCSV();

/*************************************/
/* Instruction for Run the App
/*********************************** */
//Use setupDb in all steps
setupDb();

//Command to dropDb
//dropDb();

//Command to createTables
//createTables();

//Command to insert data from CSV to Db
parseData();

//Command to list all data from Db
//listAll();

//Command to list time available
//bookTable = new Date("June 19, 2022 23:15:30")
//searchOpenRestaurants(bookTable);
