//takes a text file from the user and runs the full sorting program
//outputs to console
//**NOTE** IMPORTANT: must run browserify on this file to make any changes
//browserify this file to: script.js
var cll = require('./check-lower-levels');

window.runSort = function(event) {
    var input = event.target;
    var txtFile = new File(['test data'], 'CodeGen Logs.txt');
    var sortedObj = "";

    var reader = new FileReader();
    reader.onload = function() {
        $('.main div').empty();
        var text = reader.result;
        sortedObj = cll.checkLowerLevels(text);
        displayLog(sortedObj);
    }
    reader.readAsText(input.files[0]);
}