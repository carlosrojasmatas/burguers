import React from 'react';
import burguerLogo from '../../assets/images/burger-logo.png';
import classes from './Logo.module.css';

const logo = (props) => (
    <div className={classes.Logo} style={{height: props.height}}>
        <img src={burguerLogo} alt='MyBurguer'/>
    </div>
)

export default logo; 