const React = require('react');

import InputGroup from './Inputgroup';

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

export default Card;