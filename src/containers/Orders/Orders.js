import React ,{Component} from 'react';
import Order from '../../components/Order/Order';
import axios from '../../axios-order';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import {connect} from 'react-redux';
import Spinner from  '../../components/UI/Spinner/Spinner';

class Orders extends Component {

    

    componentDidMount(){
        this.props.onFetchOrders(this.props.authToken,this.props.userId);
    }

    render(){
        let orders = <Spinner/>;
        if(!this.props.loading){
            orders = this.props.orders.map(order => (
                    <Order 
                        key = {order.id} 
                        ingredients = {order.ingredients}
                        price = {order.price}
                        />
                ));
        }
        return(
            <div>
                {orders}
            </div>
        );
    }
}


const mapDispatchToProps = dispatch => {
    return { 
        onFetchOrders: (authToken,uid) => dispatch(actions.fetchOrders(authToken,uid))
    };
}

const mapStateToProps = state => {
    return {
        orders: state.order.orders,
        loading: state.order.loading,
        authToken: state.auth.token,
        userId: state.auth.userId
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(Orders,axios));