import * as actionTypes from './actionTypes';
import axios from '../../axios-order';

export const addIngredient = (iName) => {
    return {
        type: actionTypes.ADD_INGREDIENT,
        ingredient: iName
    }
};

export const removeIngredient = (iName) => {
    return {
        type: actionTypes.REMOVE_INGREDIENT,
        ingredient: iName
    }
};


export const setIngredients = (ingredients) => {
    return {
        type:actionTypes.SET_INGREDIENTS,
        ingredients:ingredients
    };
}

export const fetchIngredientsFailed= () =>{
    return{
        type:actionTypes.FETCH_INGREDIENTS_FAIL
    }
}



export const initIngredients = () =>{
    return (dispatch) => {
        axios.get('/ingredients.json')
        .then(response=>{
            dispatch(setIngredients(response.data));
        })
        .catch(error => {
           dispatch(fetchIngredientsFailed())
        });
    };
}
