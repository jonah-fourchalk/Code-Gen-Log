// Converts the txt file formatted CodeGen Log into the JSON file format

var rfn = require('./remove-type-names');
var cgl = require('./get-code-gen-log');

// Converts the method key to JSON
function createMethodObject(data) {
    var method = "";
    var methods = [];
    var types = [];
    for (i in data) {
        var strVal = data[i]

        if (/AddType/.test(strVal)) {
            types.push(rfn.removeWord("AddType", strVal));
        } else if (/\.\.\./.test(strVal)) {
            if (method) {
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

// Converts the property key to JSON
function createPropertyObject(data) {
    var properties = [];
    var types = [];
    for (var i = 1; i < data.length; i++) {
        for (j in data[i]) {
            var strVal = data[i][j];

            if (/AddType/.test(strVal)) {
                types.push(rfn.removeWord("AddType", strVal));
            } else if (/-->/.test(strVal)) {
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

// Comnbines the method key and property key in JSON
function createObj(text) {
    var lines = cgl.importLog(text);
    var obj = {
        methods: createMethodObject(lines[0]),
        properties: createPropertyObject(lines)
    }
    return obj;
}
module.exports = {
    createObj
}