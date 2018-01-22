<template>
    <div class="rank" ref="rank">
        <scroll :data="rankList" class="toplist" ref="rankList">
            <ul>
                <li class="item" v-for="item in rankList" :key="item.id" @click="selectItem(item)">
                    <div class="icon">
                        <img width="100" height="100" v-lazy="item.picUrl"/>
                    </div>
                    <ul class="songList">
                        <li class="title">{{item.topTitle}}</li>
                        <li class="song" v-for="(song,index) in item.songList" :key="index">
                            <span>{{index+1}}</span>
                            <span>{{song.songname}}-{{song.singername}}</span>          
                        </li>
                    </ul>
                </li> 
            </ul>
            <loading v-show="!rankList.length>0"></loading>
        </scroll>
        <router-view></router-view>
    </div>
</template>

<script>
import {getTopList} from '@/api/rank'
import {ERR_OK} from '@/api/config'
import Scroll from '@/base/scrollview'
import Loading from '@/base/loading'
import {playListMixin} from '@/assets/js/mixin'
import {mapMutations} from 'vuex'

export default {
    mixins:[playListMixin],
    data(){
        return{
            rankList:[]
        }
    },
    created(){
        this._getTopList()
    },
    methods:{
        _getTopList(){
            getTopList().then((res)=>{
                if(res.code==ERR_OK){
                    this.rankList=res.data.topList
                }
            })
        },
        handlePlayList(playlist){
            const bottom=playlist.length?'60px':''
            this.$refs.rank.style.bottom=bottom
            this.$refs.rankList.refresh()
        },
        selectItem(item){
            this.$router.push({
                path:'/rank/'+item.id
            })
            this.setRankList(item)
        },
        ...mapMutations({
            setRankList:'SET_RANK_LIST'
        })
    },
    components:{
        Scroll,
        Loading
    }
}
</script>

<style scoped>
.rank{
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
}
.rank .toplist{
    height: 100%;
    overflow: hidden;
    margin: 10px
}
.rank .item{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    height: 100px;
    margin-bottom: 10px
}
.rank .item .icon{
    -webkit-box-flex: 0;
    -ms-flex: 0 0 100px;
    flex: 0 0 100px;
    width: 100px;
    height: 100px;
}
.rank .item .songList{
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    padding: 0 20px;
    height: 100px;
    overflow: hidden;
    background: #fff;
    color:#000;
    font-size: 12px;
}
.rank .item .songList .title{
    font-size: 16px;
    color: #000;
    font-weight: normal;
}
.rank .item .songList .song{
    font-size: 14px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    line-height: 24px;
}
</style>


