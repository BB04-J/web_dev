// basic method that runs infinitely until stopped externally 

// let count=0;
//  setInterval( function() {
//     console.log(count);
//     count++
//  },1000)


// effecient code that stops when count==10

// let count = 0;
// const id = setInterval(() => {
//     console.log(count);
//     if (count == 10) {
//         clearInterval(id);

//     }
//     count++;
// }, 1000
// );

let c = 0;
function newcounter(){
    console.log("c = " + c);
    c++;
     if (c<=10) {
        setTimeout(newcounter,1000);
     }
    
};

newcounter();