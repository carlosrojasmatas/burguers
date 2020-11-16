import React from 'react';
import classes from './Input.module.css';

const input = (props) => {
    let inputElement =  null;
    const inputClasses = [classes.InputElement];

    if(!props.isValid && props.shouldValidate && props.touched){
        inputClasses.push(classes.Invalid);
    }

    switch (props.elementType){
        case('input'):
            inputElement = <input 
                        {...props.elementConfig} 
                        className={inputClasses.join(" ")} 
                        onChange={props.changed}
                        value={props.value}/>;
            break;
        case('textarea'):
            inputElement = <textarea 
                            {...props.elementConfig} 
                            className={inputClasses.join(" ")} 
                            onChange={props.changed}
                            value={props.value}/>;
            break;
        case('select'):
            inputElement = 
                            <select 
                                className={inputClasses.join(" ")} 
                                onChange={props.changed}
                                value={props.value}>
                                    {props.elementConfig.options.map(opt => (<option key={opt.value} value={opt.value}>{opt.displayValue}</option>))}
                            </select>;
            break;
        default:
            inputElement=<input 
                        {...props.elementConfig} 
                        className={inputClasses.join(" ")} 
                        onChange={props.changed}
                        value={props.value}/>;
    }

    let validationError = null;
    if (!props.isValid && props.touched) {
        validationError = <p>Please enter a valid value!</p>;
    }
    return(
        <div className={classes.Input}>
            <label className={classes.Label}>{props.label}</label>
            {inputElement}
            {validationError}
        </div>);
}
    

export default input;