import React from "react";
import Burguer from '../../Burger/Burger';
import Button from '../../UI/Button/Button';
import classes from './CheckoutSummary.module.css';

const checkoutSummary = (props) => {

    return(
        <div className={classes.CheckoutSummary}>
            <h1>We hope it taste well</h1>
            <div style={{width: '100%', margin:'auto'}}>
                <Burguer ingredients={props.ingredients}/>
            </div>
            <Button 
                buttonType="Danger"
                click={props.checkoutCancelled}>CANCEL</Button>
            <Button    
                buttonType="Success"
                click={props.checkoutContinued}>CONTINUE</Button>
        </div>
    )

}

export default checkoutSummary;
