let baseUrl = "/budtt";

export default {
	storeMethod: baseUrl + "/BudTTWXController/getShopParam.json", //商城
	getOpenId: baseUrl + "/WXUtilController/redirect/getUserid.do", //获取openId
	wx: baseUrl + "/BudTTWXController/getWXParam.json", //获取微信配置参数
	checkOpenId: baseUrl + "/BudTTWXController/checkOpenId.json", //检验是否绑定openId

	login: baseUrl + "/BudTTWXController/login.json", //登录
	salesmanLogin: baseUrl + "/BudTTWXController/salesmanLogin.json", //销售登录
	index: baseUrl + "/BudTTWXController/queryHomePageInfo.json", //首页
	taskList: baseUrl + "/BudTTWXController/queryTaskList.json", //任务列表
	taskTodo: baseUrl + "/BudTTWXController/queryChildTaskListForDoing.json", //任务详情（待做）
	taskDone: baseUrl + "/BudTTWXController/queryChildTaskListForDid.json", //任务详情（已做）
	taskSubmit: baseUrl + "/BudTTWXController/userTaskReply.json", //答题
	taskRedo: baseUrl + "/BudTTWXController/userRedoTaskReply.json", //重新答题
	uploadPic: baseUrl + "/UIController/uploadPic.json", //上传图片
	uploadFile: baseUrl + "/UIController/uploadViode.json", //上传文件
	articleList: baseUrl + "/BudTTWXController/queryWxnewsOnline.json", //文章列表
	userMes: baseUrl + "/BudTTWXController/getBudUserInfo.json", //用户信息
	message: baseUrl + "/BudTTWXController/queryBudUserMessages.json", //消息列表
	readMessage: baseUrl + "/BudTTWXController/messageReading.json", //阅读消息
	rule: baseUrl + "/BudTTWXController/queryBudRulesList.json", //积分规则
	record: baseUrl + "/BudTTWXController/queryBudPointRecordByPage.json", //积分记录列表
	password: baseUrl + "/BudTTWXController/updateUserPassWord.json", //修改密码
	toShakePage: baseUrl + "/BudTTWXController/toShakePage.json", //是否有资格摇一摇
	lotteryRecord: baseUrl + "/BudTTWXController/lotteryRecord.json", //查看中奖纪录
	doShake: baseUrl + "/BudTTWXController/doShake.json", //摇一摇抽奖

	getM1Page: baseUrl + "/BudTTWXController/getM1HomePageInfo.json", //M1首页信息
	getStoreInfo: baseUrl + "/BudTTWXController/getStoreInfoByUserId.json", //M1下便利店详情
	getM2Page: baseUrl + "/BudTTWXController/getM2HomePageInfo.json", //M2首页信息
	getM1ForM2: baseUrl + "/BudTTWXController/getM1RankInfoForM2.json", //M2旗下M1排名信息
	getStoreForM2: baseUrl + "/BudTTWXController/getStoreRankInfoForM2.json", //M2旗下便利店排名
	getM1Info: baseUrl + "/BudTTWXController/getM1Info.json", //M1信息
	getM3Page: baseUrl + "/BudTTWXController/getM3HomePageInfo.json", //M3首页信息
	getM2ForM3: baseUrl + "/BudTTWXController/getM2RankInfoForM3.json", //M3旗下M2排名信息
	getM2Info: baseUrl + "/BudTTWXController/getM2Info.json", //M2信息
	getM1ForM3: baseUrl + "/BudTTWXController/getM1RankInfoForM3.json", //M3旗下M1排名信息
	getStoreForM3: baseUrl + "/BudTTWXController/getStoreRankInfoForM3.json", //M3旗下便利店排名
	getCordNum : baseUrl + "/BudTTWXController/keyPersonOperate.json ? lotteryDrawDTO.code = cmxvfybptrasrvrm & lotteryDrawDTO.flag = 1 & lotteryDrawDTO.userid = 017 b2acacf1b4ccbb04a8a233b389c5f & lotteryDrawDTO.latitude = 31.11536 & lotteryDrawDTO.longitude = 121.49536 & lotteryDrawDTO.address = lianhua45",

	wxsao : baseUrl + "/BudTTWXController/keyPersonOperate.json"
}

