<template>
    <div class="train">
        <v-header>培训</v-header>

        <div class="articleList">
            <mt-loadmore :bottom-method="loadData"
                         :bottom-all-loaded="allLoaded"
                         bottomPullText=""
                         bottomDropText=""
                         :autoFill="false"
                         ref="articleList">
                <div class="searchArea">
                    <div class="input">
                        <input type="text" placeholder="标题关键字搜索" v-model="searchData">
                        <i class="fa fa-search" aria-hidden="true"></i>
                    </div>
                    <a href="javascript:void(0)" class="searchBtn" @click="search">搜索</a>
                </div>

                <ul class="tab">
                    <li v-for="item in typeList" :class="{active: articleType == item.type}"
                        @click="checkType(item.type)">{{item.name}}
                    </li>
                </ul>

                <div class="list">
                    <div v-for="item in articleList">
                        <div class="li" v-for="article in item.content.news_item">
                            <h3>{{article.title}}</h3>
                            <p>{{item.content.update_time | formatDate}}</p>
                            <p>{{article.digest}}</p>

                            <div class="articleImg">
                                <img :src="item.wxnewsPic">
                            </div>

                            <a :href="article.url" class="readBtn">开始阅读</a>
                        </div>
                    </div>
                </div>
            </mt-loadmore>
        </div>
    </div>
</template>

<script>
    import {mapState} from "vuex";

    export default{
        data(){
            return {
                searchData: "",         //搜索内容
                articleType: 1,         //文章类型
                allLoaded: false,      //是否全部加载完成
                pageIndex: 1,           //当前页码
                pageSize: 10,           //每次加载数量
                articleList: [],        //文章列表
                canLoad: true,
                typeList: [
                    {type: 1, name: "威享会小课堂"},
                    {type: 2, name: "品牌活动"}
                ]
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

        methods: {
            loadData(){
                let self = this;

                if (!self.user.userId || !self.canLoad) {
                    return;
                }

                let postData = self.$qs.stringify({
                    "budWxnews.type": self.articleType,
                    "budWxnews.content": self.searchData,
                    "processor.pageIndex": self.pageIndex,
                    "processor.pageSize": self.pageSize
                });

                self.canLoad = false;
                self.$axios.post(self.$api.articleList, postData).then(res => {
                    self.canLoad = true;
                    self.$indicator.close();

                    if (res.data.opflag) {
                        res.data.data.records.forEach((item, index) => {
                            try {
                                item.content = JSON.parse(item.content);
                            } catch (err) {
                                console.log(err);
                            }
                        });

                        self.articleList = self.articleList.concat(res.data.data.records);
                        self.pageIndex++;

                        //判断是否全部加载完成
                        self.allLoaded = res.data.data.records.length < self.pageSize;
                        if (self.pageIndex > 2) {
                            self.$refs.articleList.onBottomLoaded();
                        }
                    } else {
                        self.$toast({
                            message: "获取文章失败"
                        });
                    }
                }).catch(() => {
                    self.canLoad = true;
                });
            },

            //搜索
            search(){
                this.allLoaded = false;
                this.pageIndex = 1;
                this.articleList = [];
                this.$indicator.open();
                this.loadData();
            },

            //切换类型
            checkType(type){
                this.allLoaded = false;
                this.searchData = "";
                this.pageIndex = 1;
                this.articleList = [];
                this.articleType = type;
                this.$indicator.open();
                this.loadData();
            }
        },

        filters: {
            formatDate(date){
                return new Date(date * 1000).toLocaleDateString();
            }
        },

        mounted(){
            this.loadData();
        }
    }
</script>

<style lang="less">
    @import "./less/train";
</style>