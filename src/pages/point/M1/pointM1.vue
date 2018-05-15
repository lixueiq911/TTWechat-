<template>
    <div class="pointM1" v-show="init">
        <!--<v-header :back="back">威享会(M1)</v-header>-->
        <div class="header">
            <a class="fa_left" @click="back"></a>
            <h3>威享会(M1)</h3>
        </div>
        <div class="pointBan">
            <mt-swipe :auto="3000" class="banner">
                <mt-swipe-item>
                    <a>
                        <img class="bannerImg" src="../images/banner_01.png">
                    </a>
                </mt-swipe-item>
            </mt-swipe>
            <div class="option1">
                <h3 v-if="rankList.salesmanName" v-text="rankList.salesmanName +' （'+ rankList.role +'）'"></h3>
                <p v-if="rankList.salesmanTel" class="p1">{{rankList.salesmanTel}}</p>
                <p v-if="rankList.area" class="p2">{{rankList.area | capitalize}}</p>
            </div>
        </div>
        <div class="pointCon">
            <div class="nav_Bar">
                <ul class="nav_ul">
                    <li class="nav_li">
                        <p>{{rankList.dealerNum}}</p>
                        <span>管辖售点数</span>
                    </li>
                    <li class="nav_li" v-if="!isChangSha">
                        <p>{{rankList.monthAmount}}</p>
                        <span>当月销售金额</span>
                    </li>
                    <li class="nav_li" v-if="isChangSha">
                        <p>{{rankList.monthSales}}箱/{{rankList.monthStandardSales}}标箱</p>
                        <span>当月扫码</span>
                    </li>                    
                    <li class="nav_li">
                        <p>{{rankList.averagePoints}}</p>
                        <span>当月平均积分</span>
                    </li>
                </ul>
            </div>
            <div class="tit_box">
                <div class="tit_H3">
                    <span>售点积分排名</span>
                </div>
                <p class="tit_p">{{date | formatDate}}</p>
            </div>
        </div>
        <div>
            <table class="list">
                <thead>
                    <tr>
                        <th class="col1">排名</th>
                        <th class="col2">售点名称</th>
                        <th class="col3">本月积分</th>
                        <th class="col4" v-if="!isChangSha">本月销售额</th>
                        <th class="col4" v-if="isChangSha">本月扫码</th>
                    </tr>
                </thead>
                <!--<tbody>-->
                    <!--<tr @click="seeDetails(item.userId)" v-for="item in rankList.userList">-->
                        <!--<td>-->
                            <!--<img class="td_img" src="../images/point_01.png" v-if="item.rank == 1">-->
                            <!--<img class="td_img" src="../images/point_02.png" v-else-if="item.rank == 2">-->
                            <!--<img class="td_img" src="../images/point_03.png" v-else-if="item.rank == 3">-->
                            <!--<span class="td_sp" v-else>{{item.rank}}</span>-->
                            <!--<img class="copy_img" src="../images/copy_00.png" v-if="item.upDownStatus == 2" />-->
                            <!--<img class="copy_img" src="../images/copy_01.png" v-else-if="item.upDownStatus == 1" />-->
                            <!--<img style="width: 0.2rem;" src="../images/copy_02.png" v-else-if="item.upDownStatus == 3" />-->
                            <!--<span v-else></span>-->
                        <!--</td>-->
                        <!--<td v-text="item.userStore">美宜佳便利店</td>-->
                        <!--<td v-text="item.monthPoints">3300</td>-->
                        <!--<td v-text="item.monthAmount">1180</td>-->
                    <!--</tr>-->
                <!--</tbody>-->
            </table>

            <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :max-distance="150"
                         @top-status-change="handleTopChange" ref="loadmore">
                <ul class="scroll-wrapper">
                    <li class="wrap_li" v-for="item in rankList.userList" @click="seeDetails(item.userId)">
                        <span class="wrap_sp1 col1">
                            <img class="td_img" src="../images/point_01.png" v-if="item.rank == 1">
                            <img class="td_img" src="../images/point_02.png" v-else-if="item.rank == 2">
                            <img class="td_img" src="../images/point_03.png" v-else-if="item.rank == 3">
                            <span class="td_sp" v-else>{{item.rank}}</span>
                            <img class="copy_img" src="../images/copy_00.png" v-if="item.upDownStatus == 2" />
                            <img class="copy_img" src="../images/copy_01.png" v-else-if="item.upDownStatus == 1" />
                            <img class="copy_img2" src="../images/copy_02.png" v-else-if="item.upDownStatus == 3" />
                            <span v-else></span>
                        </span>
                        <span class="wrap_sp2 col1">{{item.userStore}}</span>
                        <span class="wrap_sp3 col1">{{item.monthPoints}}</span>
                        <span class="wrap_sp4 col1" v-if="!isChangSha">{{item.monthAmount}}</span>
                        <span class="wrap_sp4 col1" v-if="isChangSha">{{item.monthSales}}箱/{{item.monthStandardSales}}标箱</span>
                    </li>
                </ul>

            </mt-loadmore>


        </div>

        <!-- 遮罩 -->
        <div class="soap" v-show="soapBgShow" v-bind:style="{ height: height +44 + 'px' }"></div>
        <div class="winning" v-show="soapBgShow">
            <div class="win_ter">
                <img class="win_img" src="../images/tankuan_01.png" />
                <div class="option">
                    <h3>{{userMes.userStore}}</h3>
                    <p class="p1">{{userMes.userTel}}</p>
                    <p class="p2">{{userMes.storeAddress}}</p>
                </div>
                <div class="op_bg" v-if="userMes.registerStatus == 1"></div>
                <div class="sp" v-if="userMes.registerStatus == 1">激活</div>
                <!--<div class="sp" v-if="userMes.registerStatus == 0">未激活</div>-->
                <div class="cole" @click="cole"><img src="../images/cole.png" /></div>
            </div>
            <div class="cont_tip">
                <h3 class="cont_h3">基本信息</h3>
                <div class="cont_dom">
                    <div class="cont_row">
                        <span class="sp1">创建月份</span>
                        <span class="sp2">{{userMes.ctime | setTime}}</span>
                    </div>
                    <div class="cont_row">
                        <span class="sp1">便利店采集方式</span>
                        <span class="sp2">{{userMes.source}}</span>
                    </div>
                </div>
                <div class="cont_nva">
                    <div v-if="userMes.source === 'B2B'">
                        <span class="sp1">B2B用户名</span>
                        <span class="sp2">{{userMes.memberId}}</span>
                    </div>
                    <div v-else>
                        <span class="sp1">WCCS代码</span>
                        <span class="sp2">{{userMes.wccs}}</span>
                    </div>
                </div>
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
                        <span class="sp2">{{userMes.monthSales}}</span>
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
    export {default} from "../js/pointM1";
</script>

<style lang="less">
    @import "../less/pointM1";
</style>