
import configOptions from './configoptions';


let InputGroup = React.createClass({
    getInitialState: function() {
        return {
            areaFunction: "function() {\n    \n}"
        };
    },
    update: function(event) {
        this.setState({
            areaFunction: event.target.value
        });
        CardBoard.props.onChange().bind(null, 'testing');
    },
    render: function() {
        let inputName = this.props.inputname;
        let inputEl = (<input onChange={this.update} className='input-group__input' name={inputName} />);
        if (this.props.textArea === true) {
            inputEl = (
                    <textarea onChange={this.update} className='input-group__input input-group__input--textarea' name={inputName} >
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
                    {inputArr.map(function(type) {
                        let textArea = typeof this.props.inputTypes[type] === 'function';
                        return (<InputGroup inputname={type} textArea={textArea} />);
                    }.bind(this))}
                </div>
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
    handleChange: function() {
        console.log("changing cardboard now", arguments);
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
            configCodeArray: ["// some code ...", "// some other code ..."]
        };
    },
    buildCodeString: function() {
        return "var config = {\n" +
            this.state.configCodeArray
                .map(function(v) {
                    return "    " + v;
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

    },
    render: function() {
        return (
                <div  onChange={this.handleUpdate}>
                    <CardBoard
                        optionsArray={this.state.optionsArray}
                        optionsObject={this.state.optionsObject} />
                    <ResultCode />
                </div>
            );
    }
});

ReactDOM.render(<Parent />, document.getElementById('reactContainer'));