'use strict';

var _configoptions = require('./configoptions');

var _configoptions2 = _interopRequireDefault(_configoptions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InputGroup = React.createClass({
    displayName: 'InputGroup',

    getInitialState: function getInitialState() {
        return {
            areaFunction: "function() {\n    \n}"
        };
    },
    update: function update(event) {
        this.setState({
            areaFunction: event.target.value
        });
        // this.props.onChange();
    },
    render: function render() {
        var inputName = this.props.inputname;
        var inputEl = React.createElement('input', { onChange: this.update, className: 'input-group__input', name: inputName });
        if (this.props.textArea === true) {
            inputEl = React.createElement(
                'textarea',
                { onChange: this.update, className: 'input-group__input input-group__input--textarea', name: inputName },
                this.state.areaFunction
            );
        }
        return React.createElement(
            'p',
            { className: 'input-group wrap' },
            React.createElement(
                'label',
                { className: 'input-group__label', htmlFor: inputName },
                inputName[0].toUpperCase() + inputName.slice(1)
            ),
            inputEl
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
                var textArea = typeof this.props.inputTypes[type] === 'function';
                return React.createElement(InputGroup, { inputname: type, textArea: textArea });
            }.bind(this))
        );
    }
});

var CardBoard = React.createClass({
    displayName: 'CardBoard',

    allCards: function allCards(option, i) {
        return React.createElement(Card, {
            key: i,
            configType: option,
            optionsObject: this.props.optionsObject,
            inputTypes: this.props.optionsObject[option] });
    },
    handleChange: function handleChange() {
        console.log("changing cardboard", arguments);
    },
    render: function render() {
        return React.createElement(
            'div',
            { className: 'cardWrap', onChange: this.handleChange },
            this.props.optionsArray.map(this.allCards.bind(this))
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
            return "    " + v;
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
    handleUpdate: function handleUpdate() {},
    render: function render() {
        return React.createElement(
            'div',
            { onChange: this.handleUpdate },
            React.createElement(CardBoard, {
                optionsArray: this.state.optionsArray,
                optionsObject: this.state.optionsObject }),
            React.createElement(ResultCode, null)
        );
    }
});

ReactDOM.render(React.createElement(Parent, null), document.getElementById('reactContainer'));
