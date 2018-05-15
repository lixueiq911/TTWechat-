<template>
    <div class="header">
        <a href="javascript:void(0)" class="fa fa-angle-left" @click="onBack"></a>
        <h3>
            <slot></slot>
        </h3>
    </div>
</template>

<script>
    export default{
        props: ["back"],

        methods: {
            onBack(){
                let self = this;
                if (self.back) {
                    self.back();
                } else {
                    self.$router.go(-1);
                }
            }
        }
    }
</script>

<style lang="less">
    .header {
        height: 0.9rem;
        line-height: 0.9rem;
        background-color: #1B1B1F;
        position: relative;

        .fa-angle-left {
            position: absolute;
            width: 0.9rem;
            height: 0.9rem;
            top: 0;
            left: 0;
            line-height: 0.9rem;
            text-align: center;
            color: #fff;
            font-size: 0.5rem;
        }

        h3 {
            color: #fff;
            font-size: 0.36rem;
            text-align: center;
            font-weight: normal;
        }
    }
</style>