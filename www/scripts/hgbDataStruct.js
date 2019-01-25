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


// recursively creates the html string for each nested button set, to be appended to the main div
function createStructure(array, i, j) {
    let type = array[i][j];
    let message = '';
    if (!type.parent) {
        message += '<div class="buttons"><button class="bottom">from method ' + type.addedType + '</button></div>';
    } else {
        message += '<div class="buttons"><button class="container">' + type.addedType + '</button></div>';
        if (type.property) {
            message += '<div class="block"><div class="property">from property ' + type.property + '</div>';
        }
        message += createStructure(array, i - 1, array[i - 1].findIndex(o => o.addedType === type.parent));
    }
    message += '</div>';
    return message;
}

// loops through the array to add the nested button sets to the main div
function displayLog(array) {
    for (let i = array.length - 1; i >= 0; i--) {
        for (let j = 0; j < array[i].length; j++) {

            // ensures only bottom level AddTypes are shown at top level
            if (array[i][j].child === 0) {
                if (!array[i][j].parent) {
                    $('div.main').append('<div class="block"><div class="buttons"><button class="empty">' + array[i][j].addedType + '</button></div></div>');
                } else {
                    $('div.main').append('<div class="block">' + createStructure(array, i, j));
                }
            }
        }
    }

    // adds the click event to each button
    $('.buttons').next().hide();
    $('button:not(.bottom, .empty)').click((event) => {
        let target = $(event.target);
        if (target.is('button')) {
            target.toggleClass('open');
            target.parent().next().toggle();
        }
    });
}
