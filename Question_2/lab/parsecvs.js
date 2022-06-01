'use strict'

const fs = require('fs');


let dataArray = [];

//restaurant :element.slice(0,element.indexOf(',')),
//time : element.slice(element.indexOf(',')+1)
const sliceRestaurants = (element) =>{ return element.slice(0,element.indexOf(',')) }
const time = (element) =>{ return  element.slice(element.indexOf(',')+1) }


fs.readFile('parse.csv', 'utf8', function (err, data) {
  dataArray = data.split(/\r?\n/);
  
  dataArray.forEach((element,index) => {
    dataArray[index] = {      
      restaurant : sliceRestaurants(element),     
      time : time(element)
     };
  })  
    console.log(dataArray);    
});

function readCSV(){

}





