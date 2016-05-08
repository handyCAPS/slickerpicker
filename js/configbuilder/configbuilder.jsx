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
            configCodeOpen: "var config = {",
            configCodeArray: ["// some code ...", "// some toher code ..."],
            configCodeClose: "};"
        };
    },
    render: function() {
        return (
                <div className='large-12 columns'>
                    <pre className='codepen language-javascript'>
                        {this.state.configCodeOpen}<br />
                        {this.state.configCodeArray
                            .map(function(v) {
                                return "\t" + v;
                            })
                            .join('\n')}<br />
                        {this.state.configCodeClose}
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