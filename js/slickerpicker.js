
function get(el) {
    return document['querySelector' + (el.indexOf('#') === 0 ? '' : 'All')](el);
}



var SlickerPicker = function(element, options) {

    if (!element || element.tagName !== 'INPUT') {
        console.error('Element is not an input. ' + element);
        return;
    }

    var Classes = {
        base: 'SlickerPicker',
        table: 'table',
        day: 'day',
        dayN: 'day-'
    };

    function getClass(type, withPoint) {
        var point = withPoint ? '.' : '';
        return point + Classes['base'] + '-' + Classes[type];
    }

    var Input = (function() {
        var listener = function() {
            console.log('Listening');
        };
        function listen(stop) {
            element[['add', 'remove'][!!stop * 1] + 'EventListener']('focus', listener);
        }

        return {
            listen: listen
        };

    }());

    var Table = (function() {
        var daysOfWeek = [
            'Ma',
            'Di',
            'Wo',
            'Do',
            'Vr',
            'Za',
            'Zo'
        ];
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
                thead.textContent = daysOfWeek[i];
                header.appendChild(thead);
            }
            return header;
        }
        function createTable(days) {
            var table = document.createElement('table');
            table.classList.add(getClass('table'));
            table.appendChild(createTableHeader());
            for (var i = 0; i < 5; i++) {
                var row = createRow();
                for (var j = 1; j < 8; j++) {
                    var cell = createCell();
                    var day = (7 * i) + j;
                    if (day > days) { day = ''; }
                    cell.textContent = day;
                    cell.classList.add(getClass('day'), getClass('dayN') + day);
                    row.appendChild(cell);
                }
                table.appendChild(row);
            }
            return table;
        }

        function blankDay(day) {
            var cell = get(getClass('dayN', true) + day)[0];
            cell.classList.add('hidden');
            cell.textContent = '';
            cell.style.pointerEvents = 'none';
        }

        return {
            createTable: createTable,
            blankDay: blankDay
        };
    }());

    document.body.appendChild(Table.createTable(31));

    Table.blankDay(4);

    Input.listen();

};

var picker = new SlickerPicker(get('#test'));
