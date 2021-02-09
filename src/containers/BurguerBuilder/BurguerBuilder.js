import React, {Component} from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from './../../components/UI/Modal/Modal';
import OrderSummary from './../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-order';

import {connect} from 'react-redux';
import * as actions from '../../store/actions';

class BurguerBuilder extends Component{
    
    state = {
        purchasing:false
    }

    componentDidMount(){
       this.props.onInitIngredients();
    }
    
    updatePurchaseState(ingredients){
        const sum = Object.keys(ingredients).map(iKey => ingredients[iKey]).reduce((p,c)=> p + c , 0);
        return sum > 0;
    }
    
    purchaseHandler =  () => {
        if(this.props.isAuthenticated){
            this.setState({purchasing:true});
        }else{
            this.props.onSetAuthRedirectPath('/checkout');
            this.props.history.push('/auth');
        };
    }


    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () =>{
        this.props.onInitPurchase();
        this.props.history.push('/checkout');
    //     const queryParams = [];
    //     for(let i in this.state.ingredients){
    //         queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
    //     }
    //     queryParams.push('price=' + this.state.totalPrice);
    //     const queryString = queryParams.join('&');
    //     this.props.history.push({
    //         pathname:'/checkout',
    //         search:'?' + queryString});
    }
    

    render(){
        const disabledInfo ={...this.props.ings}
        for(const key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let burguer = this.props.error ? <p>Ingredients can't be loaded</p>:<Spinner/>;
        let orderSummary = null;
        if(this.props.ings){
            burguer = (
                <Aux>
                    <Burger ingredients={this.props.ings}/>
                    <BuildControls 
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        purchasable = {this.updatePurchaseState(this.props.ings)}
                        price={this.props.totalPrice}
                        isAuth = {this.props.isAuthenticated}
                        ordered={this.purchaseHandler}/>
                </Aux>
            )
            orderSummary = <OrderSummary 
                                ingredients={this.props.ings} 
                                purchaseCancelled={this.purchaseCancelHandler}
                                purchaseContinued={this.purchaseContinueHandler}
                                price={this.props.totalPrice}/>;
        }
        
        return(
            <Aux>
                <Modal show={this.state.purchasing} modalClosed = {this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
               {burguer}
            </Aux>
            );
        }
    }
    

const mapStateToProps= state =>{
    return {
        ings: state.burguerBuilder.ingredients,
        totalPrice: state.burguerBuilder.totalPrice,
        error: state.burguerBuilder.error,
        isAuthenticated: state.auth.token != null
    }
}    
const mapDispatchToProps= dispatch => {
    return {
        onIngredientAdded: (ing) => dispatch(actions.addIngredient(ing)),
        onIngredientRemoved: (ing) => dispatch(actions.removeIngredient(ing)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
}



export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(BurguerBuilder,axios));