(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
//creates multi-dimension arrays
function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while (i--) arr[length - 1 - i] = createArray.apply(this, args);
    }

    return arr;
}

module.exports = {
    createArray
};
},{}],2:[function(require,module,exports){
//takes the raw text data and sorts it by section and line
var ca = require('./create-arrays');

function importLog(data) {
    var sections = data.split("InspectClassInternalsOneLevel");
    var lines = ca.createArray(sections.length, 0);
    for (var i = 0; i < lines.length; i++) {
        secData = sections[i].trim();
        lines[i] = secData.split(/\n/);
    }
    return lines;
}

module.exports = {
    importLog
};
},{"./create-arrays":1}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
//takes a text file from the user and runs the full sorting program
//outputs to console
//**NOTE** IMPORTANT: must run browserify on this file to make any changes
//browserify this file to: script.js
var sj = require('./sort-json');

window.runSort = function(event) {
    var input = event.target;
    var txtFile = new File(['test data'], 'CodeGen Logs.txt');
    var sortedObj = "";

    var reader = new FileReader();
    reader.onload = function() {
        $('.main div').empty();
        var text = reader.result;
        sortedObj = sj.sortJSON(text);
        console.log("sorted");
        displayLog(sortedObj);
    }
    reader.readAsText(input.files[0]);
}
},{"./sort-json":5}],5:[function(require,module,exports){
var td = require('./test');


function sortJSON(text){
    var myObj = td.createObj(text);
    var array = [];

    array = array.concat(sortMethods(myObj));
    array = array.concat(sortTypes(myObj));
    return array;
}


function sortMethods(data) {
    var tempArrM = [];
    var tempArrT = [];
    for (i in data.methods) {
        tempArrM.push({
            addedType: data.methods[i].method,
            parent: "",
            children: data.methods[i].types.length
        });
        if (tempArrM[i].children) {
            for (j in data.methods[i].types) {
                var addedType = data.methods[i].types[j];
                let obj = data.properties.find(o => o.parent === addedType);
                if(obj){
                    var children = obj.types.length;
                } else { children = 0; }
                tempArrT.push({
                    addedType: data.methods[i].types[j],
                    parent: data.methods[i].method,
                    children: children
                });
            }
        }
    }
    return tempArrM.concat(tempArrT);
}

function sortTypes(data) {
    var tempArr = [];
    for(i in data.properties){
        var property = data.properties[i].property;
        var parent = data.properties[i].parent;
        for(j in data.properties[i].types){

            var addedType = data.properties[i].types[j];
            let obj = data.properties.find(o => o.parent === addedType);
            if(obj){
                var children = obj.types.length;
            }
            else{ children = 0; }
            tempArr.push({
                addedType: data.properties[i].types[j],
                property: property,
                parent: parent,
                children: children
            });
        }
    }
    return tempArr;
}


module.exports = {
    sortJSON
}
},{"./test":6}],6:[function(require,module,exports){
var rfn = require('./remove-type-names');
var cgl = require('./get-code-gen-log');

function createObjM(data){
    var method = "";
    var methods = [];
    var types = [];
    for(i in data){
        var strVal = data[i]
        
        if (/AddType/.test(strVal)) {
            types.push(rfn.removeWord("AddType",strVal));
        }
        else if (/\.\.\./.test(strVal)){
            if(method){
                methods.push({
                    method: method,
                    types: types
                });
                types = [];
            }
            method = rfn.removeAPI(strVal);
        }
    }
    return methods;
}


function createObjP(data){
    var properties = [];
    var types = [];
    for(var i = 1; i<data.length; i++){
        for(j in data[i]){
            var strVal = data[i][j];

            if (/AddType/.test(strVal)) {
                types.push(rfn.removeWord("AddType",strVal));
            }
            else if (/-->/.test(strVal)){
                info = rfn.removeArrow(strVal);
                var property = info[0];
                var parent = info[1];

                properties.push({
                    parent: parent,
                    property: property,
                    types: types
                });
                types = [];
            }
            
        }
    }
    return properties;
}

//console.log(createObjP(lines));

function createObj(text){
    var lines = cgl.importLog(text);
    var obj = {
        methods: createObjM(lines[0]),
        properties: createObjP(lines)
    }
    return obj;
}
module.exports = {
    createObj
}
},{"./get-code-gen-log":2,"./remove-type-names":3}]},{},[4]);
