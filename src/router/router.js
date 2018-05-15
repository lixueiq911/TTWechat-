import Vue from "vue";
import Router from "vue-router";

import vCheck from "../pages/check/check.vue";
import vShortcut from "../pages/shortcut/shortcut.vue";
import vLogin from "../pages/login/login.vue";
import vSaleLogin from "../pages/login/saleLogin.vue";
import vMain from "../pages/main/main.vue";
import vIndex from "../pages/index/index.vue";
import vTask from "../pages/task/task.vue";
import vTaskTodo from "../pages/task/taskTodo.vue";
import vTaskDone from "../pages/task/taskDone.vue";
import vTaskRedo from "../pages/task/taskRedo.vue";
import vTrain from "../pages/train/train.vue";
import vUserCenter from "../pages/user/userCenter.vue";
import vUserMes from "../pages/user/userMes.vue";
import vMessage from "../pages/message/message.vue";
import vRule from "../pages/rule/rule.vue";
import vRecord from "../pages/record/record.vue";
import vPassword from "../pages/password/password.vue";
import vWxsao from "../pages/wxsao/wxsao.vue";
import vWxcord from "../pages/wxsao/wxcord.vue";
import vWxSuccess from "../pages/wxsao/Success.vue";
import vWxSuccess2 from "../pages/wxsao/Success2.vue";
import vUpload from "../pages/wxsao/upload.vue";
import vUploadDown from "../pages/wxsao/uploadDown.vue";

import vPointM1 from "../pages/point/M1/pointM1.vue";
import vPointM2 from "../pages/point/M2/pointM2.vue";
import vIntegralM2 from "../pages/point/M2/integralM2.vue";
import vPointSaleM2 from "../pages/point/M2/pointSaleM2.vue";
import vPointM3 from "../pages/point/M3/pointM3.vue";
import vPointM3M2 from "../pages/point/M3/pointM3M2.vue";
import vPointM3M1 from "../pages/point/M3/pointM3M1.vue";
import vPointSaleM3 from "../pages/point/M3/pointSaleM3.vue";

import {Indicator} from 'mint-ui';

Vue.use(Router);

let router = new Router({
    routes: [
        //userType user普通用户 manager管理员
        {path: "/checkUser/:userType", component: vCheck},
        {path: "/check/:userType/:openId", component: vCheck},
        {path: "/shortcut/:userType/:openId/:page", component: vShortcut},
        {path: "/login", component: vLogin},
        {path: "/saleLogin", component: vSaleLogin},
        {
            path: "/",
            component: vMain,
            children: [
                {path: "index", component: vIndex},
                {path: "task", component: vTask},
                {path: "train", component: vTrain}
            ]
        },
        {path: "/task/todo/:taskId", component: vTaskTodo},
        {path: "/task/done/:taskId", component: vTaskDone},
        {path: "/task/redo/:taskId", component: vTaskRedo},
        {path: "/userCenter", component: vUserCenter},
        {path: "/userMes", component: vUserMes},
        {path: "/message", component: vMessage},
        {path: "/rule", component: vRule},
        {path: "/record", component: vRecord},
        {path: "/password", component: vPassword},
        {path: "/pointM1", component: vPointM1},
        {path: "/pointM2", component: vPointM2},
        {path: "/pointM3", component: vPointM3},
        {path: "/integralM2", component: vIntegralM2},
        {path: "/saleM2", component: vPointSaleM2},
        {path: "/saleM3M2", component: vPointM3M2},
        {path: "/saleM3M1", component: vPointM3M1},
        {path: "/saleM3", component: vPointSaleM3},
        {path: "/wxsao", component: vWxsao},
        {path: "/wxcord", component: vWxcord},
        {path: "/success",name: 'success', component: vWxSuccess},
        {path: "/success2", component: vWxSuccess2},
        {path: "/upload", component: vUpload},
        {path: "/uploadDown", component: vUploadDown}  
    ]
});

//监听路由，跳转时打开loading
router.afterEach(() => {
    Indicator.open();
});

export default router;