<template>
    <div class="mod_search_bar">
        <div id="input_wrap" class="search_bar_cont">
            <form id="search_form" method="get" action="#" onsubmit="return false">
                <input id="search_input" class="search_input" type="search" autocomplete="off" style="-webkit-appearance: textfield;" autocorrect="off" placeholder="搜索歌曲、歌单、专辑" v-model="query">
                <span class="icon icon_search">搜索</span>
            </form>
        </div>
        <div id="cancel_btn" class="search_bar_tip_text" v-show='query' @click="query=''">取消</div>
    </div>
</template>

<script>
import {debounce} from '@/assets/js/utils'

export default {
    data(){
        return {
            query:''
        }
    },
    created(){
        this.$watch('query',debounce((newQuery)=>{
            this.$emit('query',newQuery)
        },200))
    },
    methods:{
        setQuery(query){
            this.query=query
        }
    }
}
</script>

<style scoped>
.mod_search_bar {
    background: #f4f4f4;
    padding: 10px;
    display: -webkit-box;
    -webkit-box-orient: horizontal;
    -webkit-box-align: center;
}
.mod_search_bar .search_bar_cont {
    position: relative;
    border-radius: 3px;
    background: #fff;
    height: 20px;
    padding: 8px 12px 8px 35px;
    -webkit-box-flex: 1;
}
.mod_search_bar .search_input {
    height: 20px;
    line-height: 20px;
    width: 100%;
    color: rgba(0,0,0,.3);
    border: none;
    -webkit-appearance: none;
    font-size: 14px;
}
.mod_search_bar .icon_search {
    position: absolute;
    top: 9px;
    left: 10px;
    width: 18px;
    height: 18px;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJlSURBVFhH7ZfRShRRHMb3Jkqzm7wJSrqIIDBxX6C0a62H6C7oqq4ixYreQMmMHkXbjLQeIYgyQuqiyIuotKDt923fyLCszv/MzF5EDnzs2T3/7zffOXNm5myjcXDUOAOtVquJ7qOn6AP6ZamtQ33NGk/ZG8VJJtEaagf1XJ7agwEdRI9zIT7RnkdT6Iz7VaO2flPf51z9I9oDtQQDNIxeGv6Nz9voaBFcNa79bu8LsYp8+/Z75FmYN3w/nwqUB204lFiDqYzd+txlek37RFkQ3pNIjDZaKsXBeMkATfloKUjOBGMMifUbXUzmYVp3oFvJ5j0M8GbNXEtiYtJzRtOru6lwAUfhsIZQdveNR30NTPccaD5sChbCXTD7btDSUCAdmqGpsClYCHPa7CdBSyeQXgEKNBI2BQthnjX7Y9DSCfTTpkNhU7AQ7jGzd4KWvgc67EDbKYH6eclOO9BmSqBsUU+HTcFCwJcdaCVo6Vyy7LZfCJuChbAfONCdoKUTKHsw6iE2FDYWFIqFthxoLImLSZsr3fqzScZ9isUyczWZiXEC6UWoF2LaaHqcDcY4+mHmheRAMmBe8oje8nmqFOQvZwS9N2uxLEcgbUuzDdpGmZnyzLxzGG3yqm1lARxH2VZEUz6DChc6NXoia83I087pRukZyozAjqCHvv6Cf0GL6Ao655MrgNr6TX1bDqF1qO/Xcv7qobymJoA+6xpxfvTd7VVqdxcw7au1h3IwbUfn0DJ6hb6ibbSJVtzX8w9B30JVWQf/QqibVQZYm7drpg5C7TmzuZnSI6JZ2yWoAnKo61UY/5f3Dy7dC4CdAEhQAAAAAElFTkSuQmCC);
    background-repeat: no-repeat;
    background-size: cover;
    text-indent: -999px;
}
.mod_search_bar .icon_delete {
    position: absolute;
    top: 9px;
    right: 12px;
    width: 18px;
    height: 18px;
    background: #b1b1b1;
    text-indent: -9999px;
    border-radius: 99px;
    display: none
}
.mod_search_bar .search_bar_tip_text {
    padding-right: 10px;
    padding-left: 10px;
    font-size: 14px;
    height: 36px;
    line-height: 36px;
}
</style>


