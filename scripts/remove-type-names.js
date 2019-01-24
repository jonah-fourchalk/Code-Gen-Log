//removes the string searchWord from str
function removeWord(searchWord, str) {
    var n = str.indexOf(searchWord);
    str = str.substring(0, n) + str.substring(n + searchWord.length).trim();
    return str;
}

//removes the beginning and end bits from the API method format
function removeAPI(str) {
    var rWord = "... for API method";
    var rWord2 = "\.\.\.";
    str = removeWord(rWord2, removeWord(rWord, str)).trim();
    //var n = strs.indexOf("method");
    //var method = strs[n + 1];
    return str;
}

//removes the property format beginning and returns an array with the elements of property,file name
function removeArrow(str) {
    var rWord = "--> from property";
    str = removeWord(rWord, str).trim();
    strArr = str.split(" of ");
    return strArr;
}

module.exports = {
    removeAPI,
    removeArrow,
    removeWord
}
