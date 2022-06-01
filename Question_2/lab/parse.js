const fs = require('fs');

const load = async function load(){    
    
        let data = await fs.promises.readFile('parse.csv', 'utf8');
        return data; 
   
    
}


const result = load().then(function(data){return data})

console.log(result);



