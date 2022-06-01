'use strict'

const fs = require('fs');

const sliceRestaurants = (element) =>{ return element.slice(0,element.indexOf(',')) }
const time = (element) => { return element.slice(element.indexOf(',')+1) }

const jsonSlice = (dataInLines) => {
  dataInLines.forEach((element,index) => {
      dataInLines[index] = {      
           restaurant : sliceRestaurants(element),     
           time : time(element)
          };
       });
       return dataInLines;
}





const file = fs.readFileSync('parse.csv', 'utf8')
const dataInLines = file.split(/\r?\n/);
const json = jsonSlice(dataInLines);

console.log(json);



function readCSV(){

}





