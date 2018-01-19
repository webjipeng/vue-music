<template>
    <div class="music-list">
        <div class="back">
            <i class="icon-back" @click="back">&lt;</i>
        </div>
        <h1 class="title">{{title}}</h1>
        <div class="bg-image" :style="bgStyle" ref="bgImage">
            <div class="play-wrapper">
                <div class="play" v-show="songs.length>0" ref="playBtn" @click="randomPlayClick">
                    <i class="icon-play"></i>
                    <span class="text">随机播放全部</span>
                </div>
            </div>
            <div class="filter" ref="fliter"></div>
        </div>
        <div class="bg-layer" ref="bglayer"></div>
        <scroll :data="songs" class="list" ref="list" :probeType="probeType" :listen-scroll="listenScroll" @scroll="scroll">
            <div class="song-list-wrapper">
                <song-list :songs="songs" @select="selectMusic"></song-list>
            </div>
            <div class="loading-container">
                <loading></loading>
            </div>
        </scroll>
    </div>
</template>

<script>
import Scroll from '@/base/scrollview'
import SongList from '@/base/songlist'
import Loading from '@/base/loading'
import {mapActions} from 'vuex'
import {playListMixin} from '@/assets/js/mixin'

const TOP_HEIGHT=40

export default {
    mixins:[playListMixin],
    props:{
        bgImage:{
            type:String,
            default:''
        },
        songs:{
            type:Array,
            default:[]
        },
        title:{
            type:String,
            default:''
        }
    },
    data(){
        return {
            scrollY:0
        }
    },
    created(){
        this.probeType=3,
        this.listenScroll=true
    },
    computed:{
        bgStyle(){
            return `background-image:url(${this.bgImage})`
        }
    },
    methods:{
        handlePlayList(playList){
            const bottom=playList.length>0?'60px':''
            this.$refs.list.$el.style.bottom=bottom
            this.$refs.list.refresh()
        },
        scroll(pos){
            this.scrollY=pos.y;
        },
        back(){
            this.$router.back()
        },
        selectMusic(item,index){
            this.selectPlay({
                list:this.songs,
                index
            })
        },
        randomPlayClick(){
            this.randomPlay({
                list:this.songs
            })
        },
        ...mapActions([
            'selectPlay',
            'randomPlay'
        ])
    },
    mounted(){
        this.imageHeight=this.$refs.bgImage.clientHeight
        this.minTranslateY=-this.imageHeight+TOP_HEIGHT
        this.$refs.list.$el.style.top=`${this.imageHeight}px`
    },
    watch:{
        scrollY(newY){
            let translateY=Math.max(this.minTranslateY,newY)
            let zIndex=0
            let scale=1
            let blur=0
            this.$refs.bglayer.style['transform']=`translate3d(0,${translateY}px,0)`
            this.$refs.bglayer.style['webkitTransform']=`translate3d(0,${translateY}px,0)`
            const percent=Math.abs(newY/this.imageHeight)
            if(newY>0){
                scale=1+percent
                zIndex=10
            }else{
                blur=Math.min(20*percent,20)
            }
            this.$refs.fliter.style['backdrop-filter']=`blur(${blur}px)`
            if(newY<this.minTranslateY){
                zIndex=10
                this.$refs.bgImage.style.height=`${TOP_HEIGHT}px`
                this.$refs.bgImage.style.paddingTop=0
                this.$refs.playBtn.style.display="none"
            }else{
                this.$refs.bgImage.style.height=0
                this.$refs.bgImage.style.paddingTop='70%'
                this.$refs.playBtn.style.display="block"
            }
            this.$refs.bgImage.style.zIndex=zIndex
            this.$refs.bgImage.style['transform']=`scale(${scale})`
            this.$refs.bgImage.style['webkitTransform']=`scale(${scale})`
        }
    },
    components:{
        Scroll,
        SongList,
        Loading
    }
    
}
</script>
<style scoped>
.music-list{position: fixed;z-index: 100;top: 0;left: 0;bottom: 0;right: 0;background: #222;}
.music-list .back{position: absolute;z-index: 50;top: 0;left:6px }
.music-list .title{position: absolute;top: 0;left: 10%;z-index: 40; width: 80%;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;text-align: center;line-height: 40px;font-size: 18px;color: #fff;}
.music-list .bg-image{position: relative;width: 100%;height: 0;padding-top: 70%;background-size: cover;transform-origin: top;}
.bg-image .filter{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(7,17,27,.3);
}
.music-list .icon-back{display: block;padding: 10px;font-size: 22px;color: #31c27c;}

.song-list-wrapper{
        padding: 20px 30px;
}
.list{
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    background: #f4f4f4;
}
.bg-layer{
    position: relative;
    height: 100%;
    background: #f4f4f4;
}
.music-list .bg-image .play-wrapper {
    position: absolute;
    bottom: 20px;
    z-index: 50;
    width: 100%;

}
.music-list .bg-image .play-wrapper .play {
    box-sizing: border-box;
    width: 135px;
    padding: 7px 0;
    margin: 0 auto;
    text-align: center;
    border: 1px solid #31c27c;
    color: #31c27c;
    border-radius: 100px;
    font-size: 0;
}
.music-list .bg-image .play-wrapper .play .icon-play{
    display: inline-block;
    vertical-align: -7px;
}
.music-list .bg-image .play-wrapper .play .icon-play::before {
    content: "";
    display: inline-block;
    height: 0;
    width: 0;
    margin-right: -3px;
    border-color: transparent transparent transparent #31c27c;
    border-width: 7px 11px;
    border-style: solid;
    border-radius: 2px;
}
.music-list .bg-image .play-wrapper .play .text {
    display: inline-block;
    vertical-align: middle;
    font-size: 12px;
}
</style>
