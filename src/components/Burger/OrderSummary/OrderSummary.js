import React from 'react';
import Aux from '../../../hoc/Aux/Aux';
import Button from '../../UI/Button/Button';

const orderSummary = (props) => {

    const ingredients = Object.keys(props.ingredients).map(key => 
                        <li key={key}>
                            <span style={{textTransform:'capitalize'}}>{key}</span> {props.ingredients[key]}
                        </li>);
    return(
        <Aux>
            <h3>Your order</h3>
            <p>Burguer with the following ingredients:</p>
            <ul>
                {ingredients}
            </ul>
    <p><strong>Total price:</strong>{props.price.toFixed(2)}</p>
            <p>Continue to checkout?</p>
            <Button buttonType="Success" click={props.purchaseContinued}>Continue</Button>
            <Button buttonType="Danger" click={props.purchaseCancelled}>Cancel</Button>
        </Aux>
    )

}

export default orderSummary;