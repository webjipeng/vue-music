<template>
    <div class="mod_null search">
        <h6>无匹配</h6>
        <p>{{msg}}</p>
    </div>
</template>

<script>
export default {
    props:{
        msg:{
            type:String,
            default:''
        }
    }
}
</script>

<style scoped>
.mod_null {
    position: relative;
    padding: 210px 0 0;
    text-align: center;
    color: #808080;
}
.mod_null.search:before {
    width: 106px;
    height: 105px;
    margin-left: -53px;
    background-image: url(https://y.gtimg.cn/mediastyle/mobile/yqq_v5/img/search_null.png?max_age=19830212&d=20151105145423);
}
.mod_null:before {
    content: "";
    position: absolute;
    left: 50%;
    top: 80px;
    -webkit-background-size: cover;
}
.mod_null h6 {
    font-size: 18px;
    line-height: 36px;
    font-weight: normal;
}
</style>


