class SortLog extends HTMLElement {
    constructor() {
        super();
        
        // gets the json file from the source, and runs the sorting on it if it works
        var urlJSON = this.getAttribute("src");
        $.getJSON(urlJSON, function () {
        })
        .done(function (data) {
            sortLog(data);
            var displayLog = document.createElement("display-log");
            document.getElementsByTagName("body")[0].appendChild(displayLog);
        })
        .fail(function () {
            console.log("error");
        });

        //sorts the object and saves it in local storage for later use
        function sortLog(obj) {
            var sorted = sortJSON(obj);
            localStorage.setItem("sorted-obj", JSON.stringify(sorted));

        }

        function sortJSON(text) {

            // Sorts the object into usable format
            var myObj = text;
            var array = [];

            array = array.concat(sortMethods(myObj));
            array = array.concat(sortTypes(myObj));
            return array;
        }

        // Sorts methods and AddTypes of methods
        function sortMethods(data) {
            var tempArrM = [];
            var tempArrT = [];
            for (var i in data.methods) {
                tempArrM.push({
                    addedType: data.methods[i].method,
                    parent: "",
                    children: data.methods[i].types.length
                });
                if (tempArrM[i].children) {
                    for (var j in data.methods[i].types) {
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

        // Sorts properties and AddTypes with properties
        function sortTypes(data) {
            var tempArr = [];
            for (var i in data.properties) {
                var property = data.properties[i].property;
                var parent = data.properties[i].parent;
                for (var j in data.properties[i].types) {

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
    }
}
customElements.define("sort-log", SortLog);