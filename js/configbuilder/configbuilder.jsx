
const React = require('react');

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
        let inputName = event.target.name,
            content = event.target.value,
            configType = this.props.configType;
        Events.publish('input/update', {inputName, content, configType, event});
    },
    render: function() {
        let inputName = this.props.inputname;
        let onChangeCb = this.update;

        let inputEl = (<input
                        configType={this.props.configType}
                        onChange={onChangeCb}
                        className='input-group__input'
                        name={inputName} />);

        if (this.props.textArea === true) {
            inputEl = (
                    <textarea
                        configType={this.props.configType}
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
                        let textArea = typeof this.props.inputTypes[type] === 'function';
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
    getInitialState: function() {
        let stateOb = {};
        stateOb.optionsArray = [];
        for (let option in configOptions) {
            stateOb.optionsArray.push(option);
        }
        stateOb.optionsObject = configOptions;
        return stateOb;
    },
    fString: "function() {\n    \n}",
    handleUpdate: function(ob) {
        if (ob.content.trim() !== '' && ob.content.trim() !== this.fString) {
            let newObject = this.state.optionsObject;
            newObject[ob.configType] = ob.content;
            this.setState({optionsObject: newObject});
        }
        console.log(ob.configType, ob.content, this.fString, ob.content === this.fString);
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
                        optionsObject={this.state.optionsObject}/>
                </div>
            );
    }
});

ReactDOM.render(<Parent />, document.getElementById('reactContainer'));
