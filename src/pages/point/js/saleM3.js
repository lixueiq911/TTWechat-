import {mapState} from "vuex";
export default{
    data(){
        return {
            init:false,
            saleList: [],
            userMes:[],
            m1Name: "",
            height:0,
            soapBgShow:false,
            isChangSha:false
        }
    },
    computed: {
        ...mapState(["user"]),
        filterResult() {
            this.loadData(this.m1Name);
        }
    },

    watch: {
        user(){
            this.loadData();
        }
    },
    methods:{
        loadData(m1){
            let self = this;
            let m = m1||"";

            if(!self.user.salesmanId){
                return;
            }
            if(self.user.areaCode =="1232"){
            	self.isChangSha = true;
            }             
            let postData = self.$qs.stringify({
                "budSalesman.salesmanId": self.user.salesmanId,  //主键id
                "budSalesman.salesmanName": m  //M1姓名
            });

            self.$axios.post(self.$api.getStoreForM3, postData).then(res => {
                self.$indicator.close();

                self.init = true;
                if (res.data.opflag) {
                    self.saleList = res.data.data;
                } else {
                    self.$toast({
                        message: "获取售点信息数据失败！"
                    });
                }
            }).catch(() => {
                self.init = true;
                self.$toast({
                    message: "获取售点信息数据失败！"
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
        }
    },
    mounted(){
        // this.loadData();
        this.setHeight();
    }
}

