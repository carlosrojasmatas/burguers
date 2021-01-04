import React, {Component} from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from './../../components/UI/Modal/Modal';
import OrderSummary from './../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-order';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import {connect} from 'react-redux';
import * as actionTypes from '../../store/actions';

class BurguerBuilder extends Component{
    
    // constructor(props){
    //     super(props);
    //     this.state={...}
    // }
    
    
    state = {
        purchasing:false,
        loading:false,
        error:false
    }

    componentDidMount(){
        // axios.get('/ingredients.json')
        // .then(response=>{
        //     this.setState({ingredients:response.data});
        // })
        // .catch(error => {
        //     this.setState({error:true});
        // });
    }
    
    updatePurchaseState(ingredients){
        const sum = Object.keys(ingredients).map(iKey => ingredients[iKey]).reduce((p,c)=> p + c , 0);
        return sum > 0;
    }
    
    purchaseHandler =  ()=> {
        this.setState({purchasing:true});
    }


    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () =>{
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

        let burguer = this.state.error ? <p>Ingredients can't be loaded</p>:<Spinner/>;
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
                        ordered={this.purchaseHandler}/>
                </Aux>
            )
            orderSummary = <OrderSummary 
                                ingredients={this.props.ings} 
                                purchaseCancelled={this.purchaseCancelHandler}
                                purchaseContinued={this.purchaseContinueHandler}
                                price={this.props.totalPrice}/>;
        }
        
        if(this.state.loading){
            orderSummary = <Spinner/>
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
        ings: state.ingredients,
        totalPrice: state.totalPrice
    }
}    
const mapDispatchToProps= dispatch => {
    return {
        onIngredientAdded: (ing) => dispatch({type:actionTypes.ADD_INGREDIENT,ingredient:ing}),
        onIngredientRemoved: (ing) => dispatch({type:actionTypes.REMOVE_INGREDIENT,ingredient:ing})
    }
}



export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(BurguerBuilder,axios));