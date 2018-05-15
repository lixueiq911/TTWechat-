<template>
    <div class="pointM3" v-show="init">
        <!--<v-header :back="back">威享会(M3)</v-header>-->
        <div class="header">
            <a class="fa_left" @click="back"></a>
            <h3>威享会(M3)</h3>
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
                <h3 v-text="rankList.salesmanName+'（'+ rankList.role +'）'"></h3>
                <p class="p1">{{rankList.salesmanTel}}</p>
                <p class="p2">{{rankList.area | capitalize}}</p>
            </div>
        </div>
        <div class="pointCon3">
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
            <div class="foot_3">
                <router-link to="/saleM3M2" tag="div" class="M3_1">
                    <img class="M3_img" src="../images/M3_02.png" />
                    <!--<span class="M3_m2">M2</span>-->
                    <!--<span class="M3_txt">M2平均积分排名</span>-->
                </router-link>
                <router-link to="/saleM3M1" tag="div" class="M3_1">
                    <img class="M3_img" src="../images/M3_01.png" />
                    <!--<span class="M3_m2">M1</span>-->
                    <!--<span class="M3_txt">M1平均积分排名</span>-->
                </router-link>
                <router-link to="/saleM3" tag="div" class="M3_1">
                    <img class="M3_img" src="../images/M3_00.png" />
                    <!--<span class="M3_m2">售点</span>-->
                    <!--<span class="M3_txt">售点积分排名</span>-->
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
    export {default} from "../js/pointM3";
</script>

<style lang="less">
    @import "../less/pointM3";
</style>