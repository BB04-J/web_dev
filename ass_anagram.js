function isAnagram(str1, str2) {
    if (str1.length != str2.length) return false;

    str1.toLowerCase();
    str2.toLowerCase();

    let ana = {};
    for (let ch of str1) {
        if (ana[ch]) {
            ana[ch]++;
        }
        else {
            ana[ch] = 1;
        }
    }

    for (let c of str2) {
        if (!ana[c]) {
            return false;
        }
        ana[c]--;
    }
    return true;

}

import readline from "readline";
const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

r1.question("Enter first string", function (str1) {
    r1.question("nter another string", function (str2) {
        const result = isAnagram(str1,str2);
        console.log("are string anagram = " + result);
        r1.close();
    });

});












