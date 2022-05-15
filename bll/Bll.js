import axios from 'axios'

export default class Bll{
    constructor(ns){
        this.namespace=ns;
    }

    dispatch(parameter){
        return Bll.dispatch(parameter);
    }

    getStore(){
        return Bll.getStore();
    }

    getState(){
        return this.getStore()[this.namespace]||{};
    }

    setState(data){
        console.log("data",data)
        this.dispatch({type:"hz",namespace:this.namespace,data});
    }
    async post(url,parameter){
        url="http://localhost:8126/"+url;
        let {data}=await axios.post(url,parameter);
        return data
    }
}