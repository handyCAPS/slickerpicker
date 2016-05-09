'use strict';

var _configoptions = require('./configoptions');

var _configoptions2 = _interopRequireDefault(_configoptions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InputGroup = React.createClass({
    displayName: 'InputGroup',

    getInitialState: function getInitialState() {
        return {
            inputValue: ''
        };
    },
    render: function render() {
        var inputName = this.props.inputname;
        return React.createElement(
            'p',
            { className: 'input-group wrap' },
            React.createElement(
                'label',
                { className: 'input-group__label', htmlFor: inputName },
                inputName[0].toUpperCase() + inputName.slice(1)
            ),
            React.createElement('input', { className: 'input-group__input', name: inputName, value: this.state.inputValue })
        );
    }
});

var Card = React.createClass({
    displayName: 'Card',

    render: function render() {
        var headerStyle = {
            textTransform: 'capitalize'
        };
        var inputName = 'todo',
            inputArr = [];

        for (var type in this.props.inputTypes) {
            inputArr.push(type);
        }

        return React.createElement(
            'div',
            { className: 'card' },
            React.createElement(
                'h2',
                { style: headerStyle },
                this.props.configType
            ),
            inputArr.map(function (type) {
                if (type !== '') {
                    inputName = type;
                }
                return React.createElement(InputGroup, { inputname: inputName });
            })
        );
    }
});

var ResultCode = React.createClass({
    displayName: 'ResultCode',

    getInitialState: function getInitialState() {
        return {
            configCodeArray: ["// some code ...", "// some other code ..."]
        };
    },
    buildCodeString: function buildCodeString() {
        return "var config = {\n" + this.state.configCodeArray.map(function (v) {
            return "\t" + v;
        }).join('\n') + "\n};";
    },
    render: function render() {
        return React.createElement(
            'section',
            { className: 'codepen' },
            React.createElement(
                'h3',
                null,
                'Your config code:'
            ),
            React.createElement(
                'pre',
                { className: 'language-javascript' },
                React.createElement(
                    'code',
                    { className: 'javascript language-javascript' },
                    this.buildCodeString()
                )
            )
        );
    }
});

var CardBoard = React.createClass({
    displayName: 'CardBoard',

    getInitialState: function getInitialState() {
        var stateOb = {};
        stateOb.optionsArray = [];
        for (var option in _configoptions2.default) {
            stateOb.optionsArray.push(option);
        }
        stateOb.optionsObject = _configoptions2.default;
        return stateOb;
    },
    allCards: function allCards() {},
    render: function render() {
        var self = this;
        return React.createElement(
            'div',
            { className: 'cardWrap' },
            this.state.optionsArray.map(function (option) {
                var inputTypes = {};
                if (this.state.optionsObject[option]) {
                    inputTypes = this.state.optionsObject[option];
                }
                return React.createElement(Card, { configType: option, inputTypes: inputTypes });
            }.bind(this))
        );
    }
});

ReactDOM.render(React.createElement(
    'div',
    { className: '' },
    React.createElement(CardBoard, null),
    React.createElement(ResultCode, null)
), document.getElementById('reactContainer'));
