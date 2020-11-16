import React, {Component} from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from './../../components/UI/Modal/Modal';
import OrderSummary from './../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-order';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

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
        ingredients:null,
        totalPrice : 4,
        purchasable:false,
        purchasing:false,
        loading:false,
        error:false
    }

    componentDidMount(){
        axios.get('/ingredients.json')
        .then(response=>{
            this.setState({ingredients:response.data});
        })
        .catch(error => {
            this.setState({error:true});
        });
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
        
        const queryParams = [];
        for(let i in this.state.ingredients){
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        }
        queryParams.push('price=' + this.state.totalPrice);
        const queryString = queryParams.join('&');
        this.props.history.push({
            pathname:'/checkout',
            search:'?' + queryString});
    }
    

    render(){
        const disabledInfo ={...this.state.ingredients}
        for(const key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let burguer = this.state.error ? <p>Ingredients can't be loaded</p>:<Spinner/>;
        let orderSummary = null;
        if(this.state.ingredients){
            burguer = (
                <Aux>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls 
                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved={this.removeIngredientHandler}
                        disabled={disabledInfo}
                        purchasable = {this.state.purchasable}
                        price={this.state.totalPrice}
                        ordered={this.purchaseHandler}/>
                </Aux>
            )
            orderSummary = <OrderSummary 
                                ingredients={this.state.ingredients} 
                                purchaseCancelled={this.purchaseCancelHandler}
                                purchaseContinued={this.purchaseContinueHandler}
                                price={this.state.totalPrice}/>;
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
    
    export default withErrorHandler(BurguerBuilder,axios);