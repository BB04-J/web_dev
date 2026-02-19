// Using `1-counter.md` or `2-counter.md` from the easy section, can you create a
// clock that shows you the current machine time?

// Can you make it so that it updates every second, and shows time in the following formats - 

//  - HH:MM::SS (Eg. 13:45:23)

//  - HH:MM::SS AM/PM (Eg 01:45:23 PM)


// ------  using setInterval  ------

// setInterval(function date(){
//     let d= new Date();
//     let hours = d.getHours();
//     let minutes = d.getMinutes();
//     let seconds = d.getSeconds();
//     console.log(hours + ":" + minutes + ":" + seconds);
// },1000);


// -----  using setTimeout  ---------
// function date(){
//     let d = new Date();
//     let hours = String(d.getHours()).padStart(2,"0");
//     let minutes = String(d.getMinutes()).padStart(2,"0");
//     let seconds = String(d.getSeconds()).padStart(2,"0");
//     console.log(hours + ":" + minutes + ":" + seconds);
//     setTimeout(date,1000);
    
// };
// date();



// ----  part two of the assignment   -----

setInterval(function () {
    let now= new Date();
    let hours = now.getHours();
    let minutes = String(now.getMinutes()).padStart(2,"0");
    let seconds = String(now.getSeconds()).padStart(2,"0");

    if(hours <= 12){
        let a= "am";

    }
    else {
        let a ="pm";

    }
    hours = hours % 12;
    
    if(hours == 0){
        hours= 12;
    }
    console.log(hours + ":" + minutes + ":" + seconds);


},1000);

