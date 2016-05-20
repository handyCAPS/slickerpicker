const React = require('react');

let ResultCode = React.createClass({
    render: function() {
        return (
                <section className='codepen'>
                    <h3>Your config code:</h3>
                    <pre id='resultcode' className='language-javascript'>
                        <code className='javascript language-javascript'>
                            {this.props.codeString}
                        </code>
                    </pre>
                </section>
            );
    }
});

export default ResultCode;