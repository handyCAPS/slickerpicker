'use strict';

var _configoptions = require('./configoptions');

var _configoptions2 = _interopRequireDefault(_configoptions);

var _Events = require('./Events');

var _Events2 = _interopRequireDefault(_Events);

var _resultcode = require('./resultcode');

var _resultcode2 = _interopRequireDefault(_resultcode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var React = require('react');

var InputGroup = React.createClass({
    displayName: 'InputGroup',

    getInitialState: function getInitialState() {
        return {
            areaFunction: "function() {\n    \n}"
        };
    },
    update: function update(event) {
        var inputName = event.target.name,
            content = event.target.value;
        // this.setState({
        //     areaFunction: event.target.value
        // });
        // console.log(event.target);
        _Events2.default.publish('input/update', { inputName: inputName, content: content });
    },
    render: function render() {
        var inputName = this.props.inputname;
        var onChangeCb = this.update;

        var inputEl = React.createElement('input', { onChange: onChangeCb, className: 'input-group__input', name: inputName });

        if (this.props.textArea === true) {
            inputEl = React.createElement(
                'textarea',
                {
                    className: 'input-group__input input-group__input--textarea',
                    rows: '3',
                    onChange: onChangeCb,
                    name: inputName },
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
            inputArr.map(function (type, i) {
                var textArea = typeof this.props.inputTypes[type] === 'function';
                return React.createElement(InputGroup, { key: i + type, inputname: type, textArea: textArea });
            }.bind(this))
        );
    }
});

var CardBoard = React.createClass({
    displayName: 'CardBoard',

    allCards: function allCards(option, i) {
        return React.createElement(Card, {
            onChange: this.handleUpdate,
            key: i,
            configType: option,
            optionsObject: this.props.optionsObject,
            inputTypes: this.props.optionsObject[option] });
    },
    render: function render() {
        return React.createElement(
            'div',
            { className: 'cardWrap' },
            this.props.optionsArray.map(this.allCards)
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
    formatFunction: function formatFunction(fn) {},
    handleUpdate: function handleUpdate(ob) {
        console.log('Object = ', ob.content.replace(/[^a-z]/gi, ''));
    },
    componentDidMount: function componentDidMount() {
        _Events2.default.subscribe('input/update', this.handleUpdate);
    },
    render: function render() {
        return React.createElement(
            'div',
            null,
            React.createElement(CardBoard, {
                optionsArray: this.state.optionsArray,
                optionsObject: this.state.optionsObject }),
            React.createElement(_resultcode2.default, {
                optionsObject: this.state.optionsObject })
        );
    }
});

ReactDOM.render(React.createElement(Parent, null), document.getElementById('reactContainer'));
