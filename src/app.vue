<template>
    <router-view></router-view>
</template>

<script>
    import store from "store";
    import {mapMutations} from "vuex";
    let geocoder;

    export default {
        name: "app",

        data(){
            return {
                openId: this.$route.params.openId,
                userType: this.$route.params.userType,
                location: {
                    latitude: "",
                    longitude: "",
                    address: ""
                }
            }
        },

        methods: {
            ...mapMutations(["initUser", "initLocation"]),

            //获取openId
            getOpenId(){
                let self = this;				
                if (self.userType) {
                    store.set("userType", self.userType);
                    store.remove("openId");
                }

                if (self.openId) {
                    store.remove("openId");
                    store.set("openId", self.openId);
                } else if (store.get("openId")) {
                    self.openId = store.get("openId");
                } else {
                    window.location.href = self.$api.getOpenId + "?redUrl=" + window.location.href.split("#")[0] + "&userType=" + store.get("userType");
                    return;
                }

                self.checks();
                self.wxConfig();
            },
            //检验是否绑定openId
            checks(){
                let self = this;
                let openId = self.openId;
                //url和store没有openId，跳转到获取openId接口
                if (!openId) {
                    return;
                }

                let postData = self.$qs.stringify({
                    "openId": openId
                });

                self.$axios.post(self.$api.checkOpenId, postData).then(res => {
                    if (res.data.opflag) {
                        self.initUser(res.data.data);
                    }

                    //返回false为未绑定
                    else {
                        if (self.userType === "user") {
                            self.$router.push("/login");
                        } else if (self.userType === "manager") {
                            self.$router.push("/saleLogin");
                        }
                    }
                }).catch(() => {

                })
            },

            //jssdk验证
            wxConfig(){
                let self = this;

                let url = self.$api.wx + "?url=" + window.location.href;

                self.$axios.get(url).then(res => {
                    if (res.data.opflag) {
                        wx.config({
                            debug: false,
                            appId: res.data.appId,
                            timestamp: res.data.timestamp,
                            nonceStr: res.data.nonce_str,
                            signature: res.data.signature,
                            jsApiList: [
                                'checkJsApi',
                                'scanQRCode',
                                'openLocation',
                                'getLocation',
                                "previewImage"
                            ]
                        });
                    } else {
                        self.$toast({
                            message: "获取jsSDK ticket失败"
                        });
                    }
                }).catch(() => {

                });

                wx.ready(function (res) {
                    self.getLocation();
                });
            },

            //调用jssdk获取坐标
            getLocation(){
                let self = this;                
                wx.getLocation({
                    success: function (res) {
                        self.location.latitude = res.latitude;
                        self.location.longitude = res.longitude;

                        geocoder = new qq.maps.Geocoder({
                            complete: function (adr) {
                                let address = adr.detail.addressComponents;
                                self.location.address = address.country + address.province + address.city + address.district + address.town + address.village + address.street + address.streetNumber;
                                self.initLocation(self.location);
                            }
                        });

                        let latLng = new qq.maps.LatLng(res.latitude, res.longitude);                        
                        geocoder.getAddress(latLng);                        
                    },
                    fail: function () {
                        self.$toast("获取地理位置失败，请刷新页面重试")                        
                    }
                });

                /**
                 * 获取地理位置，把这段代码注释，上面代码取消注释
                 */
/*                 self.location.latitude = "30";
                 self.location.longitude = "120";
                 self.location.address = "测试地址";
                 self.initLocation(self.location);*/
            }
        },

        mounted(){
            this.getOpenId();
            this.getLocation();
        }
    }
</script>

<style lang="less">
    @import "./common/less/media";
    @import "./common/less/reset";
    @import "./common/less/animate";
    @import "./common/font-awesome/css/font-awesome";

    body {
        background-color: #f1f1f1;
    }

    .mint-msgbox-message {
        line-height: 0.4rem;
    }
</style>