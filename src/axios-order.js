import axios from 'axios';

const instance = axios.create({
    baseURL:"https://react-my-burguer-20522.firebaseio.com/",

});

export default instance;

