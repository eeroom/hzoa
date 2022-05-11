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
}