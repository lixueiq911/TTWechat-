<template>
    <div class="pointM2" v-show="init">
        <!--<v-header :back="back">威享会(M2)</v-header>-->
        <div class="header">
            <a class="fa_left" @click="back"></a>
            <h3>威享会(M2)</h3>
        </div>
        <div class="pointBan">
            <mt-swipe :auto="3000" class="banner">
                <mt-swipe-item>
                    <a>
                        <img class="bannerImg" src="../images/banner_01.png">
                    </a>
                </mt-swipe-item>
            </mt-swipe>
            <div class="option">
                <h3 v-text="saleList.salesmanName+'（'+ saleList.role +'）'">陈成 (M2)</h3>
                <p class="p1">{{saleList.salesmanTel}}</p>
                <p class="p2">{{saleList.area | capitalize}}</p>
            </div>
        </div>
        <div class="pointCon">
            <div class="nav_Bar">
                <ul class="nav_ul">
                    <li class="nav_li">
                        <p>{{saleList.dealerNum}}</p>
                        <span>管辖售点数</span>
                    </li>
                    <li class="nav_li" v-if="!isChangSha">
                        <p>{{saleList.monthAmount}}</p>
                        <span>当月销售金额</span>
                    </li>
                    <li class="nav_li" v-if="isChangSha">
                        <p>{{saleList.monthSales}}箱/{{saleList.monthStandardSales}}标箱</p>
                        <span>当月扫码</span>
                    </li>                    
                    <li class="nav_li">
                        <p>{{saleList.averagePoints}}</p>
                        <span>当月平均积分</span>
                    </li>
                </ul>
            </div>
            <div class="point_foot">
                <div class="foot_fl">
                    <router-link to="/integralM2" tag="div" class="foot_new">
                        <img src="../images/M2_11.png" />
                        <!--<span class="san1">M1</span>-->
                        <!--<span class="ran_1">M1平均积分排名</span>-->
                    </router-link>
                    <router-link to="/saleM2" tag="div" class="foot_new">
                        <img src="../images/M2_00.png" />
                        <!--<span class="san2">售点</span>-->
                        <!--<span class="ran_2">售点积分排名</span>-->
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export {default} from "../js/pointM2";
</script>

<style lang="less">
    @import "../less/pointM2";
</style>