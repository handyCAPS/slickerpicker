
import configOptions from './configoptions';


var Card = React.createClass({
    render: function() {
        var headerStyle = {
            textTransform: 'capitalize'
        };
        return (
                <div className='large-6 columns'>
                    <h2 style={headerStyle}>{this.props.configType}</h2>
                </div>
            );
    }
});

var ResultCode = React.createClass({
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
                <div className='large-12 columns'>
                    <pre className='codepen language-javascript'>
                    <code className='javascript language-javascript'>
                        {this.buildCodeString()}
                    </code>
                    </pre>
                </div>
            );
    }
});

ReactDOM.render(<div>
            <Card configType='classes'></Card>
            <ResultCode />
            </div>
            , document.getElementById('reactContainer'));