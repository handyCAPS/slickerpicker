
const React = require('react');

const ReactDOM = require('react-dom');

import configOptions from './configoptions';

import Events from './Events';

import ResultCode from './Resultcode';

import CardBoard from './Cardboard';


let Parent = React.createClass({
    fString: "function() {\n    \n}",
    getConfigCodeArray: function() {
        let confOb = this.state.optionsObject,
            confArray = [];
        for (let key in confOb) {
            confArray.push(confOb[key]);
        }
        console.log(confArray);
        return confArray.map(function(ob) {
            for (let key in ob) {
                if (ob[key] === '') {
                    delete ob[key];
                }
            }
            return ob;
        });
    },
    getCodeString: function() {
        function mapCodeArray(v) {
            let codeArray = [],
                denom = "'";
            for (let key in v) {
                if (typeof v[key] !== 'string') { return [v[key]].map(mapCodeArray); }
                if (v[key].trim().indexOf('function') === 0) { denom = ''; }
                codeArray.push('    ' + key + ": " + denom + v[key] + denom);
            }
            return codeArray.join(",\n");
        }
        return "var config = {\n" +
            this.getConfigCodeArray()
                .map(mapCodeArray)
                .join(',\n') +
                "\n};"
    },
    handleUpdate: function(ob) {
        if (ob.content.trim() !== '' && ob.content.trim() !== this.fString) {
            let confOb = this.state.optionsObject;
            confOb[ob.configType][ob.inputName] = ob.content;
            this.setState({optionsObject: confOb});
            window.setTimeout(Prism.highlightAll, 1);
        }
    },
    getInitialState: function() {
        let stateOb = {};
        stateOb.optionsArray = [];
        for (let option in configOptions) {
            stateOb.optionsArray.push(option);
        }
        stateOb.optionsObject = configOptions;
        return stateOb;
    },
    componentDidMount: function() {
        Events.subscribe('input/update', this.handleUpdate);
    },
    render: function() {
        return (
                <div>
                    <CardBoard
                        fString={this.fString}
                        optionsArray={this.state.optionsArray}
                        optionsObject={this.state.optionsObject} />
                    <ResultCode
                        optionsObject={this.state.optionsObject}
                        codeString={this.getCodeString()} />
                </div>
            );
    }
});

ReactDOM.render(<Parent />, document.getElementById('reactContainer'));
