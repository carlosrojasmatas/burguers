import React from 'react';
import classes from './Burger.module.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient'
import { array } from 'prop-types';

const burger = (props) => {
    let mapIngredientTag = (i) => {
        return (k) => <BurgerIngredient key = {k + i} type ={k}></BurgerIngredient>
    };

    let mapKeyToIng = (k) => [...Array(props.ingredients[k])].map((_,i) => mapIngredientTag(i)(k));

    var transfIngredients = Object
                    .keys(props.ingredients)
                    .map(mapKeyToIng)
                    .reduce((prev,curr)=> {
                        return prev.concat(curr);
                    },[]);

    
    if(transfIngredients.length === 0 ){
        transfIngredients = <p>Please add ingredients</p>
    }
    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top"></BurgerIngredient>
            {transfIngredients}
            <BurgerIngredient type="bread-bottom"></BurgerIngredient>
        </div>
    );
};

export default burger;