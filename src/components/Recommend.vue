<template>
    <div>
        <scroll ref="scroll" :data="dissList" class="recommend">
            <div>
                <div class="swiper_container">
                    <mt-swipe  ref="swipe" class="swipe" :auto="3000" :stopPropagation="true">
                        <mt-swipe-item v-for="banner in banners" :key="banner.id">
                            <a :href="banner.linkUrl">
                                <img :src="banner.picUrl" @load="bannerLoad"/>
                            </a>  
                        </mt-swipe-item>
                    </mt-swipe>
                </div>
                <div class="mod_twocol_list mod_twocol_list_normal">
                    <h2 class="list_title">推荐歌单</h2>
                            <ul id="radio_wrapper" class="list_container">
                                <li data-tjname="recom_radio" class="js_play_radio" v-for="item in dissList" :key="item.id" @click="selectItem(item)">
                                    <a class="list_main" href="javascript:;">
                                        <div class="list_media">
                                            <img v-lazy="item.imgurl">
                                        </div>
                                        <div class="list_info">
                                            <h3 class="list_tit tit_two_row">{{item.dissname}}</h3>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                </div>
            </div>
            <div class="loading-container" v-show="!dissList.length">
                <loading></loading>
            </div>
        </scroll>
        <router-view></router-view>
    </div>
</template>

<script>
import {getRecommend,getDissList} from '@/api/recommend'
import {ERR_OK} from '@/api/config'
import Vue from 'vue'
import { Swipe, SwipeItem } from 'mint-ui';
import Scroll from '@/base/scrollview'
import Loading from '@/base/loading'
import {playListMixin} from '@/assets/js/mixin'
import {mapMutations} from 'vuex'

Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);

export default {
    mixins:[playListMixin],
    name:'Recommend',
    components:{
        Scroll,
        Loading
    },
    data() {
        return {
            banners:[],
            dissList:[],
            checkLoaded:false
        }
    },
    created() {
        this._getRecommend()
        this._getDissList()
    },
    methods: {
        selectItem(item){
            this.$router.push({
                path:`/recommend/${item.dissid}`
            })
            this.setDisc(item)
        },
        handlePlayList(playList){
            const bottom=playList.length>0?'60px':''
            this.$refs.scroll.$el.style.bottom=bottom
            this.$refs.scroll.refresh()
        },
        _getRecommend() {
            getRecommend().then((res)=>{
                if(res.code===ERR_OK){
                    this.banners=res.data.slider
                }
            })
         },
        _getDissList(){
            getDissList().then((res)=>{
                if(res.code===ERR_OK){
                    this.dissList=res.data.list;
                }
            })
        },
        bannerLoad(){
            if(!this.checkLoaded){
                this.$refs.scroll.refresh()
                this.checkLoaded=true
            }
           
        },
        ...mapMutations({
            setDisc:'SET_DISC'
        }),

    }
}
</script>

<style scoped>
.loading-container{padding-top: 40px;}
.recommend{position: fixed;width: 100%;top: 88px;bottom: 0;z-index: -1}
.swiper_container{height: 150px;}
.swiper_container img{width: 100%}

.mod_twocol_list{margin-left:10px;margin-right:10px}
.mod_twocol_list .list_title{font-size:16px;color:#000;margin-bottom:11px;font-weight:normal}
.mod_twocol_list .list_container{overflow:hidden;margin-right:-8px}
.mod_twocol_list li{float:left;width:50%;-webkit-box-sizing:border-box;padding-right:8px;margin-bottom:10px;overflow:hidden}
.mod_twocol_list li .list_main{display:block;background:#fff}
.mod_twocol_list li .list_media{position:relative;margin-bottom:5px}
.mod_twocol_list li .list_media .icon_play,.mod_twocol_list li .list_media .listen_count{position:absolute;display:block;z-index:10}
.mod_twocol_list li .list_media .icon_play,.mod_twocol_list li .list_media .icon_listen{background-image:url(https://y.gtimg.cn/mediastyle/mobile/yqq_v5/img/list_sprite.png);background-repeat:no-repeat;background-size:24px 60px}
.mod_twocol_list li .list_media .icon_play{height:24px;bottom:5px;right:5px;width:24px;background-position:0 0}
.mod_twocol_list li .list_media .listen_count{left:5px;bottom:7px;display:block;line-height:12px;color:#fff}
.mod_twocol_list li .list_media .icon_listen{display:block;float:left;width:10px;height:10px;background-position:0 -50px;margin-right:5px}
.mod_twocol_list li .list_pic{display:block;width:100%}
.mod_twocol_list li .list_media::before{content:"";display:block;padding-top:100%}
.mod_twocol_list li .list_media img{position:absolute;top:0;left:0;display:block;width:100%;z-index:1}
.mod_twocol_list li .list_info{padding:0 7px 5px;color:#000}
.mod_twocol_list li .list_tit,.mod_twocol_list li .list_text{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:normal;font-size:12px}
.mod_twocol_list li .list_tit{font-size:14px}
.mod_twocol_list li .list_text{font-size:12px}
.mod_twocol_list_normal li .list_tit{height:36px;line-height:18px;white-space:normal;word-wrap:break-word}
.mod_twocol_list_special li .list_media::after{content:"";position:absolute;left:0;bottom:0;width:100%;height:42px;z-index:2;background-image:url(https://y.gtimg.cn/mediastyle/mobile/yqq_v5/img/shadow_rp.png);background-size:1px 42px;background-repeat:repeat-x}
.mod_twocol_list_special li .list_media .icon_play{background-position:0 0}
.mod_twocol_list .list_more{height:40px;line-height:40px;text-align:center}
.mod_twocol_list .list_more a{display:inline-block;padding:0 10px;font-size:14px;color:rgba(0,0,0,.6)}
</style>


