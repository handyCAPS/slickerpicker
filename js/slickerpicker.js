
function get(el) {
    return document['querySelector' + (el.indexOf('#') === 0 ? '' : 'All')](el);
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
        header: 'header',
        yearWrapper: 'yearWrapper',
        forwardButton: 'forwardButton',
        backwardButton: 'backwardButton',
        yearBox: 'yearBox',
        monthWrapper: 'monthWrapper',
        monthBox: 'monthBox'
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

    var dateObject = new Date();

    var Dates = {
        current: {
            year: dateObject.getFullYear(),
            month: dateObject.getMonth(),
            day: dateObject.getDay()
        },
        set: {
            year: null,
            month: null,
            day: null
        }
    };

    var Words = {
            year: {
                nl: 'jaar',
                en: 'year'
            },
            month: {
                nl: [
                    'Januari',
                    'Februari',
                    'Maart',
                    'April',
                    'Mei',
                    'Juni',
                    'Juli',
                    'Augustus',
                    'September',
                    'Oktober',
                    'November',
                    'December'
                ]
            },
            day: {
                nl: [
                    'Zo',
                    'Ma',
                    'Di',
                    'Wo',
                    'Do',
                    'Vr',
                    'Za'
                ],
                en: [
                    'Su',
                    'Mo',
                    'Tu',
                    'We',
                    'Th',
                    'Fr',
                    'Sa'

                ]
            }
    };

    function multiplyValue(property, n) {
        var value = parseFloat(property);
        var unit = property.replace(/[^a-z]/gi, '');
        return (value * n) + unit;
    }

    function setStyle(element, styleObject) {
        for (var prop in styleObject) {
            element.style[prop] = styleObject[prop];
        }
        return element;
    }

    function flexAlign(element) {
        var styles = {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around'
        };

        for (var style in styles) {
            element = setStyle(element, getPrefixed(style, styles[style]));
        }

        return element;
    }

    function getPrefixed(property, value) {
        var prefixes = [
            'webkit',
            'Moz',
            'o',
            'ms'
        ],
            resultOb = {};

        prefixes.forEach(function(prefix) {
            var preProp = prefix + property[0].toUpperCase() + property.slice(1, property.length);
            resultOb[preProp] = value;
        });

        resultOb[property] = value;

        return resultOb;
    }

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
        function getRow() {
            return document.createElement('tr');
        }

        function getCell() {
            return document.createElement('td');
        }

        function getTableHeader() {
            var header = getRow();
            for (var i = 0; i < 7; i++) {
                var thead = document.createElement('th');
                thead.textContent = Words.day.nl[i];
                thead.classList.add(getClass('header'));
                header.appendChild(thead);
            }
            return header;
        }

        function getTable(days, shift) {
            var table = document.createElement('table');
            table.classList.add(getClass('table'));
            table.appendChild(getTableHeader());
            var weeks = Math.floor((days + shift) / 7) + 1;
            for (var i = 0; i < weeks; i++) {
                var row = getRow();
                for (var j = 1; j < 8; j++) {
                    var cell = getCell();
                    var day = ((7 * i) + j);
                    if (day <= shift) {
                        day = '';
                    } else {
                        day = day - shift;
                    }
                    if (day > days) { day = ''; }
                    cell.textContent = day;
                    cell.classList.add(getClass('day'), getClass('dayN') + day);
                    row.appendChild(cell);
                }
                table.appendChild(row);
            }
            return table;
        }

        function getButton(listener, forward) {
            var idx = !!forward * 1;
            var button = document.createElement('div');
            button.classList.add(getClass(['back', 'forward'][idx] + 'Button'));
            button.innerHTML = ["&vltri;", "&vrtri;"][idx];
            button.style.cursor = 'pointer';
            button = setStyle(button, getPrefixed('userSelect', 'none'));
            button.addEventListener('click', listener);
            return button;
        }

        function getValueWrapper(month) {
            var idx = !!month * 1;
            var type = ['year', 'month'][idx];
            var yearWrapper = document.createElement('div');
            yearWrapper.classList.add(getClass(type + 'Wrapper'));
            yearWrapper = flexAlign(yearWrapper);

            var goBackListener = function() { moveYear(); };
            var goBack = getButton(goBackListener);
            goBack.style.display = 'inline-block';

            var yearBox = document.createElement('div');
            yearBox.classList.add(getClass(type + 'Box'));
            yearBox.textContent = month ? Words.month.nl[Dates.current.month] : Dates.current.year;
            yearBox.style.display = 'inline-block';

            var goForwardListener = function() { moveYear(true); };
            var goForward = getButton(goForwardListener, true);
            goForward.style.display = 'inline-block';

            yearWrapper.appendChild(goBack);
            yearWrapper.appendChild(yearBox);
            yearWrapper.appendChild(goForward);

            return yearWrapper;
        }

        function getMonthWrapper(month) {
            var wrapper = document.createElement('div');
            wrapper.classList.add(getClass('monthWrapper'));
            wrapper.textContent = Words.month.nl[month];

            return wrapper;
        }

        function getWrapper() {
            var wrapper = document.createElement('div');
            wrapper.classList.add(getClass('wrapper'));
            wrapper.id = spid;

            var styleObject = {
                display: 'inline-block',
                position: 'absolute',
                top: 0,
                left: 0
            };

            wrapper = setStyle(wrapper, styleObject);
            return wrapper;
        }

        function insertTable() {
            if (openTable === null) {
                var wrapper = getWrapper();
                wrapper.appendChild(getValueWrapper());
                wrapper.appendChild(getValueWrapper(true));
                wrapper.appendChild(getTable(28, 4));
                parentNode.insertBefore(wrapper, linkedInput.nextSibling);
                openTable = wrapper;
                setParentPosition();
            } else {
                toggleTableVis();
            }
        }

        function blankDay(day) {
            var cell = get(getClass('dayN', true) + day)[0];
            cell.innerHTML = "&vltri;";
            cell.style.pointerEvents = 'none';
        }

        function toggleTableVis(off) {
            if (openTable !== null) {
                openTable.hidden = !!off;
            }
        }

        function setParentPosition() {
            if (window.getComputedStyle(parentNode).getPropertyValue('position') === 'static') {
                parentNode.style.position = 'relative';
            }
        }

        function moveYear(forward) {
            var yearBox = get(getClass('yearBox', true))[0];
            var setYear = parseInt(yearBox.textContent);
            var newYear = forward ? setYear + 1 : setYear - 1;
            yearBox.textContent = newYear;
            Dates.set.year = newYear;
        }


        return {
            insertTable: insertTable,
            blankDay: blankDay,
            toggleTableVis: toggleTableVis
        };
    }());


    Input.listenIn();
    Input.listenOut();

    Table.insertTable();

};

var picker = new SlickerPicker(get('#test'));
