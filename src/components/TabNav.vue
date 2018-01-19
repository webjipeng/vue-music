<template>
    <nav class="mod_nav">
         <router-link tag="a"  to="/recommend">
            推荐
        </router-link>
        <router-link tag="a"  to="/rank">
            热歌榜
        </router-link>
        <router-link tag="a"  to="/singer">
            歌手
        </router-link>
        <router-link tag="a"  to="/search">
            搜索
        </router-link>
    </nav>
</template>

<script>
export default {
    name: 'TabNav'
}
</script>

<style>
.mod_nav{display:-webkit-box;background:#fff;position:relative}
.mod_nav a{-webkit-box-flex:1;position:relative;display:block;height:40px;line-height:40px;overflow:hidden;text-align:center;font-size:16px;color:rgba(0,0,0,.6);-webkit-box-sizing:border-box}
.mod_nav a.router-link-exact-active{color:#31c27c}
.mod_nav a.router-link-exact-active:after{content:"";display:block;position:absolute;bottom:0;left:0;right:0;height:2px;background:#31c27c}
</style>


