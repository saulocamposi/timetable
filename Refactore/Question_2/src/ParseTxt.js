export class ParseTxt {

    weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    weekdaysObj = { 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6, 'Sun': 0 };

    constructor(){}
    
    sliceRestaurants(element) { return element.slice(0, element.indexOf(',')) }

    time(element) { return element.slice(element.indexOf(',') + 1) }

    jsonSlice(dataInLines) {
        dataInLines.forEach((element, index) => {
            dataInLines[index] = {
                restaurant: this.sliceRestaurants(element),
                timetable: this.parseTimetable(this.time(element))
            };
        });
        return dataInLines;
    }
    
    parseTimetable(time) {
        time = time.replaceAll('"', '')
        let originalTime = time;
        let a = time.split("/");
        a.forEach((element, index) => {
            let e = element.trim();
            let days = e.slice(0, e.indexOf(' '));
            let time = e.slice(e.indexOf(' '));
            time = time.trim();
            let timereplaced = this.containsAndReplace(time, this.weekdays, "")
            if (timereplaced != "") {
                time = timereplaced.str;
                days = days.concat(timereplaced.usedElement);
            };
            let numberDays = this.daysInNumber(days, this.weekdaysObj);
            let numberTimes = this.timeInNumber(time);
            a[index] = { days: days, time: time, numberDays: numberDays, numberTimes: numberTimes, originalTime: originalTime };
        });
        return a;
    }

    containsAndReplace(str, arr, pattern) {
        let elem = ""
        arr.some(element => {
            if (str.includes(element)) {
                str = str.replace(element, pattern);
                str = str.trim();
                elem = { usedElement: element, str: str };
            }
        });
        return elem;
    }

    range(start, end, length = end - start + 1) {
        return Array.from({ length }, (_, i) => start + i);
    }

    // daysInNumber(days, obj) {
    //     if (days.includes(",")) {
    //         days = days.split(",");
    //     } else {
    //         days = days.split("-");
    //     }

    //     days.forEach((element, index) => {
    //         if (element.includes("-")) {
    //             element = element.split("-");
    //             days.push(...this.range(obj[element[0]], obj[element[1]]))
    //         } else {
    //             days[index] = obj[element];
    //         }
    //     });
    //     days = this.filterList(days);
    //     return days;
    // }

    daysInNumber (days, weekdaysObj)  {

        //range plus day
        if (days.includes(",")) {
          days = days.split(",");
          days = this.rangePlusDay(days);
          days = this.filterList(days);
        } else {
          //range days
          if (days.includes("-")) {
            days = this.rangeDays(days);
            days = this.filterList(days);
          } else {
            if (!days.includes("-") && !days.includes(",")) {
              days = this.notRangeDay(days);
            }
          }
        } 
        return days;
      };
      
      rangePlusDay (days) {
        days.forEach((element, index) => {
          if (element.includes("-")) {
            element = element.split("-");
            days.push(...this.range(this.weekdaysObj[element[0]], this.weekdaysObj[element[1]]))
          } else {
            days[index] = this.weekdaysObj[element];
          }
        });
        return days;
      }
      
      rangeDays  (days)  {
        days = days.split("-");
      
        if(this.weekdaysObj[days[1]] == 0 && this.weekdaysObj[days[0]] == 6){
          days = new Array(this.weekdaysObj[days[0]], this.weekdaysObj[days[1]]);
        }
      
        if ((this.weekdaysObj[days[1]] - this.weekdaysObj[days[0]] + 1) != 0) {
          days.push(...this.range(this.weekdaysObj[days[0]], this.weekdaysObj[days[1]]));
        } else {
          days = new Array(this.weekdaysObj[days[0]], this.weekdaysObj[days[1]]);
        }
        return days;
      }
      
       notRangeDay (days)  {
        return parseInt(this.weekdaysObj[days]);
      }

    filterList(l) {
        return l.filter(x => typeof x === "number");
    }

    timeInNumber(time) {
        time = time.split("-");

        time.forEach((element, index) => {
            element = element.trim();
            if (element.includes('am')) {
                element = element.replace('am', '');
                element = this.timeSplit(element, 0);
            } else {
                element = element.replace('pm');
                element = element.trim();
                element = this.timeSplit(element, 1);
            }
            time[index] = element;
        })
        return time;
    }

    timeSplit(element, am) {
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
}