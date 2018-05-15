<template>
	<div class="wxcord">
		<v-header>输入串码</v-header>
		<div class="logo"></div>
		<div class="cordinput">
			<label>串码号:</label><input id="Cordbtn" type="text" value="" placeholder="请输入箱子内侧16位串码" />
		</div>
		<div class="cordBtn" v-on:click="sentCord();">立即识别</div>
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
	</div>
</template>

<script>
	import store from "store";
	import { mapState } from "vuex";
	export default {
		data() {
			return {
				banner: [],
				userMes: {},
				rankList: [],
				selfuserid:"",
				date: new Date,
				height: 0,
				location: {
					latitude: "",
					longitude: "",
					address: ""
				},
				msg:""
			}
		},
		computed: {
			...mapState(["user"])
		},

		watch: {
			user() {
				this.actionSao();
			}
		},

		methods: {
			actionSao() {
				let self = this;
				if(!self.user.userId) {
					return;
				} else {
					self.selfuserid = self.user.userId
					self.$indicator.close();
					
				}
				let url = self.$api.wx + "?url=" + window.location.href;
				self.$axios.get(url).then(res => {
					if(res.data.opflag) {
						wx.config({
							debug: false,
							appId: res.data.appId,
							timestamp: res.data.timestamp,
							nonceStr: res.data.nonce_str,
							signature: res.data.signature,
							jsApiList: [
								'checkJsApi',
								'scanQRCode',
								'openLocation',
								'getLocation',
								"previewImage"
							]
						});
					} else {
						self.$toast({
							message: "获取jsSDK ticket失败"
						});
					}
				}).catch(() => {
	
				});
				wx.ready(function(res) {
					self.getLocation();
				});
			},
			getLocation() {
				let self = this;
				wx.getLocation({
					success: function(res) {
						self.$indicator.close();
						self.location.latitude = res.latitude;
						self.location.longitude = res.longitude;	
						geocoder = new qq.maps.Geocoder({
							complete: function(adr) {
								let address = adr.detail.addressComponents;
								self.location.address = address.country + address.province + address.city + address.district + address.town + address.village + address.street + address.streetNumber;
	
							}
						});
						let latLng = new qq.maps.LatLng(res.latitude, res.longitude);
						geocoder.getAddress(latLng);
					},
					fail: function() {
						self.$indicator.close();
						self.$toast("获取地理位置失败，请刷新页面重试")
					}
				});
	
				/**
				 * 获取地理位置，把这段代码注释，上面代码取消注释
				 */
/*				                 self.location.latitude = "22.51247";
				                 self.location.longitude = "113.91416";
				                 self.location.address = "lianhua45";*/
				/*                 self.initLocation(self.location);*/
			},			
			sentCord() {
				var getCord = document.getElementById('Cordbtn').value;
				let self = this;
				self.actionSao();
				var kodate = {
					"lotteryDrawDTO.code": getCord,
					"lotteryDrawDTO.flag": "2",
					"lotteryDrawDTO.userid": self.selfuserid,
					"lotteryDrawDTO.latitude": self.location.latitude,
					"lotteryDrawDTO.longitude": self.location.longitude,
					"lotteryDrawDTO.address": self.location.address
				}				
				$("#loading").show();
				$.ajax({
					url: self.$api.wxsao,
					dataType: "json",
					data: kodate,
					success: function(res) {
							$("#loading").hide();
							if(res.resultInfo.resultcode == "1"){
								store.set("lookpoint", res.resultInfo.point);
								store.set("lookname", res.resultInfo.sku);
								self.$router.push({path: "/Success"});
							}
							if(res.resultInfo.resultcode == "-6"){
								$(".dialogCon").html("抱歉，您的扫码地理位置与初始位置不符，不能获得积分!")
								$("#scanDialog").show();
							}
							if(res.resultInfo.resultcode == "-4"){
								$(".dialogCon").html("当前登录人无效")
								$("#scanDialog").show();
							}
							if(res.resultInfo.resultcode == "-5"){
								$(".dialogCon").html("当前登录人被禁用")
								$("#scanDialog").show();
							}
							if(res.resultInfo.resultcode == "-8"){
								$(".dialogCon").html("抱歉，因为获取您的地理位置失败，无法扫码!")
								$("#scanDialog").show();		

							}
							if(res.resultInfo.resultcode == "-1"){
								$(".dialogCon").html("无效的二维码!")
								$("#scanDialog").show();
							}
							if(res.resultInfo.resultcode == "-3"){
								$(".dialogCon").html("码包未激活!")
								$("#scanDialog").show();
							}
							if(res.resultInfo.resultcode == "-2"){
								$(".dialogCon").html("二维码被扫描已失效,请查看“积分”是否有扫码记录或联系客服!")
								$("#scanDialog").show();
							}
							if(res.resultInfo.resultcode == "-7"){
								$(".dialogCon").html("抱歉，活动已结束，不能获得积分！")
								$("#scanDialog").show();
							}
							if(res.opflag == false) {
								self.$toast({
									message: "扫码失败"
								});
								return;
							}
						if(res.opflag == false) {
							self.$toast({
								message: "扫码失败"
							});
							return;
						}
					},
					error: function() {
						self.$toast({
							message: "扫码提交失败"
						});
					} 
				})
		},			
		close(){
			$("#scanDialog").hide();
		},		
			setHeight() {
				this.height = document.documentElement.clientHeight - 38;
			}
		},
		filters: {
			formatCity(val) {
				if(val) {
					return val.split("|")[0]
				}
			},
			formatDate(val) {
				return val.getFullYear() + "年" + (val.getMonth() + 1) + "月"
			}
		},
		mounted() {
			this.actionSao();
			this.setHeight();
		}
	}
</script>

<style lang="less">
	@import "./less/wxsao";
</style>