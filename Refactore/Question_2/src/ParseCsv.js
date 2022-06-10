import { ParseTxt } from './ParseTxt';

export class ParseCsv{

    constructor(filename,encode){
        this.filename = filename;
        this.encode = encode;
        this.parseTxt  = new ParseTxt;
    }

    parseCSV(){
        let file = fs.readFileSync(this.filename, this.encode);
        let dataInLines = file.split(/\r?\n/);
        let json = this.parseTxt.jsonSlice(dataInLines);
        return json;
      }
}