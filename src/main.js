import Vue from "vue";
import $ from 'jquery';
import MintUI from "mint-ui";
import "mint-ui/lib/style.css";
import axios from "axios";
import api from "./common/js/api";
import qs from "qs";
import router from "./router/router";
import store from "./store/store";
import app from "./app.vue";
import vHeader from "./components/header/header.vue";


Vue.use(MintUI);

Vue.component("v-header", vHeader);

//配置全局属性
Vue.prototype.$axios = axios;
Vue.prototype.$api = api;
Vue.prototype.$qs = qs;
//axios过滤器
axios.interceptors.response.use(function (res) {
    return res;    
}, function (err) {
    MintUI.Indicator.close();
    MintUI.Toast({message: "网络原因操作失败"});
    return Promise.reject(err);
});

new Vue({
    el: "#app",
    router,
    store,
    template: "<app/>",
    components: {
        app
    }
});