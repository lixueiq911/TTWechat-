<template>
    <div class="WxSuccess">
    	<v-header>积分</v-header>
	    <div class="sucIcon">
	        <div class="num">+<span class="score"></span></div>
	    </div>
	    <div class="numTip">恭喜您获得<span class="score"></span>积分</div>
	    <div class="skuname"></div>
	    <div class="tip">积分已发送至您的积分账户</div>
	    <div class="type1">
		<router-link to="./index">
			<a class="link1">查看我的积分</a>
		</router-link>	
		<router-link to="./wxsao">
			<a class="link2">继续扫码</a>
		</router-link>		        
	        
	    </div>
	</div>
</template>

<script>
	import store from "store";
    import {mapState} from "vuex";
    export default{
        data(){
            return {
            	passpoint: store.get("lookpoint"),
            	passname: store.get("lookname"),
                date: new Date,
                height:0
            }
        },
		
        computed: {
            ...mapState(["user"])
        },

        watch: {
            user(){
				this.getScore();
            }
        },

        methods: {
		    getScore() {
		    	let self = this;
		    	self.$indicator.close();
		        var point = self.passpoint;		
		        var name = self.passname
		        console.log(point)
		        $(".score").html(point);
		        $(".skuname").html(name);
		    },
            setHeight(){
                this.height = document.documentElement.clientHeight-38;
            }
        },

        filters: {

        },

        mounted(){
            let self = this;
            self.$nextTick(() => {
                self.$indicator.close();
            });        	
            this.getScore();            
            this.setHeight();
          
        }
    }
</script>

<style lang="less">
    @import "./less/wxsao";
</style>
