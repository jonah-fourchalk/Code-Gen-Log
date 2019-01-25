//takes the raw text data and sorts it by section and line

var ca = require('./create-arrays');

function importLog(data){
    var sections = data.split("InspectClassInternalsOneLevel");
    var lines = ca.createArray(sections.length-1,0);
    for (var i = 0; i < lines.length; i++) {
        secData = sections[i].trim();
        lines[i] = secData.split(/\n/);
    }
    return lines;
}

module.exports = {importLog};
