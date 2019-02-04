class Error extends HTMLElement {
    constructor() {
        super();

        function displayDuplicates(sortedArray) {
            // checks addedTypes in sorted for duplicates, then displays them in the error menu
            function getAddedType(currentObject, index) {
                return currentObject.addedType;
            }
            function clipName(name, index) {
                const match = /(^REST)/.exec(name) || /([^.]+)$/.exec(name);
                if (!/([\[\]])/.test(match)) { // TEMPORARY: prevents arrays from appearing in duplicateTypes
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
            // generate the error box content
            let errString = '';
            if (duplicateTypes != false) {
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
            var div = document.createElement("div");
            div.setAttribute("id", "error");
            $("h1").after(div);
            $('#error').append(errString);
            if (duplicateTypes == false) {
                // changes error box style
                $('#error').attr('id', 'noerror');
            }
        }
        const sorted = localStorage.getItem('sorted-obj');
        const sortedObj = JSON.parse(sorted);
        displayDuplicates(sortedObj);
    }
}
customElements.define('error-box', Error);
