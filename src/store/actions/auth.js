import * as actionTypes from './actionTypes';
import axios from 'axios';


export const authStart = () => {

    return{
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (userId,token) => {
    return{
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId
    };
};

export const authFail = (error) => {
    return {
        type:actionTypes.AUTH_FAIL,
        error:error
    };
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    return {
        type:actionTypes.AUTH_LOGOUT
    };
};

export const checkAuthTimeout = (expirationTime)=>{
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        },expirationTime * 1000);
    }
}

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    };
};


export const auth = (email,pass,isSignUp)=>{
    return dispatch => {
        dispatch(authStart());
        const authData ={
            email: email,
            password: pass,
            returnSecureToken:true
        };
        let url='https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword';
        if(isSignUp){
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp';
        }
        axios.post(url + '?key=AIzaSyAhRuXkb83n_o9ciqWXBPSjeoxFP0SWj64',authData)
            .then( resp => {
                const expirationDate = new Date(new Date().getTime() + resp.data.expiresIn * 1000);
                localStorage.setItem('token',resp.data.idToken);
                localStorage.setItem('userId',resp.data.localId);
                localStorage.setItem('expirationDate',expirationDate);
                dispatch(authSuccess(resp.data.localId,resp.data.idToken));
                dispatch(checkAuthTimeout(resp.data.expiresIn));
            })
            .catch(err => {
                console.log(err);
                dispatch(authFail(err.response.data.error));
            })
    };
};

export const authCheckState = () => {
    return dispatch => {
        const token  = localStorage.getItem('token');
        if(!token){
            dispatch(logout());
        }else{
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if(expirationDate <= new Date()){
                dispatch(logout());
            }else{
                const userId = localStorage.getItem('userId');
                dispatch(authSuccess(userId,token));
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime())/1000));
            }
        }
    }
}