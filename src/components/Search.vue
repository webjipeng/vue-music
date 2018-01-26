<template>
    <div>
        <div class="search">
            <div class="search-box-wrapper">
                <search-box ref="searchBox" @query="queryChange"></search-box>
            </div>
        </div>
        <div id="hot_keys" class="mod_search_result" v-show="!query">
            <h3 class="result_tit">热门搜索</h3>
            <div class="result_tags">
                <a href="javascript:;" class="js_keyword tag_s"
                @click="addQuery(item.k)"
                 v-for="item in hotKeys" :key="item.n">{{item.k}}
                </a>
            </div>
        </div>
        <div class="search-suggest-wrapper">
            <search-suggest :query="query"></search-suggest>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
import SearchBox from '@/base/searchBox'
import {getHotKey} from '@/api/search'
import {ERR_OK} from '@/api/config'
import SearchSuggest from './SearchSuggest'

export default {
    data(){
        return{
            hotKeys:[],
            query:''
        }
    },
    components:{
        SearchBox,
        SearchSuggest
    },
    created(){
        this._getHotKey()
    },
    methods:{
        _getHotKey(){
            getHotKey().then((res)=>{
                if(res.code===ERR_OK){
                   this.hotKeys=res.data.hotkey.slice(0,10)
                }
            })
        },
        addQuery(query){
            this.$refs.searchBox.setQuery(query)
        },
        queryChange(query){
            this.query=query
        }
    }
}
</script>


<style scoped>
body{
    background: #fff;
}
.mod_search_result {
    background: #fff;
    padding: 15px 15px 10px 15px;
}
.mod_search_result .result_tit {
    color: rgba(0,0,0,.6);
    margin-bottom: 8px;
}
.mod_search_result .tag_s {
    display: inline-block;
    font-size: 14px;
    padding: 0 10px;
    height: 30px;
    line-height: 30px;
    color: #000;
    border: 1px solid rgba(0,0,0,.6);
    border-radius: 99px;
    word-break: keep-all;
    margin-bottom: 10px;
    margin-right: 14px;
}
.mod_search_result .tag_hot {
    color: #fc4524;
    border-color: #fc4524;
}

.search-suggest-wrapper{
    position: fixed;
    width: 100%;
    bottom: 0;
    top: 140px;
}
</style>

