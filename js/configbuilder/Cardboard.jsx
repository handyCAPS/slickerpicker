const React = require('react');

import Card from './Card';

let CardBoard = React.createClass({
    allCards: function(option, i) {
        return (
                <Card
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

export default CardBoard;