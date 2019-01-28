// Sorts the JSON file formatted CodeGen Log

var td = require('./convert-txt-to-json');

// Combines the methods and addTypes to one array
function sortJSON(text) {

    // converts the txt file to JSON
    // Replace once full JSON file is acquired
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
                if (obj) {
                    var children = obj.types.length;
                } else {
                    children = 0;
                }
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
    for (i in data.properties) {
        var property = data.properties[i].property;
        var parent = data.properties[i].parent;
        for (j in data.properties[i].types) {

            var addedType = data.properties[i].types[j];
            let obj = data.properties.find(o => o.parent === addedType);
            if (obj) {
                var children = obj.types.length;
            } else {
                children = 0;
            }
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