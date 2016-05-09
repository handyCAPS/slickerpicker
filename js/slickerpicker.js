
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
        monthBox: 'monthBox',
        resetButton: 'resetButton',
        hiddenInput: 'hiddenInput',
        focused: 'focused'
    };

    function getClass(type, withPoint) {
        var point = withPoint ? '.' : '';
        return point + Classes['base'] + '-' + Classes[type];
    }

    var otherPickers = get(getClass('wrapper', true));
    var spid = Classes['base'] + (otherPickers === undefined ? 0 : otherPickers.length);

    var parentNode = linkedInput.parentNode;

    var tableClicked = false;

    var tableIsOpen = false;

    var dateObject = new Date(Date.now());

    var lang = 'nl';

    var SPEL = {
        tableWrapper: null,
        table: null,
        resetButton: null,
        value: {
            year: null,
            month: null
        }
    };

    var Dates = {
        current: {
            year: dateObject.getFullYear(),
            month: dateObject.getMonth(),
            day: dateObject.getDate()
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


    function setStyle(element, styleObject) {
        for (var prop in styleObject) {
            element.style[prop] = styleObject[prop];
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
            dayShift: new Date(year, month, 1).getDay(),
            days: new Date(year, month + 1, 0).getDate()
        };
    }

    function initDates() {
        for (var prop in Dates.current) {
            Dates.set[prop] = Dates.current[prop];
        }
    }

    function getSetDate() {
        var setDate = new Date(Dates.set.year, Dates.set.month, Dates.set.day);
        return setDate;
    }




    var Input = (function() {
        var inListener = function() {
            if (SPEL.tableWrapper !== null && !tableIsOpen) {
                Table.insertWrapper();
            }
            if (!tableIsOpen) {
                Table.toggleTableVis();
            }
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

        function getCell(day) {
            var cell = document.createElement('td');
            cell.dataset.day = day;

            var selectDay = function(event) {
                setFocusedDay(event.currentTarget);
                Dates.set.day = day;
                linkedInput.value = getSetDate().toLocaleDateString();
                window.setTimeout(function() {toggleTableVis(true);}, 500);
            };

            if (typeof day === 'number') {
                cell.tabIndex = 1;
                cell.addEventListener('click', selectDay);
            }
            return cell;
        }

        function getTableHeader() {
            var header = getRow();
            for (var i = 0; i < 7; i++) {
                var thead = document.createElement('th');
                thead.textContent = Words.day[lang][i];
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
                    var day = ((7 * i) + j);
                    if (day <= shift) {
                        day = '';
                    } else {
                        day = day - shift;
                    }
                    if (day > days) { day = ''; }
                    var cell = getCell(day);
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

        function getResetButton() {
            var button = document.createElement('button');
            button.type = 'button';
            button.classList.add(getClass('resetButton'));
            button.textContent = 'reset';
            button.addEventListener('click', function() {
                resetCalender();
            });

            return button;
        }

        function getHiddenInput() {
            var input = document.createElement('input');
            input.type = 'hidden';
            input.name = getClass('hiddenInput') + spid;

            return input;
        }

        function insertHiddenInput() {
            parentNode.insertBefore(getHiddenInput(), linkedInput.nextSibling);
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

            var valueBoxStyles = {
                textAlign: 'center',
                width: '50%',
                display: 'inline-block'
            };
            valueBox = setStyle(valueBox, valueBoxStyles);

            SPEL.value[type] = valueBox;

            setValueText(type);

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

            var wrapperStyles = {
                display: 'inline-block',
                position: 'absolute',
                top: window.getComputedStyle(linkedInput).getPropertyValue('height'),
                left: 0
            };

            wrapper = setStyle(wrapper, wrapperStyles);
            return wrapper;
        }

        function insertWrapper() {
            setParentPosition();
            var wrapper = getWrapper();
            wrapper.appendChild(getResetButton());
            wrapper.appendChild(getValueWrapper());
            wrapper.appendChild(getValueWrapper(true));
            parentNode.insertBefore(wrapper, linkedInput.nextSibling);
            SPEL.tableWrapper = wrapper;
            tableIsOpen = true;
            insertTable();
        }

        function insertTable() {
            if (SPEL.table !== null) {
                SPEL.table.remove();
            }
            var wrapper = SPEL.tableWrapper;
            var monthInfo = getMonthInfo(Dates.set.month, Dates.set.year),
                table = getTable(monthInfo.days, monthInfo.dayShift);
            wrapper.appendChild(table);
            focusCurrentDay();
            SPEL.table = table;
        }

        function toggleTableVis(off) {
            if (SPEL.tableWrapper !== null) {
                SPEL.tableWrapper.hidden = !!off;
                SPEL.tableWrapper.style.display = ['inline-block', 'none'][!!off * 1];
                tableIsOpen = !off;
            }
        }

        function setParentPosition() {
            if (window.getComputedStyle(parentNode).getPropertyValue('position') === 'static') {
                parentNode.style.position = 'relative';
            }
        }

        function setValueText(type) {
            var text = Dates.set.year;
            if (type === 'month') {
                text = Words.month[lang][Dates.set.month];
            }
            SPEL.value[type].textContent = text;
        }

        function focusCurrentDay() {
            get(getClass('dayN', true) + (Dates.set.day || 1))[0].classList.add(getClass('focused'));
        }

        function setFocusedDay(dayElement) {
            get(getClass('focused', true))[0].classList.remove(getClass('focused'));
            dayElement.classList.add(getClass('focused'));
        }

        function moveValue(type, forward) {
            var setValue   = Dates.set[type],
                newValue   = forward ? setValue + 1 : setValue - 1;

            if (type === 'month') {
                if (newValue < 0) {
                    newValue = 11;
                    moveValue('year');
                }
                if (newValue > 11) {
                    newValue = 0;
                    moveValue('year', true);
                }
            }


            Dates.set[type] = newValue;

            setValueText(type);

            insertTable();
        }

        function resetCalender() {
            initDates();
            setValueText('year');
            setValueText('month');
            insertTable();
        }


        return {
            insertWrapper: insertWrapper,
            resetCalender: resetCalender,
            insertHiddenInput: insertHiddenInput,
            toggleTableVis: toggleTableVis
        };
    }());


    function init() {

        initDates();

        Table.insertWrapper();

        Table.insertHiddenInput();

        Input.listenIn();
        // Input.listenOut();

    }

    return {
        init: init,
        Table: Table
    };

};

var picker = new SlickerPicker(get('#test'));

picker.init();