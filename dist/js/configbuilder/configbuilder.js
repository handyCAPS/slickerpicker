'use strict';

var _configoptions = require('./configoptions');

var _configoptions2 = _interopRequireDefault(_configoptions);

var _Events = require('./Events');

var _Events2 = _interopRequireDefault(_Events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InputGroup = React.createClass({
    displayName: 'InputGroup',

    getInitialState: function getInitialState() {
        return {
            areaFunction: "function() {\n    \n}"
        };
    },
    update: function update(inputName, content) {
        this.setState({
            areaFunction: content
        });
        _Events2.default.publish('input/update', { inputName: inputName, content: content });
        this.props.onChange({ inputName: inputName, content: content });
    },
    render: function render() {
        var inputName = this.props.inputname;
        var onChangeCb = this.update.bind(null, inputName, this.props.children);

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

    handleUpdate: function handleUpdate() {
        this.props.onChange(arguments);
    },
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
                return React.createElement(InputGroup, { inputname: type, textArea: textArea, onChange: this.handleUpdate });
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
    handleChange: function handleChange() {
        this.props.onChange(arguments);
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
            configCodeArray: [{ base: 'base' }, { onInit: 'function() {}' }]
        };
    },
    buildCodeString: function buildCodeString() {
        function mapCodeArray(v) {
            var codeArray = [],
                denom = "'";
            for (var key in v) {
                if (v[key].trim().indexOf('function') === 0) {
                    denom = '';
                }
                codeArray.push('    ' + key + ": " + denom + v[key] + denom);
            }
            return codeArray.join("\n");
        }
        return "var config = {\n" + this.state.configCodeArray.map(mapCodeArray).join('\n') + "\n};";
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
    handleUpdate: function handleUpdate(event) {
        console.log(event);
    },
    render: function render() {
        return React.createElement(
            'div',
            null,
            React.createElement(CardBoard, {
                onChange: this.handleUpdate,
                optionsArray: this.state.optionsArray,
                optionsObject: this.state.optionsObject }),
            React.createElement(ResultCode, null)
        );
    }
});

ReactDOM.render(React.createElement(Parent, null), document.getElementById('reactContainer'));

// Events.subscribe('input/update', function(ob) {console.log(ob.inputName)});
