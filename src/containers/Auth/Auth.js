import React, {Component} from 'react';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.module.css';
import * as actions from '../../store/actions/index';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';


class Auth extends Component {

    state = {
        controls:{
             email:{
                    elementType: 'input',
                    elementConfig: {
                        type: 'email',
                        placeholder: 'Email address'
                    },
                    value:'',
                    validation:{
                        required:true,
                        isEmail:true
                    },
                    touched:false,
                    valid:false
                },
             password:{
                    elementType: 'input',
                    elementConfig: {
                        type: 'password',
                        placeholder: 'Password'
                    },
                    value:'',
                    validation:{
                        required:true,
                        minLenght:6
                    },
                    touched:false,
                    valid:false
                }
        },
        isSignUp:true
    }

    componentDidMount(){
        if(!this.props.buildingBurguer && this.props.authRedirectPath !== '/'){
            this.props.onSetAuthRedirectPath();
        }
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

    inputChangeHandler = (event,controlName) =>{
        const updatedControls = {
            ...this.state.controls,
            [controlName]:{
                ...this.state.controls[controlName],
                value: event.target.value,
                valid : this.validate(event.target.value,this.state.controls[controlName].validation),
                touched:true
            }
        }
        this.setState({controls:updatedControls});
    };

    formElements(){
        var elements = [];
        for(let key in this.state.controls){
           elements.push({
               id: key,
               config: this.state.controls[key]
           })     
        }
        
        return elements;
    }

    submitHandler = (event) => {
        event.preventDefault();
        this.props.onAuth(this.state.controls.email.value,this.state.controls.password.value,this.state.isSignUp);
    }

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return {
                isSignUp: !prevState.isSignUp
            };
        });
    };

    render(){
        const elements = this.formElements();
        let form = elements.map(formElement => (
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
            
        ))
        if(this.props.loading){
            form = <Spinner/>
        }
        let errorMessage = null;
        if(this.props.error){
            errorMessage = (
                <p>{this.props.error.message}</p>
            )
        }

        let authRedirect = null;

        if(this.props.isAuthenticated){
            authRedirect = <Redirect to={this.props.authRedirectPath}/>
        }

        return(
            <div className={classes.Auth}>
                {authRedirect}
                {errorMessage}
                <form onSubmit={this.submitHandler}>
                    {form}
                    <Button buttonType="Success"> SUBMIT </Button>
                </form>
                <Button 
                    click={this.switchAuthModeHandler}
                    buttonType="Danger"> 
                        SWITCH TO {this.state.isSignUp?'SIGNIN':'SIGNUP'}</Button>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch =>{
    return {
        onAuth: (email,password,isSignUp) => dispatch(actions.auth(email,password,isSignUp)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    };
};

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error:  state.auth.error,
        isAuthenticated: state.auth.token !== null,
        buildingBurguer: state.burguerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    };
};


export default connect(mapStateToProps,mapDispatchToProps)(Auth);