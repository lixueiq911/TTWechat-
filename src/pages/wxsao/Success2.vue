<template>
    <div class="WxSuccess">
    	<v-header></v-header>
	    <div class="sucIcon">
	        <div class="num">+<span class="score"></span></div>
	    </div>
	    <div class="numTip">扫码成功</div>
	    <div class="tip2" id="scoreTip">本次所得null积分已被冻结</div>
	    <div class="tip2" id="sysTip">null</div>
	
	    <div class="type2">
	        <div class="tip3">为避免因此影响您的月度积分奖励，请您在本月上传可靠的销量证明文件，审核属实后积分将返还至您账户。</div>
        <router-link to="./upload">
            <a class="link3">上传销售凭证</a>
        </router-link>  	        
        <router-link to="./record">
            <a class="link4">查看我的积分</a>
        </router-link>	        
	    </div>
	</div>
</template>

<script>
    import {mapState} from "vuex";
    export default{
        data(){
            return {
                banner: [],
                userMes: {},
                rankList: [],
                date: new Date,
                height:0
            }
        },
		
        computed: {
            ...mapState(["user"])
        },

        watch: {
            user(){
                this.loadData();
            }
        },

        methods: {
            loadData(){
                let self = this;

                if (!self.user.userId) {
                    return;
                }

                let postData = self.$qs.stringify({
                    "budUser.userId": self.user.userId
                });

                self.$axios.post(self.$api.index, postData).then(res => {
                    self.$indicator.close();

                    if (res.data.opflag) {
                        self.banner = res.data.indexPic;
                        self.userMes = res.data.userData;
                        self.rankList = res.data.rankData;
                    } else {
                        self.$toast({
                            message: "获取首页数据失败"
                        });
                    }
                }).catch(() => {
                });
            },
            setHeight(){
                this.height = document.documentElement.clientHeight-38;
            }
        },

        filters: {
            formatCity(val){
                if (val) {
                    return val.split("|")[0]
                }
            },

            formatDate(val){
                return val.getFullYear() + "年" + (val.getMonth() + 1) + "月"
            }
        },

        mounted(){
            this.loadData();
            this.setHeight();            
        }
    }
</script>

<style lang="less">
    @import "./less/wxsao";
</style>
