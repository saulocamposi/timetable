import sqlite3 from 'sqlite3';
import { ParseCsv } from './ParseCsv.js';
import path from 'path';
import { fileURLToPath } from 'url';

export class Dao {

    constructor(dbname) {
        this.dbname = dbname;
        this.db = this.setupDb();
        sqlite3.verbose();
        this.getParseCsv();               
    }

    getParseCsv() {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        let csvfile = path.join(__dirname, '..', 'db', 'rest_open_hours.csv');
        let encode = 'utf-8';
        this.parsecsv = new ParseCsv(csvfile, encode);
    }

    setupDb() {
        return new sqlite3.Database(this.dbname, sqlite3.OPEN_READWRITE, (err) => {
            if (err) return console.log(err.message);
        });
    }

    dropDb() {
        let sql_restaurant_drop_table = `DROP TABLE restaurants`;
        this.db.run(sql_restaurant_drop_table);
    }

    createTables() {
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
        this.db.run(sql_restaurant_table);
    }

    listAll() {
        const sql = `SELECT * FROM restaurants`;
        this.db.all(sql, [], (err, rows) => {
            if (err) return console.log(err.message);
            rows.forEach((row) => { console.log(row); });
        });
    }

    searchOpenRestaurants(date) {
        let day = date.getDay();
        let hour = date.getHours();
        let min = date.getMinutes();
        const sql = ` SELECT * FROM restaurants 
                    where numberDays LIKE '%' || ? || '%'
                    AND hourTimeBegin <= ? AND minTimeBegin <= ? 
                    AND hourTimeEnd >= ? AND minTimeEnd <= ?` ;
        this.db.all(sql, [day, hour, min, hour, min], (err, rows) => {
            if (err) return console.log(err.message);
            rows.forEach((row) => { console.log(row); });
        });
    }

    parseData() {
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

        let csvJson = this.parsecsv.parseCSV();

        csvJson.forEach(restaurants => {
            restaurants.timetable.forEach(timetable => {
                let hourBegin = timetable.numberTimes[0].hour;
                let hourEnd = timetable.numberTimes[1].hour;

                let minBegin = timetable.numberTimes[0].min;
                let minEnd = timetable.numberTimes[1].min;

                this.db.run(sql_restaurant_insert,
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
}