import {mapState} from "vuex";
export default{
    data(){
        return {
            userMes: {},
            rankList: [],
            date: new Date,
            height:0,
            init:false,
            soapBgShow:false,
            isChangSha:false,
            list: [],
            allLoaded: false,
            topStatus: '',
            salesmanId:""
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
    created() {
        this.loadData();
    },
    methods:{
        back(){
            this.$router.push("/saleLogin");            
        },
        loadData(){
            let self = this;
            if(!self.user.salesmanId){
                return false
            }
            if(self.user.areaCode =="1232"){
            	self.isChangSha = true;
            }
            let postData = self.$qs.stringify({
                "budSalesman.salesmanId": self.user.salesmanId || self.salesmanId
            });
			
            self.$axios.post(self.$api.getM1Page, postData).then(res => {
            	console.log(JSON.stringify(res))
                self.$indicator.close();
                self.init = true;
                if (res.data.opflag) {
                    self.rankList = res.data.data;
                    self.salesmanId = res.data.data.salesmanId;
                } else {
                    self.$toast({
                        message: "获取首页数据失败"
                    });
                }
            }).catch(() => {
                self.init = true;
                self.$toast({
                    message: "获取首页数据失败"
                });
            });
        },
        // 查看详情
        seeDetails(id){
            let self = this;
            let postData = self.$qs.stringify({
                "budUser.userId": id
            });

            self.$axios.post(self.$api.getStoreInfo, postData).then(res => {
                self.$indicator.close();
                if (res.data.opflag) {
                    console.log(res);
                    self.userMes = res.data.data;
                    self.soapBgShow = true;
                } else {
                    self.$toast({
                        message: "获取便利店数据详情失败！"
                    });
                }
            }).catch(() => {
            });
        },


        loadBottom: function () {
            //load data

            //this.allLoaded = true;// 若数据已全部获取完毕
            let self = this;
            setTimeout(function () {

                // let postData = self.$qs.stringify({
                //     "budSalesman.salesmanId": "084f39a7a2814d2da6ffb2b7136adc91"
                // });
                //
                // self.$axios.post(self.$api.getM1Page, postData).then(res => {
                //     self.$indicator.close();
                //     if (res.data.opflag) {
                //         console.log(res);
                //         for (let i=0; i< res.data.data.userList.length; i++){
                //             self.rankList.userList.push(res.data.data.userList[i]);
                //         }
                //         self.$refs.loadmore.onBottomLoaded();
                //     } else {
                //         self.$toast({
                //             message: "获取首页数据失败"
                //         });
                //     }
                // }).catch(() => {
                // });
                self.$indicator.close();
                self.$refs.loadmore.onBottomLoaded();
            }, 2000);

        },
        handleTopChange: function (status) {
            this.topStatus = status;
        },
        // 关闭弹框
        cole(){
            let self = this;
            self.soapBgShow = false;
        },
        setHeight(){
            this.height = document.documentElement.clientHeight-38;
        }
    },
    filters:{
        setTime(val){
            if(val){
                return val.split("-")[0]+"-"+val.split("-")[1];
            }
        },

        formatDate(val){
            return val.getFullYear() + "年" + (val.getMonth() + 1) + "月"
        },
        capitalize: function (value) {
            if(value){
                let str = value.replace(/[a-zA-Z\|]/g, "");
                return str;
            }
        }
    },
    mounted(){
        this.loadData();
        this.setHeight();
    }
}