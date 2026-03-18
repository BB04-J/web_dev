// Write to a file
// Using the fs library again, try to write to the contents of a file. You can use the fs library to as a black box, the goal is to understand async tasks.


import fs from "fs";
const para= "the 3 rd (easy) assignment is to write data into file using asynchronous function ."

fs.writeFile("a.txt", para,function(err){
    console.log("The data has been written");
    console.log(fs.readFile("a.txt","utf-8",function(err,data){
        console.log(data);
    }));

});
let j=0;
for (let i=0;i<=1000000;i++){
    j++;
};
console.log("The expensive task is completed = " + j);
