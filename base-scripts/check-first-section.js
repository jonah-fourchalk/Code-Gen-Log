//check the ... for API method section of the CodeGen Log

var rfn = require('./remove-type-names');
var cgl = require('./get-code-gen-log');

function checkFirstSection(text){
    var lines = cgl.importLog(text);

    var allInfo = [];
    allInfo.push(lines);

    var array = [[],[]];

    var parent = "";
    var addTypeSubstring = "AddType";
    var typesAdded = 0;
    

    for (var i = 0; i < lines[0].length; i++) {
        var strVal = lines[0][i];

        //AddType format
        if (/AddType/.test(strVal)) {

            var addedType = rfn.removeWord(addTypeSubstring, strVal);
            addTypes++;
            array[1].push({
                addedType: addedType,
                parent: parent,
                child: 0,
            });

            let obj = array[0].find(o => o.addedType === array[1][typesAdded].parent);
            obj.child++;
            typesAdded++;

        }

        //... API method format
        else if (/\.\.\. for API/.test(strVal)) {

            //pushes methods with no "AddType" to array[0]

            type = "... API";
            parent = rfn.removeAPI(strVal);

            array[0].push({
                addedType: parent,
                parent: "",
                child: 0
            });


            addTypes = 0;
        } else {
            continue;
        }

    }

    //pushes the line-separated log to the allInfo array to be returned
    allInfo.push(array);
    return allInfo;
}

module.exports = {checkFirstSection};
