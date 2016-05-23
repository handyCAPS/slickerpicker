'use strict';

var _configoptions = require('./configoptions');

var _configoptions2 = _interopRequireDefault(_configoptions);

var _Events = require('./Events');

var _Events2 = _interopRequireDefault(_Events);

var _Resultcode = require('./Resultcode');

var _Resultcode2 = _interopRequireDefault(_Resultcode);

var _Cardboard = require('./Cardboard');

var _Cardboard2 = _interopRequireDefault(_Cardboard);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var React = require('react');

var ReactDOM = require('react-dom');

var Parent = React.createClass({
    displayName: 'Parent',

    fString: "function() {\n    \n}",
    getConfigCodeArray: function getConfigCodeArray() {
        var confOb = Object.assign({}, this.state.optionsObject),
            confArray = [];
        for (var key in confOb) {
            var tmpOb = {};
            tmpOb[key] = Object.assign({}, confOb[key]);
            confArray.push(tmpOb);
        }
        console.log(confArray);
        return confArray.map(function (ob) {
            for (var type in ob) {
                console.log('Ob= ', ob);
                for (var prop in ob[type]) {
                    if (ob[type][prop] === '') {
                        delete ob[prop];
                    }
                }
            }
            return ob;
        });
    },
    getCodeString: function getCodeString() {
        function mapCodeArray(v) {
            var codeArray = [],
                denom = "'";
            for (var key in v) {
                if (typeof v[key] !== 'string') {
                    return [v[key]].map(mapCodeArray);
                }
                if (v[key].trim().indexOf('function') === 0) {
                    denom = '';
                }
                codeArray.push('    ' + key + ": " + denom + v[key] + denom);
            }
            return codeArray.join(",\n");
        }
        return "var config = {\n" + this.getConfigCodeArray().map(mapCodeArray).join(',\n') + "\n};";
    },
    handleUpdate: function handleUpdate(ob) {
        if (ob.content.trim() !== '' && ob.content.trim() !== this.fString) {
            var confOb = this.state.optionsObject;
            confOb[ob.configType][ob.inputName] = ob.content;
            this.setState({ optionsObject: confOb });
            window.setTimeout(Prism.highlightAll, 1);
        }
    },
    getInitialState: function getInitialState() {
        var stateOb = {};
        stateOb.optionsArray = [];
        for (var option in _configoptions2.default) {
            stateOb.optionsArray.push(option);
        }
        stateOb.optionsObject = _configoptions2.default;
        return stateOb;
    },
    componentDidMount: function componentDidMount() {
        _Events2.default.subscribe('input/update', this.handleUpdate);
    },
    render: function render() {
        return React.createElement(
            'div',
            null,
            React.createElement(_Cardboard2.default, {
                fString: this.fString,
                optionsArray: this.state.optionsArray,
                optionsObject: this.state.optionsObject }),
            React.createElement(_Resultcode2.default, {
                optionsObject: this.state.optionsObject,
                codeString: this.getCodeString() })
        );
    }
});

ReactDOM.render(React.createElement(Parent, null), document.getElementById('reactContainer'));
