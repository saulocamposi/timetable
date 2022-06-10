import { Dao } from './Dao.js';
import { ParseCsv } from './ParseCsv.js';
import { ParseTxt } from './ParseTxt';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';


export class Main {
    constructor() {
        this.getDao();
        this.welcome();
    }

    async welcome() {
        this.messageWelcome();

        const rl = readline.createInterface({ input, output });
        const answer = await rl.question('Please type your option number: ');
        this.optionsWelcome(answer);

        rl.close();
    }

    messageWelcome() {
        console.log('Welcome to the Restaurant Timetable');
        console.log('Please select an option');
        console.log('1 - Check Availability');
        console.log('2 - List All Restaurants');
        console.log('3 - Import CSV');
        console.log('4 - Create DB');
        console.log('5 - Drop DB');
    }

    optionsWelcome(option) {
        option = parseInt(option)
        console.log(`${option}`);
        console.log(typeof (option));


        switch (option) {
            case 1:
                //this.dao.searchOpenRestaurants();
                console.log('1');
                break;
            case 2:
                this.dao.listAll();
                break;
            case 3:
                this.dao.parseData();
                break;
            case 4:

                break;
            case 5:

                break;


            default:
                break;
        }
    }

    getDao() {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        let db = path.join(__dirname, '..', 'db', 'timetable.db');
        this.dao = new Dao(db);
    }

    getParseCsv() {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        let csvfile = path.join(__dirname, '..', 'db', 'rest_open_hours.csv');
        let encode = 'utf-8';
        this.parsecsv = new ParseCsv(csvfile, encode);
    }






}

let main = new Main();

//console.log("here", main.dao.listAll());
//console.log("here",main.dao.createTables());
//console.log("here",main.dao.listAll());