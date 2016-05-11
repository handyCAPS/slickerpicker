
import configOptions from './configoptions';


let InputGroup = React.createClass({
    update: function() {
        console.log('Changing ...');
        this.state.onChange();
    },
    render: function() {
        let inputName = this.props.inputname;
        let inputEl = (<input className='input-group__input' name={inputName} />);
        if (this.props.textArea === true) {
            inputEl = (
                    <textarea onChange={this.update} className='input-group__input input-group__input--textarea' name={inputName} />
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
                    {inputArr.map(function(type) {
                        let textArea = typeof this.props.inputTypes[type] === 'function';
                        return (<InputGroup inputname={type} textArea={textArea} />);
                    }.bind(this))}
                </div>
            );
    }
});

let ResultCode = React.createClass({
    getInitialState: function() {
        return {
            configCodeArray: ["// some code ...", "// some other code ..."]
        };
    },
    buildCodeString: function() {
        return "var config = {\n" +
            this.state.configCodeArray
                .map(function(v) {
                    return "\t" + v;
                })
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

let CardBoard = React.createClass({
    allCards: function(option, i) {
        return (
                <Card
                    key={i}
                    configType={option}
                    optionsObject={this.props.optionsObject}
                    inputTypes={this.props.optionsObject[option]} />
            );
    },
    render: function() {
        return (
                <div className='cardWrap'>
                    {this.props.optionsArray.map(this.allCards.bind(this))}
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
    handleUpdate: function() {
        alert('yes');
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