<template>
    <div class="upload">
    	<v-header></v-header>
    	<h2 class="title"></h2>
	    <div class="desc desc1">
	        <span class="textRed">由于您的扫码异常。</span>
	        为确保销量的真实性，您本月超出<span class="maxNum"></span>箱后所得的积分已被冻结，
	        请上传能够证明您销量的材料，审核通过后，被冻结积分将返还至您的账户，并可获得<span class="textRed">补偿积分300分。</span>
	    </div>
	
	    <div class="desc desc1" style="font-weight:bold">必需照片材料：1.店招 2.大堂全景 3.堆箱及冰箱 4.酒水进货单</div>
	
	    <div id="uploadArea">
	        <div id="uploadImg"></div>
	
	        <div class="remarks">
	            <span>备注：</span>
	            <textarea id="remarks" placeholder="必填：以上材料能证明您的百威啤酒平均月销量为（XXX箱）。                                                                  选填，对销量证明的说明。"></textarea>
	        </div>
	
	        <div class="desc">
	            <p>注：</p>
	            <p>1、请在5个工作日上传申诉材料，我们将在7-10个工作日公布审核结果；</p>
	            <p>2、销量证明上传成功后，您可以在销量证明中查看审核状态。</p>
	        </div>
	        <router-link to="./uploadDown">
	            <button id="submit">提交</button>
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
