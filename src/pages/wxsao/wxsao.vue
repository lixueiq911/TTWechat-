<template>
	<div class="wxsao">
		<v-header>扫码</v-header>
		<div class="StartWX" id="scanBtn" v-on:click="scan();">立即扫一扫</div>
		<router-link to="./wxcord">
			<div class="StartCord">二维码扫不出?用串码识别吧</div>
		</router-link>	
	    <div id="scanDialog">
	        <div class="con">
	            <div class="dialogTitle">扫码失败</div>	
	            <div class="dialogCon"></div>
	            <div class="dialogBtn">
	                <div>
	                	<router-link to="./index">
	                    <button class="cancelBtn">确定</button>
	                    </router-link>	
	                </div>
	                <div>
	                    <button class="confirmBtn"><a href="tel:4008215028">联系客服</a></button>
	                </div>
	            </div>	
	            <a href="javascript:void(0)" class="closeDialog" v-on:click="close()">×</a>
	        </div>
	    </div>
	    <div id="loading">
		    <div class="loadingTip">
		        <div class="img"></div>
		        <span>正在识别</span>
		    </div>
		</div>
	</div>
</template>
<script>
    export {default} from "./js/wxsao";
</script>
<style lang="less">
	@import "./less/wxsao";
</style>