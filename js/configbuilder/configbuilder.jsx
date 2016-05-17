
import configOptions from './configoptions';

import Events from './Events';


let InputGroup = React.createClass({
    getInitialState: function() {
        return {
            areaFunction: "function() {\n    \n}"
        };
    },
    update: function(inputName, content) {
        this.setState({
            areaFunction: content
        });
        Events.publish('input/update', {inputName, content});
        this.props.onChange({inputName, content});
    },
    render: function() {
        let inputName = this.props.inputname;
        let onChangeCb = this.update.bind(null, inputName, this.props.children);

        let inputEl = (<input onChange={onChangeCb} className='input-group__input' name={inputName} />);

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
    handleUpdate: function() {
        this.props.onChange(arguments);
    },
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
                    {inputArr.map(function(type) {
                        let textArea = typeof this.props.inputTypes[type] === 'function';
                        return (<InputGroup inputname={type} textArea={textArea} onChange={this.handleUpdate} />);
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
                    configType={option}
                    optionsObject={this.props.optionsObject}
                    inputTypes={this.props.optionsObject[option]} />
            );
    },
    handleChange: function() {
        this.props.onChange(arguments);
    },
    render: function() {
        return (
                <div className='cardWrap' onChange={this.handleChange}>
                    {this.props.optionsArray.map(this.allCards.bind(this))}
                </div>
            );
    }
});

let ResultCode = React.createClass({
    getInitialState: function() {
        return {
            configCodeArray: [{base: 'base'}, {onInit: 'function() {}'}]
        };
    },
    buildCodeString: function() {
        function mapCodeArray(v) {
            let codeArray = [],
                denom = "'";
            for (let key in v) {
                if (v[key].trim().indexOf('function') === 0) { denom = ''; }
                codeArray.push('    ' + key + ": " + denom + v[key] + denom);
            }
            return codeArray.join("\n");
        }
        return "var config = {\n" +
            this.state.configCodeArray
                .map(mapCodeArray)
                .join('\n') +
                "\n};"
    },
    render: function() {
        return (
                <section className='codepen'>
                    <h3>Your config code:</h3>
                    <pre className='language-javascript'>
                        <code className='javascript language-javascript'>
                            {this.buildCodeString()}
                        </code>
                    </pre>
                </section>
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
    handleUpdate: function(event) {
        console.log(event);
    },
    render: function() {
        return (
                <div>
                    <CardBoard
                        onChange={this.handleUpdate}
                        optionsArray={this.state.optionsArray}
                        optionsObject={this.state.optionsObject} />
                    <ResultCode />
                </div>
            );
    }
});

ReactDOM.render(<Parent />, document.getElementById('reactContainer'));

// Events.subscribe('input/update', function(ob) {console.log(ob.inputName)});