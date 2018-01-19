<template>
    <header class="mod_header">
        <i class="music_logo">QQ音乐</i>
        <a href="javascript:;" class="btn_download">下载APP</a>
    </header>
</template>

<script>
export default {
  name:'Header'
}
</script>

<style>
.mod_header{position:relative;height:44px;background:#31c27c;}
.mod_header .music_logo{float:left;display:block;width:90px;height:25px;margin:9px 0 0 10px;background-image:url(https://y.gtimg.cn/mediastyle/mobile/yqq_v5/img/logo.png);background-size:cover;background-repeat:no-repeat;text-indent:-9999px}
.mod_header .btn_download{position:absolute;display:inline-block;right:10px;top:8px;height:28px;padding:0 12px;line-height:28px;border-radius:99px;font-size:14px;background:#149c5a;color:#fff}

</style>

