import React, {Component} from 'react';

import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
import axios from '../../../axios-order';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import {connect} from 'react-redux';

class ContactData extends Component {
state = {
        orderForm:{
                name:{
                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'your name'
                    },
                    value:'',
                    validation:{
                        required:true,
                        minLenght: 5
                    },
                    touched:false,
                    valid:false
                },
                street:{
                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'your address'
                    },
                    value:'',
                    validation:{
                        required:true,
                        minLenght: 5
                    },
                    valid:false,
                    touched:false,
                },
                zipCode:{
                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'ZIP code'
                    },
                    value:'',
                    validation:{
                        required:true,
                        minLenght: 3,
                        maxLength: 5,
                        isNumeric:true
                    },
                    valid:false,
                    touched:false,
                },
                email: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'email',
                        placeholder: 'your email'
                    },
                    value:'',
                    validation:{
                        required:true,
                        isEmail:true
                    },
                    valid:false,
                    touched:false                },
                deliveryMethod:{
                    elementType: 'select',
                    elementConfig: {
                        options:[
                            {value: 'fastest',displayValue:'Fatest'},
                            {value: 'chepeast',displayValue:'Chepeast'},
                        ]
                    },
                    value:'fastest',
                    validation:{},
                    touched:false,
                    valid:true
                }
        },
        loading:false,
        isValid:false
    }

    validate(value,rules){
        let isValid = true;
        
        if(rules.required){
            isValid = value.trim() !==  '' && isValid;
        }

        if(rules.minLenght){
            isValid = value.length >= rules.minLenght && isValid;
        }

        if(rules.maxLength){
            isValid = value.length <= rules.maxLength && isValid;
        }

        if (rules.isEmail) {
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            isValid = pattern.test(value) && isValid
        }

        if (rules.isNumeric) {
            const pattern = /^\d+$/;
            isValid = pattern.test(value) && isValid
        }

        return isValid;
    }

    orderHandler= (event) => {
        
        event.preventDefault();
        this.setState({loading:true});
        const formData = {};
        for(let elId in this.state.orderForm){
            formData[elId] = this.state.orderForm[elId].value;
        }

        const order = {
            ingredients: this.props.ings,
            price: Number.parseFloat(this.props.totalPrice).toFixed(2),
            orderData: formData
        }

        axios.post('/orders.json',order)
            .then(response => {
                this.setState({loading:false});
                this.props.history.push("/");
            })
            .catch(error => this.setState({loading:false}));
    }

    formElements(){
        var elements = [];
        for(let key in this.state.orderForm){
           elements.push({
               id: key,
               config: this.state.orderForm[key]
           })     
        }
        
        return elements;
    }

    inputChangeHandler= (event,inputIdentifier) => {
        const updatedOrderForm={
            ...this.state.orderForm
        };

        const updatedFormElement = {...updatedOrderForm[inputIdentifier]};
        updatedFormElement.value = event.target.value;
        updatedFormElement.touched=true;
        updatedFormElement.valid = this.validate(updatedFormElement.value,updatedFormElement.validation);
        updatedOrderForm[inputIdentifier] = updatedFormElement;

        let isValidForm = true;
        for(let inputElement in updatedOrderForm){
            isValidForm = updatedOrderForm[inputElement].valid && isValidForm;
        }
        console.log("form: " + isValidForm);
        this.setState({orderForm:updatedOrderForm, isValid:isValidForm});

    }

    render(){
        var formConfig = this.formElements();

        let form=(<form onSubmit={this.orderHandler}>

            {formConfig.map(formElement => {
                return(
                    <Input 
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        isValid={formElement.config.valid}
                        shouldValidate={formElement.config.validation.required}
                        touched={formElement.config.touched}
                        changed={(event) => this.inputChangeHandler(event,formElement.id)}
                    />
            )})}
            <Button buttonType='Success' disabled={!this.state.isValid}>ORDER</Button>
        </form>);
        
        if(this.state.loading){
            form=(<Spinner/>);
        }

        return (
            <div className={classes.ContactData}>
                <h4>Enter your contact data</h4>
                {form}
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        totalPrice: state.totalPrice
    }
}

export default connect(mapStateToProps)(ContactData);