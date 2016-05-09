'use strict';

var Card = React.createClass({
    displayName: 'Card',

    render: function render() {
        var headerStyle = {
            textTransform: 'capitalize'
        };
        return React.createElement(
            'div',
            { className: 'large-6 columns' },
            React.createElement(
                'h2',
                { style: headerStyle },
                this.props.configType
            )
        );
    }
});

var ResultCode = React.createClass({
    displayName: 'ResultCode',

    getInitialState: function getInitialState() {
        return {
            configCodeOpen: "var config = {",
            configCodeArray: ["// some code ...", "// some other code ..."],
            configCodeClose: "};"
        };
    },
    render: function render() {
        return React.createElement(
            'div',
            { className: 'large-12 columns' },
            React.createElement(
                'pre',
                { className: 'codepen language-javascript' },
                this.state.configCodeOpen,
                React.createElement('br', null),
                this.state.configCodeArray.map(function (v) {
                    return "\t" + v;
                }).join('\n'),
                React.createElement('br', null),
                this.state.configCodeClose
            )
        );
    }
});

ReactDOM.render(React.createElement(
    'div',
    null,
    React.createElement(Card, { configType: 'classes' }),
    React.createElement(ResultCode, null)
), document.getElementById('reactContainer'));
