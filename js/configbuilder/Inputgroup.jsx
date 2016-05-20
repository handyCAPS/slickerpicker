const React = require('react');

import Events from './Events';

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
                        onChange={onChangeCb}
                        className='input-group__input'
                        name={inputName} />);

        if (this.props.textArea === true) {
            inputEl = (
                    <textarea
                        className='input-group__input input-group__input--textarea'
                        rows='3'
                        onChange={onChangeCb}
                        defaultValue={this.state.areaFunction}
                        name={inputName} />

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

export default InputGroup;