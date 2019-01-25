/* eslint-disable no-console */
/* eslint-disable prefer-template */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-const */
/* eslint-disable indent */
/* eslint-disable no-empty */
/* eslint-disable space-before-function-paren */
/* eslint-disable no-unused-lets */
/* eslint-disable quotes */
/* eslint-disable no-continue */
/* eslint-disable camelcase */
/* eslint-disable func-names */
/* eslint-disable no-alert */
/* eslint-disable max-len */

// recursively creates one directory top to bottom
function createStructure(array, i, j, prop = '') {
    let type = array[i][j];
    let message = '';
    if (!type.parent) {
        // no parent means we are at the bottom of the directory
        message += '<div class="buttons inner"><button class="bottom">from method ' + type.addedType + '</button></div>';
    } else {
        // if the element has a parent, make a div containing the type being added
        if (prop) {
            message += '<div class="buttons inner"><button class="container">' + type.addedType + '</button>';
            message += '<button class="property">' + prop + '</button>';
        } else {
            message += '<div class="buttons"><button class="top">' + type.addedType + '</button>';
        }
        // nest another block containing the object's parent, which must be in the previous array
        message += '</div><div class="block">' + createStructure(array, i - 1, array[i - 1].findIndex(o => o.addedType === type.parent), type.property);
    }
    // close every div of class "block" before returning the structure
    message += '</div>';
    return message;
}

// appends directories from createStructure to the website
function displayLog(array) {
    for (let i = array.length - 1; i >= 0; i--) {
        for (let j = 0; j < array[i].length; j++) {
            if (array[i][j].child === 0) {
                // no children -> the type is at the uppermost level
                if (!array[i][j].parent) {
                    // no parent and no children -> the method is by itself
                    $('div.main').append('<div class="block"><div class="buttons"><button class="empty">' + array[i][j].addedType + '</button></div></div>');
                } else {
                    // creates a block starting from the top level (when child === 0) and appends it to the website
                    $('div.main').append('<div class="block">' + createStructure(array, i, j));
                }
            }
        }
    }
    // creates accordion style buttons
    $('.buttons').next().hide();
    // hide/show everything on load using line above
    $('button:not(.bottom, .empty, .property)').click((event) => {
        let target = $(event.target);
        if (target.is('button')) {
            target.toggleClass('open');
            target.parent().next().toggle();
        }
    });
}
