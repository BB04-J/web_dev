function Vowels (str){
    let count = 0;
    str.toLowerCase();
    v="aeiou";
    for(let ch of str) {
        if(v.includes(ch)){
            count++;
        }
    }
    return count;
        
}