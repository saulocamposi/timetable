const small = "Mon-Sun 11:30 am - 9 pm"
const big = "Mon-Wed 5 pm - 12:30 am  / Thu-Fri 5 pm - 1:30 am  / Sat 3 pm - 1:30 am  / Sun 3 pm - 11:30 pm"

let a = big.split("/");
a.forEach((element,index) => {
    let e = element.trim();
    let days =  e.slice(0,e.indexOf(' '));
    let time = e.slice(e.indexOf(' '));
    time = time.trim()
    a[index] =   { days : days, time : time } ;
  
    
});
console.log(a);

