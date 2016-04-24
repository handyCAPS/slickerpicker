
function get(el) {
    return document['querySelector' + (el.indexOf('#') === 0 ? '' : 'All')](el);
}


var SlickerPicker = function(linkedInput, options) {

    "use strict";

    if (!linkedInput || linkedInput.tagName !== 'INPUT') {
        console.error('Element is not an input. ' + linkedInput);
        return;
    }

    /**
     * Get the vendor prefix
     * @via https://davidwalsh.name/vendor-prefix
     */
    var prefix = (function () {
      var styles = window.getComputedStyle(document.documentElement, ''),
        pre = (Array.prototype.slice
          .call(styles)
          .join('')
          .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
        )[1],
        dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
      return {
        dom: dom,
        lowercase: pre,
        css: '-' + pre + '-',
        js: pre[0].toUpperCase() + pre.substr(1)
      };
    })();


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

    var openTableWrapper = null,
        openTable = null;

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

    function getMonthInfo(month, year) {
        return {
            dayShift: new Date(month + '/1/' + year).getDay(),
            days: new Date(year, month, 0).getDate()
        };
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
            var cell = document.createElement('td');
            cell.tabIndex = 1;
            return cell;
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
            table.tabIndex = 1;
            table.appendChild(getTableHeader());
            var weeks = Math.ceil((days + shift) / 7);
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
            button.classList.add(getClass(['backward', 'forward'][idx] + 'Button'));
            button.innerHTML = ["&vltri;", "&vrtri;"][idx];

            var buttonStyles = {
                display: 'inline-block',
                width: '25%',
                textAlign: 'center',
                cursor: 'pointer'
            };

            button = setStyle(button, buttonStyles);
            button = setStyle(button, getPrefixed('userSelect', 'none'));
            button.tabIndex = 1;
            button.addEventListener('click', listener);
            button.addEventListener('keydown', function(event) {
                // Using keydown because thats when the spacebar scrolls,
                // which needs to be prevented
                switch (event.key.toLowerCase()) {
                    case 'enter':
                        return listener(arguments);
                    case ' ':
                        event.preventDefault();
                        return listener(arguments);
                    default:
                        return;
                }
            });
            return button;
        }

        function getValueWrapper(month) {
            var idx = !!month * 1;
            var type = ['year', 'month'][idx];
            var valueWrapper = document.createElement('div');
            valueWrapper.classList.add(getClass(type + 'Wrapper'));

            var goBackListener = function() { moveValue(type); };
            var goBack = getButton(goBackListener);

            var valueBox = document.createElement('div');
            valueBox.classList.add(getClass(type + 'Box'));
            valueBox.textContent = month ? Words.month.nl[Dates.current.month] : Dates.current.year;
            var valueBoxStyles = {
                textAlign: 'center',
                width: '50%',
                display: 'inline-block'
            };
            valueBox = setStyle(valueBox, valueBoxStyles);

            var goForwardListener = function() { moveValue(type, true); };
            var goForward = getButton(goForwardListener, true);

            valueWrapper.appendChild(goBack);
            valueWrapper.appendChild(valueBox);
            valueWrapper.appendChild(goForward);

            return valueWrapper;
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

        function insertWrapper() {
            setParentPosition();
            var wrapper = getWrapper();
            wrapper.appendChild(getValueWrapper());
            wrapper.appendChild(getValueWrapper(true));
            parentNode.insertBefore(wrapper, linkedInput.nextSibling);
            openTableWrapper = wrapper;
            insertTable(Dates.set.month + 1, Dates.set.year);
        }

        function insertTable(month, year) {
            if (openTable !== null) {
                openTable.remove();
            }
            var wrapper = openTableWrapper;
            var monthInfo = getMonthInfo(month, year),
                table = getTable(monthInfo.days, monthInfo.dayShift);
            wrapper.appendChild(table);
            openTable = table;
        }

        function toggleTableVis(off) {
            if (openTableWrapper !== null) {
                openTableWrapper.hidden = !!off;
            }
        }

        function setParentPosition() {
            if (window.getComputedStyle(parentNode).getPropertyValue('position') === 'static') {
                parentNode.style.position = 'relative';
            }
        }

        function moveValue(type, forward) {
            var target     = get(getClass(type + 'Box', true))[0],
                setValue   = Dates.set[type],
                newValue   = forward ? setValue + 1 : setValue - 1,
                content    = newValue;

            if (type === 'month') {
                if (newValue < 0) {
                    newValue = 11;
                    moveValue('year');
                }
                if (newValue > 11) {
                    newValue = 0;
                    moveValue('year', true);
                }
                content = Words.month.nl[newValue];
            }

            target.textContent = content;

            Dates.set[type] = newValue;

            insertTable(Dates.set.month + 1, Dates.set.year);
        }


        return {
            insertWrapper: insertWrapper
        };
    }());


    function init() {

        Dates.set = Dates.current;

        Table.insertWrapper();

        // Input.listenIn();
        // Input.listenOut();

    }

    init();

};

var picker = new SlickerPicker(get('#test'));
