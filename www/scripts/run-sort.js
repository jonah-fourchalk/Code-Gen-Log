//takes a text file from the user and runs the full sorting program
//outputs to console
//**NOTE** IMPORTANT: must run browserify on this file to make any changes
//browserify this file to: script.js
runSort = function(text) {
    var sortedObj = "";
    sortedObj = sortJSON(text);
    console.log("sorted");
    return sortedObj;
}