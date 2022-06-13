import { Dao } from './Dao.js';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';


export class Main {
    constructor(date) {
        this.getDao();
        this.welcome();
        this.date = date;
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
        
        switch (option) {
            case 0:
                this.dao.searchOpenRestaurants(this.date,option);                
                break;
            case 1:
                this.dao.searchOpenRestaurants(this.date,option);                
                break;
            case 2:
                this.dao.listAll();
                break;
            case 3:
                this.dao.parseData();
                break;
            case 4:
                this.dao.createTables();
                break;
            case 5:
                this.dao.dropDb();
                break;


            default:
                console.log('Invalid option');
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
//d1 = new Date();
let d2 = new Date('June 14, 2022 21:15:30');
//d2.setTime( d2.getTime() - new Date().getTimezoneOffset()*60*1000 );


//new Main(d1);
new Main(d2);
//new Main(d3);


