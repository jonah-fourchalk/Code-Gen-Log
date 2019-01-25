//checks all lower sections of the CodeGen Log
//ex: "--> from property" sections

var rfn = require('./remove-type-names');
var ca = require('./create-arrays');
var cfs = require('./check-first-section');


function checkLowerLevels(text) {

    var allInfo = cfs.checkFirstSection(text);
    var lines = allInfo[0];

    var sectionsOrg = ca.createArray(lines.length, 0);

    var parent = "";
    var property = "";
    var addTypeSubstring = "AddType";

    var firstSection = allInfo[1];
    sectionsOrg[0] = firstSection[1];

    for (var dataLevel = 1; dataLevel < lines.length; dataLevel++) {
        var typesAdded = 0;
        for (var i = lines[dataLevel].length - 1; i >= 0; i--) {
            var strVal = lines[dataLevel][i];

            //AddType format
            if (/AddType/.test(strVal)) {

                var addedType = rfn.removeWord(addTypeSubstring, strVal);
                sectionsOrg[dataLevel].push({
                    addedType: addedType,
                    property: property,
                    parent: parent,
                    child: 0
                });
                let obj = sectionsOrg[dataLevel - 1].find(o => o.addedType === sectionsOrg[dataLevel][typesAdded].parent);
                obj.child++;
                typesAdded++;
            }

            //--> format
            else if (/-->/.test(strVal)) {

                var strTemp = rfn.removeArrow(strVal);
                property = strTemp[0];
                parent = strTemp[1];

            } else {
                continue;
            }
        }
    }

    sectionsOrg.splice(0, 0, firstSection[0]);

    return sectionsOrg;
}

module.exports = {
    checkLowerLevels
};
