<template>
  <div id="app">
    <m-header></m-header>
    <tab-nav></tab-nav>
    <keep-alive>  <!-- 这个标签表示缓存页面 -->
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import MHeader from '@/components/Header'
import TabNav from '@/components/TabNav'
import Player from '@/components/Player'


export default {
  name: 'app',
  components: {
    MHeader,
    TabNav,
    Player
  }
}
</script>

<style>
body,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,code,form,fieldset,legend,input,textarea,p,blockquote,th,td{margin:0;padding:0}
article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}
input:focus,textarea:focus,button:focus{outline:0}
fieldset,img{border:0}
li{list-style:none}
body{font:12px/1.5 "hiragino sans gb",arial;color:#555;background-color:#FFF;-webkit-tap-highlight-color:rgba(0,0,0,0);-webkit-user-select:none}
a{text-decoration:none}
.c_txt1{color:#555}
.c_txt2{color:#000}
.c_txt3{color:#8F8F8F}
.c_txt4{color:#D2D2D2}
.c_txt5{color:#FF6012}
body{background:#f4f4f4}

@font-face {
  font-family: 'iconfont';
  src: url('assets/fonts/iconfont.eot');
  src: url('assets/fonts/iconfont.eot?#iefix') format('embedded-opentype'),
  url('assets/fonts/iconfont.woff') format('woff'),
  url('assets/fonts/iconfont.ttf') format('truetype'),
  url('assets/fonts/iconfont.svg#iconfont') format('svg');
}
.icon-sequence:before{
  content: "\e671"
}
.icon-random::before{
  content: "\e672"
}
.icon-loop::before{
  content: "\e607"
}
.icon-play::before{
  content: '\e674'
}
.icon-pause::before{
  content: '\e668'
}
.icon-prev:before{
  content: "\e698"
}
.icon-next:before{
  content: "\e6a1"
}
.icon-not-favorite::before{
  content: '\e86f'
}
.icon-favorite::before{
  content: '\e633'
}
.icon-playlist::before{
  content: '\e680'
}
</style>
