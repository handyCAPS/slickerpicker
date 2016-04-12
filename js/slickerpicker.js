
function get(el) {
    return document['querySelector' + (el.indexOf('#') === 0 ? '' : 'All')](el);
}

function findParent(node, type) {
    var tag = node.tagName.toLowerCase();
    console.log(tag);
    if (tag === type.toLowerCase()) { return node; }
    if (!node.parent) { return null; }
    return findParent(node.parent, type);
}

function multiplyValue(property, n) {
    var value = parseInt(property.replace(/[^0-9]/g, ''));
    var unit = property.replace(/[0-9]/gi, '');
    return (value * n) + unit;
}

function setStyle(element, styleObject) {
    for (var prop in styleObject) {
        element.style[prop] = styleObject[prop];
    }
}



var SlickerPicker = function(linkedInput, options) {

    "use strict";

    if (!linkedInput || linkedInput.tagName !== 'INPUT') {
        console.error('Element is not an input. ' + linkedInput);
        return;
    }

    var Classes = {
        base: 'SlickerPicker',
        wrapper: 'wrapper',
        table: 'table',
        day: 'day',
        dayN: 'day-',
        header: 'header'
    };

    function getClass(type, withPoint) {
        var point = withPoint ? '.' : '';
        return point + Classes['base'] + '-' + Classes[type];
    }

    var otherPickers = get(getClass('wrapper', true));
    var spid = Classes['base'] + (otherPickers === undefined ? 0 : otherPickers.length);

    var parentNode = linkedInput.parentNode;

    var openTable = null;

    var tableClicked = false;

    var daysOfWeek = {
        nl: [
            'Ma',
            'Di',
            'Wo',
            'Do',
            'Vr',
            'Za',
            'Zo'
        ]
    };

    var Input = (function() {
        var inListener = function() {
            Table.insertTable();
        };
        var outListener = function(event) {
            var clickedElement = event.relatedTarget;
            // var parentDiv = findParent(clickedElement, 'div');
            // var closestPa = Element.closest.call(clickedElement, getClass('wrapper', true));
            window.setTimeout(function() {
                console.log('Tabele cLiked' + tableClicked);
                if (!tableClicked) {
                    Table.toggleTableVis(true);
                }
            }, 1000);
        };
        function listenIn(stop) {
            linkedInput[['add', 'remove'][!!stop * 1] + 'EventListener']('focus', inListener);
        }
        function listenOut(stop) {
            linkedInput[['add', 'remove'][!!stop * 1] + 'EventListener']('blur', outListener);
        }

        return {
            listenIn: listenIn,
            listenOut: listenOut
        };

    }());

    var Table = (function() {
        function createRow() {
            return document.createElement('tr');
        }

        function createCell() {
            return document.createElement('td');
        }

        function createTableHeader() {
            var header = createRow();
            for (var i = 0; i < 7; i++) {
                var thead = document.createElement('th');
                thead.textContent = daysOfWeek['nl'][i];
                thead.classList.add(getClass('header'));
                header.appendChild(thead);
            }
            return header;
        }

        function createTable(days, dummies) {
            var table = document.createElement('table');
            table.classList.add(getClass('table'));
            table.appendChild(createTableHeader());
            for (var i = 0; i < 5; i++) {
                var row = createRow();
                for (var j = 1; j < 8; j++) {
                    var cell = createCell();
                    var day = (7 * i) + j;
                    if (day > days) { day = ''; }
                    if (dummies.length) {
                        day -= dummies[1];
                        if (day > dummies[0] && day < dummies[1] + 1) { day = ''; }
                    }
                    cell.textContent = day;
                    cell.classList.add(getClass('day'), getClass('dayN') + day);
                    row.appendChild(cell);
                }
                table.appendChild(row);
            }
            return table;
        }

        function createWrapper () {
            var wrapper = document.createElement('div');
            wrapper.classList.add(getClass('wrapper'));
            wrapper.id = spid;

            var styleObject = {
                'display': 'inline-block',
                'position': 'absolute',
                'top': multiplyValue(window.getComputedStyle(linkedInput).getPropertyValue('height'), 2),
                'left': 0
            };
            
            setStyle(wrapper, styleObject);
            return wrapper;
        }

        function insertTable() {
            if (openTable === null) {
                var wrapper = createWrapper();
                wrapper.appendChild(createTable(31, [0,4]));
                parentNode.insertBefore(wrapper, linkedInput.nextSibling);
                openTable = wrapper;
                get(getClass('wrapper', true))[0].addEventListener('click', function(event) {
                    tableClicked = true;
                });
            } else {
                toggleTableVis();
            }
        }

        function blankDay(day) {
            var cell = get(getClass('dayN', true) + day)[0];
            cell.classList.add('hidden');
            cell.textContent = '';
            cell.style.pointerEvents = 'none';
        }

        function toggleTableVis(off) {
            if (openTable !== null) {
                openTable.hidden = !!off;
            }
        }

        return {
            insertTable: insertTable,
            blankDay: blankDay,
            toggleTableVis: toggleTableVis
        };
    }());


    Input.listenIn();
    Input.listenOut();

};

var picker = new SlickerPicker(get('#test'));
