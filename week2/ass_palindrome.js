function Palindrome (str){
    str=str.toLowerCase();
    left = 0;
    right = str.length-1;
    while (left<right){
        if (str[left]!=str[right])
        {
            crossOriginIsolated.log("Not a Palindrome");
            break;
        }
        left++;
        right--;
    }
}