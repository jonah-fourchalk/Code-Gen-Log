(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

    allInfo.push(array);
    return allInfo;
}

module.exports = {checkFirstSection};

},{"./get-code-gen-log":4,"./remove-type-names":5}],2:[function(require,module,exports){
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

},{"./check-first-section":1,"./create-arrays":3,"./remove-type-names":5}],3:[function(require,module,exports){
//creates multi-dimension arrays

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

module.exports = {createArray};


},{}],4:[function(require,module,exports){
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

},{"./create-arrays":3}],5:[function(require,module,exports){
//removes the string searchWord from this
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

},{}],6:[function(require,module,exports){
//takes a text file from the user and runs the full sorting program
//outputs to console
//**NOTE** IMPORTANT: must run browserify on this file to make any changes
//browserify this file to: script.js

var cll = require('./check-lower-levels');

window.runSort = function(event){
    var input = event.target;
    var txtFile = new File(['test data'],'CodeGen Logs.txt');
    var sortedObj = "";
    
    var reader = new FileReader();
    reader.onload = function(){
        var text = reader.result;
        sortedObj = cll.checkLowerLevels(text);
        displayLog(sortedObj);
    }
    reader.readAsText(input.files[0]);
}
},{"./check-lower-levels":2}]},{},[6]);
