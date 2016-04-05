
function get(el) {
    return document['querySelector' + (el.indexOf('#') === 0 ? '' : 'All')](el);
}



var SlickerPicker = function(element, options) {

    if (!element || element.tagName !== 'INPUT') {
        console.error('Element is not an input. ' + element);
        return;
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

    Input.listen();

};

var picker = new SlickerPicker(get('#test'));
