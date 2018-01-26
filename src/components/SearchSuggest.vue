<template>
        <scroll class="suggest" :data="result" :pullUp="true" @scrollToEnd="searchMore" ref="scroll">
            <ul class="suggest-list" >                
                <li v-for="item in result" :key="item.id" @click="selectItem(item)">
                    <div v-if="item.type==='singer'">
                        <span class="media avatar"><img :src="getSingerAvatar(item.singermid)"></span>
                        <h6 class="main_tit" v-html="item.singername"></h6>
                        <p class="sub_tit"><span>单曲：{{item.songnum}}</span><span>专辑：{{item.albumnum}}</span></p>
                    </div>
                    <div v-else>
                        <i class="icon"></i>
                        <h6 class="main_tit" v-html="item.songname"></h6>
                        <p class="sub_tit">
                            <span v-for="singer in item.singer" :key="singer.id" v-html="singer.name"></span>
                        </p>
                    </div>
                </li>
                <loading v-show="showLoading" title=""></loading>
            </ul>
            <div v-show="result.length<=0 && !hasMore &&query">
                <no-result></no-result>
            </div>
        </scroll>
</template>

<script>
import {search} from '@/api/search'
import {ERR_OK} from '@/api/config'
import Scroll from '@/base/scrollview'
import Loading from '@/base/loading'
import {mapMutations,mapActions} from 'vuex'
import {createSong} from '@/assets/js/song'
import NoResult from '@/base/noResult'

export default {
    props:{
        query:{
            type:String,
            default:''
        },
        showSinger:{
            type:Number,
            default:1
        }
    },
    data(){
        return{
            page:1,
            result:[],
            hasMore:true,
            showLoading:false
        }
    },
    methods:{
        _search(){
            this.hasMore=true
            this.showLoading=true
            search(this.query,this.page,this.showSinger).then((res)=>{
                if(res.code===ERR_OK){
                    this.result=this._genResult(res.data)
                    this._checkMore(res.data)
                }
            })
        },
        searchMore(){
            if(!this.hasMore){
                return
            }
            this.page++
            search(this.query,this.page,this.showSinger).then((res)=>{
                if(res.code===ERR_OK){
                    this.result=this.result.concat(this._genResult(res.data))
                    this._checkMore(res.data)
                }
            })
        },
        _checkMore(data){
            const song=data.song
            if(!song.list.length || (song.curnum+song.curpage*20)>song.totalnum){
                this.hasMore=false
                this.showLoading=false
            }else{
                this.hasMore=true
                this.showLoading=true
            }
        },
        _genResult(data){
            let ret=[]
            if(data.zhida && data.zhida.singerid){
               ret.push({...data.zhida, ...{type: 'singer'}})
            }
            if(data.song){
                ret=ret.concat(data.song.list)
            }
            return ret
        },
        getSingerAvatar(singermid){
            return `https://y.gtimg.cn/music/photo_new/T001R68x68M000${singermid}.jpg?max_age=2592000`
        },
        selectItem(item){
            if(item.type==='singer'){
                const singer = {
                    id: item.singermid,
                    name: item.singername,
                    avatar:`https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.singermid}.jpg?max_age=2592000`
                }
                this.$router.push({
                    path: `/search/${singer.id}`
                })
                this.setSinger(singer)
            }else{
                let song=createSong(item)
                this.insertSong(song)
            }
        },
        ...mapMutations({
            setSinger:'SET_SINGER'
        }),
        ...mapActions([
            'insertSong'
        ])
    },
    watch:{
        query(newQuery){
            this.$refs.scroll.scrollTo(0,0)
            this.page=1
            this._search()
            
        }
    },
    components:{
        Scroll,
        Loading,
        NoResult
    }
}
</script>

<style scoped>
.suggest{
    height: 100%;
    overflow: hidden;
    position: relative;
}
.suggest>div{
    position: relative;
    overflow: hidden;
    height: 100%;
}
.suggest .suggest-list{
    background: #fff
}
.suggest .suggest-list li {
   position: relative;
    height: 55px;
    padding-left: 56px;
    overflow: hidden;
}
.suggest .suggest-list .icon {
    position: absolute;
    top: 18px;
    left: 18px;
    width: 22px;
    height: 20px;
    background-position: 0 0;
    background-image: url(https://y.gtimg.cn/mediastyle/mobile/yqq_v5/img/search_sprite.png?max_age=19830212&d=20151105145423);
    background-repeat: no-repeat;
    background-size: 22px 30px;
}
.suggest .suggest-list .main_tit {
    margin: 10px 0 2px;
    line-height: 18px;
    font-size: 16px;
    font-weight: normal;
    color: #000;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.suggest .suggest-list .sub_tit {
    color: #808080;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.suggest .suggest-list li::after {
    content: "";
    position: absolute;
    height: 1px;
    top: 0;
    left: 0;
    right: 0;
    background: #e5e5e5;
}
.suggest-list .media {
    position: absolute;
    top: 8px;
    left: 8px;
    width: 40px;
    height: 40px;
}
.suggest-list li .media img {
    display: block;
    width: 100%;
    border-radius: 50%
}
</style>


