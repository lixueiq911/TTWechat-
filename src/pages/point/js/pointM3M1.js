import {mapState} from "vuex";
export default{
    data(){
        return {
            init:false,
            m2Name:"",
            dataList:[],
            userMes:[],
            height:0,
            soapBgShow:false,
            isChangSha:false
        }
    },
    computed: {
        ...mapState(["user"]),
        filterResult() {
            this.loadData(this.m2Name);
        }
    },
    watch: {
        user(){
            this.loadData();
        }
    },
    methods:{
        loadData(m2){
            let self = this;
            let m = m2||"";
            if(!self.user.salesmanId){
                return;
            }
            if(self.user.areaCode =="1232"){
            	self.isChangSha = true;
            }             
            let postData = self.$qs.stringify({
                "budSalesman.salesmanId": self.user.salesmanId,
                "budSalesman.salesmanName": m  //M1姓名
            });

            self.$axios.post(self.$api.getM1ForM3, postData).then(res => {
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

            self.$axios.post(self.$api.getM1Info, postData).then(res => {
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


