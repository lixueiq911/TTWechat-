<template>
    <div class="pointM3_M1" v-show="init">
        <v-header>M1平均积分排名</v-header>
        <div class="search">
            <mt-search cancel-text="取消" placeholder="请输入M2姓名" v-model="m2Name"
                       :result="filterResult"></mt-search>
        </div>
        <div class="cont_M2">
            <div class="tHeader">
                <span class="sp1">排名</span>
                <span class="sp2">M1姓名</span>
                <span class="sp3">当月平均积分</span>
                <span class="sp4" v-if="!isChangSha">当月销售金额</span>
                <span class="sp4" v-if="isChangSha">当月扫码</span>
            </div>
            <div class="tBody box">
                <ul class="tul">
                    <li class="tli1" v-for="item in dataList" @click="seeDetails(item.salesmanId)">
                        <span class="li_span1 cort hei">
                            <img class="td_img" src="../images/point_01.png" v-if="item.rank ==1">
                            <img class="td_img" src="../images/point_02.png" v-else-if="item.rank ==2">
                            <img class="td_img" src="../images/point_03.png" v-else-if="item.rank ==3">
                            <span class="td_sp" v-else>{{item.rank}}</span>
                            <img class="copy_img" src="../images/copy_00.png" v-if="item.upDownStatus == 2" />
                            <img class="copy_img" src="../images/copy_01.png" v-else-if="item.upDownStatus == 1" />
                            <img class="copy_img2" src="../images/copy_02.png" v-else-if="item.upDownStatus == 3" />
                            <span v-else></span>
                        </span>
                        <div class="li_span_2 cort">
                            <span>{{item.salesmanName}}</span>
                            <p class="li_p">{{"( "+item.m2+" )"}}</p>
                        </div>
                        <!--<span class="li_span2 cort">{{item.salesmanName}}</span>-->
                        <span class="li_span3 cort hei">{{item.averagePoints}}</span>
                        <span class="li_span4 cort hei" v-if="!isChangSha">{{item.monthAmount}}</span>
                        <span class="li_span4 cort hei" v-if="isChangSha">{{item.monthSales}}箱/{{item.monthStandardSales}}标箱</span>
                    </li>
                </ul>
            </div>
        </div>

        <!-- 遮罩 -->
        <div class="soap" v-show="soapBgShow" v-bind:style="{ height: height +44 + 'px' }"></div>
        <div class="winning" v-show="soapBgShow">
            <div class="win_ter">
                <img class="win_img" src="../images/tankuan_01.png" />
                <div class="option">
                    <h3>{{userMes.salesmanName}}</h3>
                    <p class="p1">{{userMes.salesmanTel}}</p>
                    <!--<p class="p2">{{userMes.storeAddress}}</p>-->
                </div>
                <!--<div class="op_bg"></div>-->
                <!--<div class="sp" v-if="userMes.registerStatus == 1">激活</div>-->
                <!--<div class="sp" v-if="userMes.registerStatus == 0">未激活</div>-->
                <div class="cole" @click="cole"><img src="../images/cole.png" /></div>
            </div>
            <div class="cont_tip">
                <h3 class="cont_h3">基本信息</h3>
                <div class="cont_dom">
                    <div class="cont_row">
                        <span class="sp1">旗下售点数</span>
                        <span class="sp2">{{userMes.dealerNum || "0"}}</span>
                    </div>
                    <div class="cont_row">
                        <span class="sp1">当月平均积分</span>
                        <span class="sp2">{{userMes.averagePoints}}</span>
                    </div>
                </div>
                <!--<div class="cont_nva">-->
                <!--<span class="sp1">WCCS代码/B2B用户名</span>-->
                <!--<span class="sp2">{{userMes.wccs}}</span>-->
                <!--</div>-->
                <h3 class="cont_h3">销量信息</h3>
                <div class="cont_dom">
                    <div class="cont_row">
                        <span class="sp1">本月销售额</span>
                        <span class="sp2">{{userMes.monthAmount}}</span>
                    </div>
                    <div class="cont_row">
                        <span class="sp1">YTD销售额</span>
                        <span class="sp2">{{userMes.yearAmount}}</span>
                    </div>
                </div>
                <div class="cont_dom" style="border-top: none;">
                    <div class="cont_row">
                        <span class="sp1">本月销售箱数</span>
                        <span class="sp2">{{userMes.monthPoints}}</span>
                    </div>
                    <div class="cont_row">
                        <span class="sp1">YTD销售箱数</span>
                        <span class="sp2">{{userMes.yearSales}}</span>
                    </div>
                </div>
                <h3 class="cont_h3">积分信息</h3>
                <div class="foot_tr">
                    <div class="foot_ti">
                        <span class="sp1">本月销售积分</span>
                        <span class="sp2">{{userMes.monthSalesPoints}}</span>
                    </div>
                    <div class="foot_ti">
                        <span class="sp1">本月任务积分</span>
                        <span class="sp2">{{userMes.monthTaskPoints}}</span>
                    </div>
                    <div class="foot_ti">
                        <span class="sp1">本月累计积分</span>
                        <span class="sp2">{{userMes.monthPoints}}</span>
                    </div>
                </div>
                <div class="foot_tr bor">
                    <div class="foot_ti">
                        <span class="sp1">YTD销售积分</span>
                        <span class="sp2">{{userMes.yearSalesPoints}}</span>
                    </div>
                    <div class="foot_ti">
                        <span class="sp1">YTD任务积分</span>
                        <span class="sp2">{{userMes.yearTaskPoints}}</span>
                    </div>
                    <div class="foot_ti">
                        <span class="sp1">YTD累计积分</span>
                        <span class="sp2">{{userMes.yearPoints}}</span>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    export {default} from "../js/pointM3M1";
</script>

<style lang="less">
    @import "../less/integralM2";
</style>