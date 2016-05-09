'use strict';

var _configoptions = require('./configoptions');

var _configoptions2 = _interopRequireDefault(_configoptions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InputGroup = React.createClass({
    displayName: 'InputGroup',

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
            React.createElement('input', { className: 'input-group__input', name: inputName })
        );
    }
});

var Card = React.createClass({
    displayName: 'Card',

    render: function render() {
        var headerStyle = {
            textTransform: 'capitalize'
        };
        var inputArr = [];

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
                return React.createElement(InputGroup, { inputname: type });
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

    allCards: function allCards(option, i) {
        return React.createElement(Card, {
            key: i,
            configType: option,
            inputTypes: this.props.optionsObject[option] });
    },
    render: function render() {
        return React.createElement(
            'div',
            { className: 'cardWrap' },
            this.props.optionsArray.map(this.allCards.bind(this))
        );
    }
});

var Parent = React.createClass({
    displayName: 'Parent',

    getInitialState: function getInitialState() {
        var stateOb = {};
        stateOb.optionsArray = [];
        for (var option in _configoptions2.default) {
            stateOb.optionsArray.push(option);
        }
        stateOb.optionsObject = _configoptions2.default;
        return stateOb;
    },
    render: function render() {
        return React.createElement(
            'div',
            null,
            React.createElement(CardBoard, {
                optionsArray: this.state.optionsArray,
                optionsObject: this.state.optionsObject }),
            React.createElement(ResultCode, null)
        );
    }
});

ReactDOM.render(React.createElement(Parent, null), document.getElementById('reactContainer'));
