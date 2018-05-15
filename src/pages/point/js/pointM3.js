import {mapState} from "vuex";
export default{
    data(){
        return {
            init:false,
            banner: [],
            userMes: {},
            rankList: [],
            date: new Date,
            height:0,
            soapBgShow:false,
            isChangSha:false
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
    methods:{
        back(){
            this.$router.push("/saleLogin");
        },
        loadData(){
            let self = this;

            if(!self.user.salesmanId){
                return;
            }
            if(self.user.areaCode =="1232"){
            	self.isChangSha = true;
            }            
            let postData = self.$qs.stringify({
                "budSalesman.salesmanId": self.user.salesmanId
            });

            self.$axios.post(self.$api.getM3Page, postData).then(res => {
                self.$indicator.close();
                self.init = true;
                if (res.data.opflag) {
                    self.rankList = res.data.data;
                } else {
                    self.$toast({
                        message: "获取首页数据失败!"
                    });
                }
            }).catch((err) => {
                console.log(err);
                self.init = true;
                self.$toast({
                    message: "获取首页数据失败!"
                });
            });
        },
        // 查看详情
        seeDetails(){
            let self = this;
            self.soapBgShow = true;
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
    mounted(){
        this.loadData();
        this.setHeight();
    },
    filters: {
        capitalize: function (value) {
            if(value){
                let str = value.replace(/[a-zA-Z\|]/g, "");
                return str;
            }
        }
    }
}