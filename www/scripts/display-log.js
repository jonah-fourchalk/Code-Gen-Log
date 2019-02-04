class DisplayLog extends HTMLElement {
    constructor() {
        super();

        // gets the sorted object from local storage and runs the display log function on it
        try{
            var sorted = localStorage.getItem("sorted-obj");
            var obj = JSON.parse(sorted);
            console.log(obj);
            displayLog(obj);
        } catch(err){
            console.error(err);
        }

        function createStructure(array, type, element, prop = '',) {

            var block = document.createElement("div");
            block.className = "block";
            var div = document.createElement("div");
            div.className = "buttons";
            var typeButton = document.createElement("button");
        
            if (!type.parent) {
                // no parent means we are at the bottom of the directory
                div.className += " inner";
                typeButton.className = "bottom";
                typeButton.innerText = "from method "
            } else {
                // if the element has a parent, make a div containing the type being added
                if (prop) {
                    div.className += " inner";
                    typeButton.className = "container";

                    var propButton = document.createElement("button");
                    propButton.className = "property";
                    propButton.innerText = prop;
                    div.appendChild(propButton);

                } else {
                    typeButton.className = "top";
                }
                 
                // nest another block containing the object's parent, which must be in the previous array
                createStructure(array, array.find(o => o.addedType === type.parent), block, type.property);
            }
            typeButton.innerText += type.addedType;
            div.insertAdjacentElement("afterbegin", typeButton);
            block.insertAdjacentElement("afterbegin", div);
            element.insertAdjacentElement("beforeend", block);
            // close every div of class "block" before returning the structure
            //return message;
        }

        // appends directories from createStructure to the website
        function displayLog(array) {
            var main = document.createElement("div");
            main.id = "main";
            document.getElementsByTagName("body")[0].appendChild(main);
            for (let i = array.length - 1; i >= 0; i--) {
                if (array[i].children === 0) {
                    // no children -> the type is at the uppermost level
                    if (!array[i].parent) {
                        // no parent and no children -> the method is by itself
                        var block = document.createElement("div");
                        block.className = "block";
                        var div = document.createElement("div");
                        div.className = "buttons";
                        var button = document.createElement("button");
                        button.className = "empty";
                        button.innerText = array[i].addedType;

                        div.appendChild(button);
                        block.appendChild(div);
                        main.appendChild(block);
                        

                    } else {
                        // creates a block starting from the top level (when child === 0) and appends it to the website            
                        createStructure(array, array[i], main);
                    }
                }
            }
            // creates accordion style buttons

            // hide/show everything on load using line above
            $('button:not(.bottom, .empty, .property)').click((event) => {
                let target = $(event.target);
                if (target.is('button')) {
                    target.toggleClass('open');
                    target.parent().next().toggle();
                }
            });
        }
    }
}

customElements.define("display-log", DisplayLog);