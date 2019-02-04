class SortLog extends HTMLElement {
    constructor() {
        super();

        this.style.display = "none";

        function sortLog() {
            var obj = JSON.parse(document.getElementsByTagName('sort-log')[0].textContent);
            var sorted = sortJSON(obj);
            var display = document.getElementsByTagName('display-log')[0];
            display.innerText = JSON.stringify(sorted);
            console.log(sorted);
            displayDuplicates(sorted);
        }

        function displayDuplicates(sortedArray) {
            // checks addedTypes in sorted for duplicates, then displays them in the error menu
            function getAddedType(currentObject, index) {
                return currentObject.addedType;
            }
            function clipName(name, index) {
                const match = /(^REST)/.exec(name) || /([^.]+)$/.exec(name);
                if (!/([\[\]])/.test(match)) { // temporary way to avoid the array names
                    return match && match[1];
                }
                else {
                    return Math.random();
                }
            }
            const addedTypes = sortedArray.map(getAddedType);
            const filteredAddedTypes = addedTypes.map(clipName);
            const count = array => 
                array.reduce((a, b) => 
                    Object.assign(a, {[b]: (a[b] || 0) + 1}), {});

            const duplicates = dict => 
                Object.keys(dict).filter((a) => dict[a] > 1);

            const duplicateTypes = duplicates(count(filteredAddedTypes)); 
            // contains all addedTypes that appear more than once
            console.log(count(filteredAddedTypes));
            console.log(duplicateTypes);
            // generate the error box content
            let errString = '';
            if (duplicateTypes !== []) {
                errString += 'Duplicate model name(s)';
                for (let i = 0; i < duplicateTypes.length; i++) {
                    if (i === duplicateTypes.length - 1) {
                        errString += ' "' + duplicateTypes[i] + '" ';
                    } else {
                        errString += ' "' + duplicateTypes[i] + '",';
                    }
                } 
                errString += 'were found. Please change the model name of at least one of the types so each type has a unique name.';
            } else {
                errString += 'No duplicate names found.';
            }
            $('#error').append(errString);
            if (duplicateTypes === []) {
                // changes error box style
                $('#error').removeAttr('id');
            }
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

        var config = {
            attributes: true,
            childList: true,
            subtree: true
        };
        var displayLog = document.createElement("display-log");
        document.getElementsByTagName("body")[0].appendChild(displayLog);

        // Callback function to execute when mutations are observed
        var callback = function (mutationsList, observer) {
            for (var mutation of mutationsList) {
                if (mutation.type == 'childList') {
                    console.log('A child node has been added or removed.');
                    sortLog();
                    observer.disconnect();
                }
                if (mutation.type == 'attributes') {
                    console.log('The ' + mutation.attributeName + ' attribute was modified.');

                }
            }
        };

        // Create an observer instance linked to the callback function
        var observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(this, config);

    }
}
customElements.define("sort-log", SortLog);
