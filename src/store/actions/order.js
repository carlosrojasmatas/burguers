import * as actionTypes from './actionTypes';
import axios from '../../axios-order';

export const purchaseBurguerSuccess = (id,orderData) => {
    return {
        type:actionTypes.PURCHASE_BURGUER_SUCCESS,
        orderId: id,
        orderData: orderData
    }
};

export const purchaseBurguerFail = (error) => {
    return {
        type:actionTypes.PURCHASE_BURGUER_FAIL,
        error:error
    }
}

export const purchaseBurguerStart = () => {
    return {
        type: actionTypes.PURCHASE_BURGUER_START
    };
};

export const purchaseBurguer = (orderData,token) => {

    return dispatch => {
        dispatch(purchaseBurguerStart());
        axios.post('/orders.json?auth=' + token,orderData)
        .then(response => {
            dispatch(purchaseBurguerSuccess(response.data.name,orderData));
        })
        .catch(error => {
                console.error("order failed: " + error);
                dispatch(purchaseBurguerFail(error))
        }); 
    };
}

export const purchaseInit = () => {
    return {
        type: actionTypes.PURCHASE_INIT
    };
}

export const fetchOrdersSuccess=(orders) => {
    console.log("orders success");
    return{
        type:actionTypes.FETCH_ORDERS_SUCCESS,
        orders:orders
    };
};

export const fetchOrdersFail=(error) => {
    console.log(error);
    return{
        type:actionTypes.FETCH_ORDERS_FAIL,
        error:error
    };
};

export const fetchOrdersStart= () => {
    console.log("orders start");
    return {
        type:actionTypes.FETCH_ORDERS_START
    };
};

export const fetchOrders = (authToken,userId) => {
    return dispatch => {
        dispatch(fetchOrdersStart());
        const q = '?auth=' + authToken + '&orderBy="userId"&equalTo="' + userId + '"';
        axios.get('/orders.json' + q)
            .then(res => {
                const fetchedOrders = [];
                for(let key in res.data){
                    fetchedOrders.push({...res.data[key],
                                    id:key
                                });
                }
                dispatch(fetchOrdersSuccess(fetchedOrders));
            })
            .catch(err => {
                dispatch(fetchOrdersFail(err));
            })
    }
}