var common = {
    debug: true,

    //显示领奖弹框的时间
    rankStartTime: "2017/09/20",
    rankEndTime: "2017/09/30"
};

(function ($) {
    "use strict";
    var baseUrl = "/repair";
    //var baseUrl = "/bud";

    common.api = {
        tel: "4008215028",
        //appId: "wx75be163cc276438d",      //生产环境
        //appId: "wx89026860051b738e",        //测试号
        appId: "wxd7cb601cef6a5df2",			//小宏科技
        //appId: "wxd7cb601cef6a5df2",			//小宏科技
        startTime: "2017/09/03",
        endTime: "2017/09/08",

        login: baseUrl + "/BudWxController/keyPersonLogin.json",            //登录
        index: baseUrl + "/BudWxController/getUserRankInfoByUserId.json",   //首页
        record: baseUrl + "/BudWxController/getRecordByUserid.json",        //积分记录
        userMes: baseUrl + "/BudWxController/getKeyPersonInfoById.json",    //用户信息
        wx: baseUrl + "/BudWxController/getWXParam.json",                   //微信jsSDK验证
        upload: baseUrl + "/UIController/uploadPic.json",                      //上传图片
        submitSale: baseUrl + "/BudcircleDealerSaleProvePicController/saveSaleProveImage.json",//提交销售凭证
        submitScan: baseUrl + "/BudWxController/keyPersonOperate.json",     //提交扫码
        rule: baseUrl + "/BudWxController/queryPointRulesList.json",        //积分规则

        getPlace: baseUrl + "/transcodeController/transcodeJson.json",      //获取城市列表

        userMesM: baseUrl + "/BudWxController/getBudcircleMPowerById.json", //m1,m2用户信息

        indexM1: baseUrl + "/BudWxController/queryBudcircleM1Rank.json",    //m1首页
        teamM1: baseUrl + "/BudWxController/queryBudcircleM1DealerList.json",//m1旗下团队
        mDetail1: baseUrl + "/BudWxController/queryDealerInfoListByUserid.json",//m1旗下团队详情

        indexM2: baseUrl + "/BudWxController/queryBudcircleM2Rank.json",    //m2首页
        teamM2: baseUrl + "/BudWxController/queryBudcircleM2TeamList.json", //m2旗下团队
        mDetail2: baseUrl + "/BudWxController/getBudcircleM1TeamInfo.json", //m2旗下团队详情

        message: baseUrl + "/BudcircleMessageManageController/queryBudcircleMessageList.json",  //消息列表
        mesRead: baseUrl + "/BudcircleMessageManageController/readBudcircleMessage.json",       //更改消息未读状态

        signiture: baseUrl + "/BudWxController/getShopParam.json",          //获取签名
        shopUrl: "http://store.2016utc.com/LoginMobile/ForwardIndex",       //商城链接
        certify: baseUrl + "/BudcircleDealerSaleProvePicController/queryDealerSaleProvePicHistory.json",

        bindOpenId: baseUrl + "/WXUtilController/redirect/getUserid.do",    //网页授权获取openid
        getMesByOpenId: baseUrl + "/BudWxController/getKeyPesonByOpenId.json",

        checkQixi: baseUrl + "/BudWxController/ifQIXIAct.json",             //判断是否有资格参加七夕活动
        getQixiNum: baseUrl + "/BudcircleQIXIActController/getBudcirclePresentUserrecordByUserid.json",     //查询用户千纸鹤数量
        qixiGoods: baseUrl + "/BudcircleQIXIActController/queryBudcirclePresentInfoByPage.json",            //获取七夕奖品
        qixiSubmitOrder: baseUrl + "/BudcircleQIXIActController/saveBudcirclePresentUserexchange.json",     //提交订单
        qixiOrderDetail: baseUrl + "/BudcircleQIXIActController/getBudcirclePresentUserexchangeById.json",  //订单详情
        qixiRecord: baseUrl + "/BudcircleQIXIActController/queryBudcirclePresentUserexchangeByPage.json",
        qixiToken: baseUrl + "/BudcircleQIXIActController/initToken.json",

        dialMes: baseUrl + "/BudcircleLuckyActController/getLuckyWheelInfo.json",                           //获取商品和抽奖次数
        lottery: baseUrl + "/BudcircleLuckyActController/lotteryDraw.json",                                 //抽奖接口
        dialDetail: baseUrl + "/BudcircleLuckyActController/getBudcircleDrawRecordKeypersonInfo.json",      //奖品详情
        dialAddress: baseUrl + "/BudcircleLuckyActController/supplyKeypersonAddressInfo.json",              //提交地址
        dialRecord: baseUrl + "/BudcircleLuckyActController/queryBudcircleDrawRecordKeypersonInfoByPage.json",

        guoqingAddress: baseUrl + "/BudWxController/supplyRankAddressInfo.json"
    };

    /**
     * @desc 检验用户是否已登录
     */
    common.checkLogin = function (role) {
        common.openid = $.cookie("OPENID");
        common.userid = $.cookie("USER_ID");
        common.role = $.cookie("ROLE");
        common.password = $.cookie("PASSWORD");

        //如果没有openid则跳转到网页授权
        if (!common.openid || common.userid === "") {
            window.location.href = common.api.bindOpenId;
        }

        //用户名不存在
        if (!common.userid || common.userid === "" || role !== common.role) {
            window.location = "../login.html";
        }

        //检验密码是否正确
        $.ajax({
            url: common.api.login,
            dataType: "json",
            data: {
                "budcircleDealerKeyperson.openid": $.cookie("OPENID"),
                "budcircleDealerKeyperson.account": $.cookie("ACCOUNT"),
                "budcircleDealerKeyperson.pwd": $.cookie("PASSWORD")
            },
            success: function (result) {
                var opFlag = result.opflag;
                var loginFlag = result.loginflag;

                if (opFlag === false || loginFlag === "-6" || loginFlag === "2" || loginFlag === "3" || loginFlag === "-1" || loginFlag === "0") {
                    $.cookie("USER_ID", "", {path: "/"});
                    $.cookie("ACCOUNT", "", {path: "/"});
                    $.cookie("ROLE", "", {path: "/"});
                    $.cookie("PASSWORD", "", {path: "/"});

                    window.location = "../login.html";
                }
            }
        })
    };

    /**
     * @func render
     * @desc 页面渲染
     * @param {object} cfg
     * @param {object} cfg.tmpl dotjs的模板对象
     * @param {object} cfg.data 渲染模板所需要数据
     * @param {string} cfg.container 渲染的模板将被插入的容器选择器
     * @param {boolean} cfg.overwrite 是否在末尾添加，默认为否
     * @example
     * common.render(cfg);
     */
    common.render = function (cfg) {
        var overwrite;
        if (cfg.overwrite === false) {
            overwrite = false;
        } else {
            overwrite = true;
        }

        var tmpl = doT.template(cfg.tmpl.text());

        if (tmpl) {
            if (!overwrite) {
                cfg.container.append(tmpl(cfg.data));
            }
            else {
                cfg.container.html(tmpl(cfg.data));
            }
        } else {
            console.log("对应的模块不存在!");
        }
    };

    /**
     * @desc 微信jsSDK验证
     */
    common.wxConfig = function (callback) {
        $.ajax({
            url: common.api.wx + "?url=" + window.location.href,
            dataType: "json",
            success: function (result) {
                wx.config({
                    debug: false,
                    appId: common.api.appId,
                    timestamp: result.timestamp,
                    nonceStr: result.nonce_str,
                    signature: result.signature,
                    jsApiList: [
                        'checkJsApi',
                        'scanQRCode',
                        'openLocation',
                        'getLocation',
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'onMenuShareQQ',
                        'onMenuShareWeibo'
                    ]
                });
            },
            error: function () {
                console.log('Error...');
            }
        });

        wx.ready(function () {
            callback(true);
        });

        wx.error(function () {
            callback(false);
        });
    };

    /**
     * @func GetUrlString
     * @desc 获取url传的值
     * @param {string} name 需要获取的字段名
     */
    common.getUrlString = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var str = window.location.search.substr(1).match(reg);
        if (str) {
            return str[2];
        }
        else {
            return null;
        }
    };

    /**
     * @desc 根据id替换城市
     */
    common.replaceCity = function () {
        var departmentType = $(".departmentType");
        var areaType = $(".areaType");
        var cityType = $(".cityType");

        if (departmentType.length > 0) {
            $.ajax({
                type: "POST",
                dataType: "json",
                url: common.api.getPlace,
                data: "kind=DEPARTMENTTYPE",
                success: function (res) {
                    departmentType.each(function () {
                        var self = $(this);
                        var department = res.codeData.DEPARTMENTTYPE[self.data("id")];

                        self.html(department.split("|")[0]);
                    })
                }
            });
        }

        if (areaType.length > 0) {
            $.ajax({
                type: "POST",
                dataType: "json",
                url: common.api.getPlace,
                data: "kind=AREATYPE",
                success: function (res) {
                    areaType.each(function () {
                        var self = $(this);
                        var area = res.codeData.AREATYPE[self.data("id")];

                        self.html(area.split("|")[0]);
                    })
                }
            });
        }

        if (cityType.length > 0) {
            $.ajax({
                type: "POST",
                dataType: "json",
                url: common.api.getPlace,
                data: "kind=CITYTYPE",
                success: function (res) {
                    cityType.each(function () {
                        var self = $(this);
                        var city = res.codeData.CITYTYPE[self.data("id")];

                        self.html(city.split("|")[0]);
                    })
                }
            });
        }
    };

    /**
     * @desc 获取未读消息的数量
     */
    common.getMesNum = function () {
        $.ajax({
            type: "get",
            url: common.api.message,
            dataType: "json",
            data: {
                "processor.pageSize": 10,
                "processor.pageIndex": 1,
                "budcircleMessageManage.userid": common.userid
            },
            success: function (res) {
                if (res.opflag == false && res.ReLanding == true) {
                    $.cookie("USER_ID", "", {path: "/"});
                    window.location = "../login.html";
                }

                var num = res.data.totalCount;
                $("#mesNum").html(num);
            },
            error: function () {
                console.log("error");
            }
        });
    };

    /**
     * 获取被冻结的分数
     */
    common.getBlockPoint = function (callback) {
        $.ajax({
            url: common.api.userMes,
            dataType: "json",
            data: {
                "keyPersonInfoDTO.userid": common.userid
            },
            success: function (res) {
                if (res.opflag == false && res.ReLanding == true) {
                    $.cookie("USER_ID", "", {path: "/"});
                    window.location = "../login.html";
                }

                callback(res.userinfo.blockedPoints);
            },
            error: function () {
                callback(false);
            }
        });
    };

    common.getUpload = function (callback) {
        $.ajax({
            type: "get",
            url: common.api.certify,
            dataType: "json",
            data: {
                "processor.pageSize": 1,
                "processor.pageIndex": 1,
                "budcircleDealerSaleProve.userid": common.userid
            },
            success: function (res) {
                if (res.opflag == false && res.ReLanding == true) {
                    $.cookie("USER_ID", "", {path: "/"});
                    window.location = "../login.html";
                }

                var lastMes = res.data.records[0];

                if (res.data.records.length === 0) {
                    callback(3);
                    return;
                }

                var lastTime = new Date(lastMes.ctime);
                var curTime = new Date();

                if (lastTime.getFullYear() === curTime.getFullYear() && lastTime.getMonth() === curTime.getMonth() && lastMes.checkStatus === "0") {
                    callback(0);    //本月已上传，审核中（不需要上传）
                } else if (lastTime.getFullYear() === curTime.getFullYear() && lastTime.getMonth() === curTime.getMonth() && lastMes.checkStatus === "1") {
                    callback(1);    //本月已上传，审核通过（不需要上传）
                } else if (lastTime.getFullYear() === curTime.getFullYear() && lastTime.getMonth() === curTime.getMonth() && lastMes.checkStatus === "2") {
                    callback(2);    //本月上传的未通过（需要上传）
                } else {
                    callback(3);    //本月未上传（需要上传）
                }
            },
            error: function () {
                console.log("error");
            }
        });
    };

    /**
     * @desc 检查是否需要上传销量证明
     * @param callback
     */
    common.checkUpload = function (callback) {
        common.getBlockPoint(function (point) {
            if (point && parseInt(point) > 0) {
                $.ajax({
                    type: "get",
                    url: common.api.certify,
                    dataType: "json",
                    data: {
                        "processor.pageSize": 1,
                        "processor.pageIndex": 1,
                        "budcircleDealerSaleProve.userid": common.userid
                    },
                    success: function (res) {
                        if (res.opflag == false && res.ReLanding == true) {
                            $.cookie("USER_ID", "", {path: "/"});
                            window.location = "../login.html";
                        }

                        var lastMes = res.data.records[0];

                        if (res.data.records.length === 0) {
                            callback(3, point);
                            return;
                        }

                        var lTime = lastMes.ctime.split(" ")[0].replace(/-/g, "/");

                        var lastTime = new Date(lTime);
                        var curTime = new Date();

                        if (lastTime.getFullYear() === curTime.getFullYear() && lastTime.getMonth() === curTime.getMonth() && lastMes.checkStatus === "0") {
                            callback(0, point);    //本月已上传，审核中（不需要上传）
                        } else if (lastTime.getFullYear() === curTime.getFullYear() && lastTime.getMonth() === curTime.getMonth() && lastMes.checkStatus === "1") {
                            callback(1, point);    //本月已上传，审核通过（不需要上传）
                        } else if (lastTime.getFullYear() === curTime.getFullYear() && lastTime.getMonth() === curTime.getMonth() && lastMes.checkStatus === "2") {
                            callback(2, point);    //本月上传的未通过（需要上传）
                        } else {
                            callback(3, point);    //本月未上传（需要上传）
                        }
                    },
                    error: function () {
                        console.log("err");
                    }
                });
            } else {
                callback(false);
            }
        });
    };

    common.addTip = function (callback) {
        common.checkUpload(function (state, point) {
            if (state > 0) {
                callback('<div id="notice"><a href="upload.html"><p>您有' + point + '积分被冻结，请上传销量证明</p></a></div>');
            }
        });
    };

    common.qixiDialogEvent = function () {
        $(".qixiDialog").find(".cancelBtn,.closeQixi").on("click", function () {
            $(".qixiDialog").hide();
        });
    };

    $(document).ready(function () {
        common.qixiDialogEvent();
    });
})(jQuery);