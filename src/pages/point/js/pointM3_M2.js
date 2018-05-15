import {mapState} from "vuex";
export default{
    data(){
        return {
            init:false,
            dataList:[],
            userMes:[],
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

            self.$axios.post(self.$api.getM2ForM3, postData).then(res => {
                self.$indicator.close();
                self.init = true;
                if (res.data.opflag) {
                    self.dataList = res.data.data;
                } else {
                    self.$toast({
                        message: "获取M1信息数据失败！"
                    });
                }
            }).catch(() => {
                self.init = true;
                self.$toast({
                    message: "获取M1信息数据失败！"
                });
            });
        },
        // 查看详情
        seeDetails(id){
            let self = this;
            let postData = self.$qs.stringify({
                "budSalesman.salesmanId": id
            });

            self.$axios.post(self.$api.getM2Info, postData).then(res => {
                self.$indicator.close();

                if (res.data.opflag) {
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
    mounted(){
        this.loadData();
        this.setHeight();
    }
}

