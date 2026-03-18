// ## File cleaner
// Read a file, remove all the extra spaces and write it back to the same file.

// For example, if the file input was
// ```
// hello     world    my    name   is       raman
// ```

// After the program runs, the output should be

// ```
// hello world my name is raman

import fs from "fs";

fs.readFile("b.txt","utf-8",function(err,data){
    if(err){
        console.log("Error while reading the file");
    }
    else {
        console.log(data);
    }
    const cleaned_data=data.replace(/\s+/g," ").trim();
    fs.writeFile("b.txt",cleaned_data,function(err){
        if(err){
            console.log("Error while writting in the file");
        }
        else {
            console.log("Succesfully file overwirte");
            console.log(fs.readFile("b.txt","utf-8",(err,content)=>{
                console.log(content);
            }));
        }
    });

});