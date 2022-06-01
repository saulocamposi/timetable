const fastCsv = require("fast-csv");
const fs = require("fs");

const options = {
    objectMode: true,
    delimiter: "\n",
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