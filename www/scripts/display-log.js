class DisplayLog extends HTMLElement {
    constructor() {
        super();

        var shadow = this.attachShadow({
            mode: "open"
        });

        this.style.display = "none";

        var config = {
            attributes: true,
            childList: true,
            subtree: true
        };

        var main = document.createElement("div");
        main.id = "main";
        document.getElementsByTagName("body")[0].appendChild(main);

        function createStructure(array, type, element, prop = '',) {
            let message = '';
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
                message += '<div class="buttons inner"><button class="bottom">from method ' + type.addedType + '</button></div>';
            } else {
                // if the element has a parent, make a div containing the type being added
                if (prop) {
                    div.className += " inner";
                    typeButton.className = "container";

                    var propButton = document.createElement("button");
                    propButton.className = "property";
                    propButton.innerText = prop;
                    div.appendChild(propButton);

                    message += '<div class="buttons inner"><button class="container">' + type.addedType + '</button>';
                    message += '<button class="property">' + prop + '</button>';
                } else {
                    typeButton.className = "top";
                    message += '<div class="buttons"><button class="top">' + type.addedType + '</button>';
                }
                
                
                // nest another block containing the object's parent, which must be in the previous array
                createStructure(array, array.find(o => o.addedType === type.parent), block, type.property);
            }
            typeButton.innerText += type.addedType;
            div.insertAdjacentElement("afterbegin", typeButton);
            block.insertAdjacentElement("afterbegin", div);
            element.insertAdjacentElement("beforeend", block);
            // close every div of class "block" before returning the structure
            message += '</div>';
            //return message;
        }

        // appends directories from createStructure to the website
        function displayLog(array) {

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
                        console.log(array[i].type);

                    } else {
                        // creates a block starting from the top level (when child === 0) and appends it to the website
                        var main = document.getElementById("main");
                        createStructure(array, array[i], main);
                        //$('div#main').append('<div class="block">' + createStructure(array, array[i], main));
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

        // Callback function to execute when mutations are observed
        var callback = function (mutationsList, observer) {
            for (var mutation of mutationsList) {
                if (mutation.type == 'childList') {
                    console.log('display log has changed');
                    var obj = JSON.parse(document.getElementsByTagName('display-log')[0].textContent);
                    displayLog(obj);
                    observer.disconnect();

                }
                if (mutation.type == 'attributes') {
                    console.log('The ' + mutation.attributeName + ' attribute was modified.');

                }
            }
        };
        var observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(this, config);
    }
}

customElements.define("display-log", DisplayLog);