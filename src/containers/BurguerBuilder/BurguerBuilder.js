import React, {Component} from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from './../../components/UI/Modal/Modal';
import OrderSummary from './../../components/Burger/OrderSummary/OrderSummary';

class BurguerBuilder extends Component{
    
    // constructor(props){
    //     super(props);
    //     this.state={...}
    // }
    
    INGREDIENT_PRICES={
        salad:0.5,
        cheese:0.4,
        meat:1.3,
        bacon:0.7
    }
    
    state = {
        ingredients:{
            salad:0,
            bacon:0,
            cheese:0,
            meat:0
        },
        totalPrice : 4,
        purchasable:false,
        purchasing:false
    }
    
    updatePurchaseState(ingredients){
        const sum = Object.keys(this.state.ingredients).map(iKey => ingredients[iKey]).reduce((p,c)=> p + c , 0);
        this.setState({purchasable: sum > 0});
    }
    
    addIngredientHandler = (type) =>{
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {...this.state.ingredients};
        updatedIngredients[type] = updatedCount;
        const newPrice = this.state.totalPrice + this.INGREDIENT_PRICES[type];
        
        this.setState({totalPrice:newPrice, ingredients:updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    }
    
    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if(oldCount > 0){
            const updatedCount = oldCount - 1;
            const updatedIngredients = {...this.state.ingredients};
            updatedIngredients[type] = updatedCount;
            const newPrice = this.state.totalPrice - this.INGREDIENT_PRICES[type];
            
            this.setState({totalPrice:newPrice, ingredients:updatedIngredients});
            this.updatePurchaseState(updatedIngredients);
        }
    }
    
    purchaseHandler =  ()=> {
        this.setState({purchasing:true});
    }


    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () =>{
        alert("Continue");
    }
    
    render(){
        const disabledInfo ={...this.state.ingredients}
        for(const key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
        return(
            <Aux>
                <Modal show={this.state.purchasing} modalClosed = {this.purchaseCancelHandler}>
                    <OrderSummary 
                            ingredients={this.state.ingredients} 
                            purchaseCancelled={this.purchaseCancelHandler}
                            purchaseContinued={this.purchaseContinueHandler}
                            price={this.state.totalPrice}/>
                </Modal>
                <Burger ingredients={this.state.ingredients}/>
                <BuildControls 
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler}
                    disabled={disabledInfo}
                    purchasable = {this.state.purchasable}
                    price={this.state.totalPrice}
                    ordered={this.purchaseHandler}/>
            </Aux>
            );
        }
    }
    
    export default BurguerBuilder;