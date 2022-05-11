import React from 'react'
import ReactDOM from 'react-dom'
import { legacy_createStore as createStore } from 'redux';
import { Provider } from 'react-redux'
import Bll from './bll/Bll';
import { Route, HashRouter, Redirect,Switch,BrowserRouter } from 'react-router-dom';
import HomeIndex from './view/home/index'
import Login from './view/account/login'
import constdict from './utils/constdict'
import docCookies from './utils/docCookies'
import axios from 'axios'

axios.interceptors.request.use(cfg=>{
  let token= docCookies.getItem(constdict.authentication);
  if(token){
    cfg.headers['authorization']=token
  }
  return cfg;
})

axios.interceptors.response.use(res=>{
  let {status,data={}}=res;
  let {code}=data;
  if(status==401 || code==401){
    docCookies.removeItem(constdict.authentication,"/")
    document.location.href="/account/login"
  }

  let token=res.headers['authorization']
  if(token){
    docCookies.setItem(constdict.authentication,token,Infinity,"/")
  }
  return res
})

let store = createStore((state, action) => {
  // console.log("state", state);
  // console.log("action", action);
  if (action.namespace) {
    return { ...state, [action.namespace]: { ...state[action.namespace], ...action.data } };
  }
  return state;
}, {});

Bll.dispatch = store.dispatch;
Bll.getStore = store.getState;

let lstViewPage = require.context("./view", true, /\.js$/);
console.log("lstViewPage", lstViewPage)
let lstViewComponent = lstViewPage.keys().map(key => ({
  path: key.toLowerCase()
  , component: lstViewPage(key).default
}));
console.log("lstViewComponent", lstViewComponent)

let lstIconsTmp=require.context('./assets/icons',true,/\.svg$/);
let lstIcons= lstIconsTmp.keys().map(key=>lstIconsTmp(key));
window.lstIcons=lstIcons;

let View404 = () => {
  return (<div>页面跑了( ▼-▼ )</div>);
}

let ViewForbid = () => {
  return (<div>没有访问权限( ▼-▼ )</div>);
}

//认证
const authenrization=({pathname})=>{
  return !!docCookies.getItem(constdict.authentication);
}

//授权
const authorization=({pathname})=>{
  return true;
}

const ViewMatch = (props) => {
  const {location,view}=props;
  const { pathname, search } = location;
  if (!authenrization(pathname)) {
    let returnurl = "?returnurl=" + encodeURIComponent(pathname + search);
    return (<Redirect to={{ pathname: "/account/login", search: returnurl }}></Redirect>);
  }
  if(!authorization({pathname})){
    return <ViewForbid {...props}></ViewForbid>
  }
  let View=view;
  if(!!View)
      return <View {...props} />;
  let url=pathname.toLowerCase()+'.js';
  View = (lstViewComponent.find(x => x.path.indexOf(url) >= 0) || {}).component;
  if(!View)
    return <View404 {...props} />;
  return <View {...props} />;
}

ReactDOM.render(<Provider store={store}>
  <BrowserRouter>
    <Switch>
      <Route exact path="/account/login" component={Login}></Route>
      <Route exact path="/" render={x => (<ViewMatch view={HomeIndex} {...x} />)} ></Route>
      <Route component={ViewMatch} ></Route>
    </Switch>
  </BrowserRouter>
</Provider>, document.getElementById("root"))