'use strict';

var _configoptions = require('./configoptions');

var _configoptions2 = _interopRequireDefault(_configoptions);

var _Events = require('./Events');

var _Events2 = _interopRequireDefault(_Events);

var _resultcode = require('./resultcode');

var _resultcode2 = _interopRequireDefault(_resultcode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var React = require('react');

var ReactDOM = require('react-dom');

var InputGroup = React.createClass({
    displayName: 'InputGroup',

    getInitialState: function getInitialState() {
        return {
            areaFunction: this.props.fString
        };
    },
    update: function update(event) {
        console.log('configType: ' + this.props.configType);
        var inputName = event.target.name,
            content = event.target.value,
            configType = this.props.configType;
        _Events2.default.publish('input/update', { inputName: inputName, content: content, configType: configType, event: event });
    },
    render: function render() {
        var inputName = this.props.inputname;
        var onChangeCb = this.update;

        var inputEl = React.createElement('input', {
            onChange: onChangeCb,
            className: 'input-group__input',
            name: inputName });

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
                var textArea = this.props.inputTypes[type].indexOf('function') === 0;
                return React.createElement(InputGroup, {
                    configType: this.props.configType,
                    fString: this.props.fString,
                    key: i + type,
                    inputname: type,
                    textArea: textArea });
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
            fString: this.props.fString,
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

    fString: "function() {\n    \n}",
    getConfigCodeArray: function getConfigCodeArray() {
        var confOb = this.state.optionsObject,
            confArray = [];
        for (var key in confOb) {
            confArray.push(confOb[key]);
        }
        console.log(confArray);
        return confArray.map(function (ob) {
            for (var _key in ob) {
                if (ob[_key] === '') {
                    delete ob[_key];
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
            React.createElement(CardBoard, {
                fString: this.fString,
                optionsArray: this.state.optionsArray,
                optionsObject: this.state.optionsObject }),
            React.createElement(_resultcode2.default, {
                optionsObject: this.state.optionsObject,
                codeString: this.getCodeString() })
        );
    }
});

ReactDOM.render(React.createElement(Parent, null), document.getElementById('reactContainer'));
