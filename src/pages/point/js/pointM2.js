import {mapState} from "vuex";
export default{
    data(){
        return {
            saleList: [],
            init:false,
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

            self.$axios.post(self.$api.getM2Page, postData).then(res => {
            	console.log(JSON.stringify(res))
                self.$indicator.close();

                if (res.data.opflag) {
                    self.saleList = res.data.data;
                    self.init = true;
                } else {
                    self.init = true;
                    self.$toast({
                        message: "获取M2首页数据失败"
                    });
                }
            }).catch(() => {
                self.init = true;
                self.$toast({
                    message: "获取M2首页数据失败"
                });
            });
        },
    },
    mounted(){
        this.loadData();
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