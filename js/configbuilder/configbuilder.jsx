
const React = require('react');

const ReactDOM = require('react-dom');

import configOptions from './configoptions';

import Events from './Events';

import ResultCode from './resultcode';


let InputGroup = React.createClass({
    getInitialState: function() {
        return {
            areaFunction: this.props.fString
        };
    },
    update: function(event) {
        console.log('configType: ' + this.props.configType);
        let inputName = event.target.name,
            content = event.target.value,
            configType = this.props.configType;
        Events.publish('input/update', {inputName, content, configType, event});
    },
    render: function() {
        let inputName = this.props.inputname;
        let onChangeCb = this.update;

        let inputEl = (<input
                        onChange={onChangeCb}
                        className='input-group__input'
                        name={inputName} />);

        if (this.props.textArea === true) {
            inputEl = (
                    <textarea
                        className='input-group__input input-group__input--textarea'
                        rows='3'
                        onChange={onChangeCb}
                        name={inputName} >
                            {this.state.areaFunction}
                    </textarea>
                );
        }

        return (
                <p className='input-group wrap'>
                    <label className='input-group__label' htmlFor={inputName}>{inputName[0].toUpperCase() + inputName.slice(1)}</label>
                    {inputEl}
                </p>
            );
    }
});

let Card = React.createClass({
    render: function() {
        let headerStyle = {
            textTransform: 'capitalize'
        };
        let inputArr = [];

        for (let type in this.props.inputTypes) {
            inputArr.push(type);
        }

        return (
                <div className='card'>
                    <h2 style={headerStyle}>{this.props.configType}</h2>
                    {inputArr.map(function(type, i) {
                        let textArea = this.props.inputTypes[type].indexOf('function') === 0;
                        return (<InputGroup
                            configType={this.props.configType}
                            fString={this.props.fString}
                            key={i+type}
                            inputname={type}
                            textArea={textArea} />);
                    }.bind(this))}
                </div>
            );
    }
});

let CardBoard = React.createClass({
    allCards: function(option, i) {
        return (
                <Card
                    onChange={this.handleUpdate}
                    key={i}
                    fString={this.props.fString}
                    configType={option}
                    optionsObject={this.props.optionsObject}
                    inputTypes={this.props.optionsObject[option]} />
            );
    },
    render: function() {
        return (
                <div className='cardWrap'>
                    {this.props.optionsArray.map(this.allCards)}
                </div>
            );
    }
});


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
