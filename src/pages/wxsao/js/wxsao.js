import store from "store";
import { mapState } from "vuex";

let geocoder;
export default {
	data() {
		return {
			openId: this.$route.params.openId,
			userType: this.$route.params.userType,
			selfuserid: "",
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
/*			                 self.location.latitude = "30";
			                 self.location.longitude = "120";
			                 self.location.address = "测试地址";
			                 self.initLocation(self.location);
			                 self.$indicator.close();*/
		},
		scan() {
			let self = this;
			self.actionSao();
			if(!self.location.latitude || self.location.latitude === "" || self.location.latitude === null) {
				self.$toast({
					message: "正在获取您当前所在位置信息，如果您未允许公众号获取你的位置，请允许。如果您已允许公众号获取您的位置，请稍后再试！"
				});
				return false;
			}
			wx.scanQRCode({
				needResult: 1,
				scanType: ["qrCode"],
				success: function(res) {
					var result = res.resultStr;
					var keyArr = result.split("=");
					if(!result || keyArr.length === 0) {
						self.$toast({
							message: "扫码失败!"
						});
					}
					var keyCode = keyArr[1];
					var kodate = {
						"lotteryDrawDTO.code": keyCode,
						"lotteryDrawDTO.flag": "1",
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
						},
						error: function() {
							self.$toast({
								message: "扫码提交失败"
							});
						}
					})
				},
				fail: function(res) {
					self.$toast({
						message: "扫码失败"
					});
				}
			});
		},
		close(){
			$("#scanDialog").hide();
		},
		setHeight() {
			this.height = document.documentElement.clientHeight - 38;
		},
	},

	filters: {

	},
	mounted() {		
		this.actionSao();
		this.setHeight();
	}
}