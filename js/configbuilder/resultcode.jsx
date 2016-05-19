let ResultCode = React.createClass({
    getConfigCodeArray: function() {
        let confOb = this.props.configCodeObject;
    },
    getInitialState: function() {
        return {
            configCodeArray: [{classes: {base: 'base', some: 'text'}}, {onInit: 'function() {}'}]
        };
    },
    buildCodeString: function() {
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
            this.state.configCodeArray
                .map(mapCodeArray)
                .join(',\n') +
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

export default ResultCode;