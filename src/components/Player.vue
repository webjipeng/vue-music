<template>
  <div class="player" v-show="playList.length>0">
    <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @afterLeave="afterLeave">
    <div class="normal-player" v-show="fullScreen">
        <div class="background">
            <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
            <div class="back" @click="back">
                <i class="icon-back"></i>
            </div>
            <h1 class="title" v-html="currentSong.name"></h1>
            <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle" @touchstart.prevent="middleTouchStart" @touchmove.prevent="middleTouchMove" @touchend.prevent="middleTouchEnd">
            <div class="middle-l" ref="middleL">
                <div class="cd-wrapper" ref="cdwrapper">
                    <div class="cd" :class="cdCls">
                        <img class="image" :src="currentSong.image">
                    </div>
                </div>
                <div class="playing-lyric-wrapper">
                    <div class="playing-lyric">{{playingLyric}}</div>
                </div>
            </div>
            <scroll class="middle-r" ref="lyricList" :data="currentLyric&&currentLyric.lines">
                <div class="lyric-wrapper">
                    <div v-if="currentLyric">
                        <p ref="lyricLine" class="text" v-for="(line,index) in currentLyric.lines" :key="index" :class="{'current':currentLyricLineNum===index}">{{line.txt}}</p>
                    </div>
                </div>
            </scroll>
        </div>
        <div class="bottom">
            <div class="dot-wrapper">
                <span class="dot" :class="{'active':currentShow==='cd'}"></span>
                <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
            </div>
            <div class="progress-wrapper">
                <span class="time time-l">{{format(currentTime)}}</span>
                <div class="progress-bar-wrapper">
                    <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
                </div>
                <span class="time time-r">{{format(currentSong.duration)}}</span>
            </div>
            <div class="operators">
                <div class="icon i-left" @click="changeMode">
                    <i :class="iconMode"></i>
                </div>
                <div class="icon i-left">
                    <i class="icon-prev" @click="prev"></i>
                </div>
                <div class="icon i-center">
                    <i :class="playIcon" @click="togglePlaying"></i>
                </div>
                <div class="icon i-right">
                    <i class="icon-next" @click="next"></i>
                </div>
                <div class="icon i-right">
                    <i class="icon icon-not-favorite"></i>
                </div>
            </div>
        </div>
    </div>
    </transition>
    <transition name="mini">
    <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
            <div class="image-wrapper">
                <img width="40" height="40" :src="currentSong.image" :class="cdCls">
            </div>
        </div>
        <div class="text">
            <h2 class="name">{{currentSong.name}}</h2>
            <p class="desc">{{currentSong.singer}}</p>
        </div>
        <div class="control">
            <i :class="playIcon" @click.stop="togglePlaying" ></i>
        </div>
        <div class="control">
            <i class="icon-playlist"></i>
        </div>
    </div>
    </transition>
    <audio :src="currentSong.url" ref="audio" @canplay="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
  </div>
</template>

<script>
import {mapGetters,mapMutations} from 'vuex'
import animations from 'create-keyframe-animation'
import ProgressBar from '@/base/progressbar'
import {playMode} from '@/assets/js/config'
import {randomList} from '@/assets/js/utils'
import Lyric from 'lyric-parser'
import Scroll from '@/base/scrollview'
//import ProgressCircle from '@/base/progressCircle'

export default {
    data(){
        return{
            songReady:false,
            currentTime:0,
            currentLyric:null,
            currentLyricLineNum:0,
            currentShow:'cd',
            playingLyric:''
        }
    },
    created(){
        this.touch={}
    },
    computed:{
        ...mapGetters([
            'fullScreen',
            'playList',
            'currentSong',
            'playing',
            'currentIndex',
            'mode',
            'sequenceList'
        ]),
        playIcon(){
            return this.playing?'icon-pause':'icon-play'
        },
        cdCls(){
            return this.playing?'play':'play pause'
        },
        percent(){
            return this.currentTime/this.currentSong.duration
        },
        iconMode(){
            return this.mode===playMode.sequence?'icon-sequence':this.mode===playMode.loop?'icon-loop':'icon-random'
        }
    },
    methods:{
        ...mapMutations({
            setFullScreen:'SET_FULL_SCREEN',
            setPlayingState:"SET_PLAYING_STATE",
            setCurrentIndex:'SET_CURRENT_INDEX',
            setPlayMode:'SET_PLAY_MODE',
            setPlayList:'SET_PLAYLIST'
        }),
        end(){
            if(this.mode===playMode.loop){
                this.loop()
            }else{
                this.next()
            }
        },
        loop(){
            this.$refs.audio.currentTime=0
            this.$refs.audio.play()
            if(this.currentLyric){
                this.currentLyric.seek(0)
            }
        },
        changeMode(){
            const mode=(this.mode+1)%3
            this.setPlayMode(mode)
            let list = null
            if(mode==playMode.random){
                list=randomList(this.sequenceList)
            }else{
                list=this.sequenceList
            }            
            this.resetCurrentIndex(list)
            this.setPlayList(list)
        },
        resetCurrentIndex(list){
            let index=list.findIndex((item)=>{
                return item.id==this.currentSong.id
            })
            this.setCurrentIndex(index)
        },
        onProgressBarChange(percent){
            const currentTime=this.currentSong.duration*percent
            this.$refs.audio.currentTime=currentTime
            if(!this.playing){
                this.togglePlaying()
            }
            if(this.currentLyric){
                this.currentLyric.seek(currentTime*1000)
            }
        },
        togglePlaying(){
            if(!this.songReady){
                return
            }
            this.setPlayingState(!this.playing)
            if(this.currentLyric){
                this.currentLyric.togglePlay()
            }
        },
        prev(){
            if(!this.songReady) return
            if(this.playList.length===1){
                this.loop()
            }else{
                let index=this.currentIndex-1
                if(index=== -1){
                    index=this.playList.length-1
                }
                this.setCurrentIndex(index)
                if(!this.playing){
                    this.togglePlaying()
                }
            }
            this.songReady=false
        },
        next(){
            if(!this.songReady) return
            if(this.playList.length===1){
                this.loop()
            }
            else{
                 let index=this.currentIndex+1
                if(index===this.playList.length){
                    index=0
                }
                this.setCurrentIndex(index)
                if(!this.playing){
                    this.togglePlaying()
                }
            }
           this.songReady=false
        },
        ready(){
            this.songReady=true
        },
        error(){
            this.songReady=true
        },
        updateTime(e){
            this.currentTime=e.target.currentTime
        },
        back(){
            this.setFullScreen(false)
        },
        open(){
            this.setFullScreen(true)
        },
        enter(el,done){
            const {x,y,scale}=this._getPosAndScale()
            let animation={
                0:{
                    transform:`translate3d(${x}px,${y}px,0) scale(${scale})`
                },
                60:{
                    transform:`translate3d(0,0,0) scale(1.1)`
                },
                100:{
                    transform:`translate3d(0,0,0) scale(1)`
                }
            }
            animations.registerAnimation({
                name:'move',
                animation,
                presets:{
                    duration:400,
                    easing:'linear'
                }
            })
            animations.runAnimation(this.$refs.cdwrapper,'move',done)
        },
        afterEnter(){
            animations.unregisterAnimation('move')
            this.$refs.cdwrapper.style.animation=''
        },
        leave(el,done){
            this.$refs.cdwrapper.style.transition='all 0.4s'
            const {x,y,scale}=this._getPosAndScale()
            this.$refs.cdwrapper.style.transform=`translate3d(${x}px,${y}px,0) scale(${scale})`
            this.$refs.cdwrapper.addEventListener('transitionend',done)
        },
        afterLeave(){
            this.$refs.cdwrapper.style.transition=''
            this.$refs.cdwrapper.style.transform=''            
        },
        _getPosAndScale(){
            const targetWidth=40
            const paddingLeft=40
            const paddingBottom=30
            const paddingTop=80
            const width=window.innerWidth*0.8
            const scale=targetWidth/width
            const x=-(window.innerWidth/2-paddingLeft)
            const y=window.innerHeight-paddingTop-width/2-paddingBottom
            return{
                x,
                y,
                scale
            }
        },
        format(interval){
            interval=interval | 0
            const minute=interval/60 | 0
            let second=interval%60
            second=second>9?second:'0'+second
            return `${minute}:${second}`
        },
        handleLyric({lineNum,txt}){
            this.currentLyricLineNum=lineNum
            if(lineNum>5){
                let lineEl=this.$refs.lyricLine[lineNum-5]
                this.$refs.lyricList.scrollToElement(lineEl,1000)
            }else{
                this.$refs.lyricList.scrollTo(0,0,1000)
            }
            this.playingLyric=txt
        },
        middleTouchStart(e){
            this.touch.initiated=true
            this.touch.startX=e.touches[0].pageX
            this.touch.startY=e.touches[0].pageY
        },
        middleTouchMove(e){
            if(!this.touch.initiated){
                return
            }
            const touch=e.touches[0]
            const deltaX=touch.pageX-this.touch.startX
            const deltaY=touch.pageY-this.touch.startY
            if(Math.abs(deltaY)>Math.abs(deltaX)){
                return
            }
            const left=this.currentShow==='cd'?0:-window.innerWidth
            const offsetWidth=Math.min(0,Math.max(-window.innerWidth,left+deltaX))
            this.touch.percent=Math.abs(offsetWidth/window.innerWidth)
            this.$refs.lyricList.$el.style.transform=`translate3d(${offsetWidth}px,0,0)`
            this.$refs.lyricList.$el.style.transitionDuration='300ms'
            this.$refs.middleL.style.opacity=1-this.touch.percent
            this.$refs.middleL.styletransitionDuration='300ms'
        },
        middleTouchEnd(){
            let offsetWidth
            let opacity
            if(this.currentShow==='cd'){
                if(this.touch.percent>0.1){
                    offsetWidth=-window.innerWidth
                    this.currentShow='lyric'
                    opacity=0
                }else{
                    offsetWidth=0
                    opacity=1
                }
            }else{
                if(this.touch.percent<0.9){
                    offsetWidth=0
                    this.currentShow='cd'
                    opacity=1
                }else{
                    offsetWidth=-window.innerWidth
                    opacity=0
                }
            }
            this.$refs.lyricList.$el.style.transform=`translate3d(${offsetWidth}px,0,0)`
            this.$refs.lyricList.$el.style.transitionDuration='300ms'
            this.$refs.middleL.style.opacity=opacity
            this.$refs.middleL.style.transitionDuration='300ms'
        }
    },
    watch:{
        currentSong(newSong,oldSong){
            if(newSong.id===oldSong.id){
                return;
            }
            if(this.currentLyric){
                this.currentLyric.stop()
            }
            setTimeout(()=>{
                this.$refs.audio.play()
                this.currentSong.getLyric().then((lyric)=>{
                    this.currentLyric=new Lyric(lyric,this.handleLyric)
                    if(this.playing){
                        this.currentLyric.play()
                    }
                }).catch(()=>{
                    this.currentLyric=null
                    this.playingLyric=''
                    this.currentLyricLineNum=0
                })
            },1000)
        },
        playing(newPlaying){
            const audio = this.$refs.audio
            this.$nextTick(()=>{
                newPlaying?audio.play():audio.pause()
            })
        }
    },
    components:{
        ProgressBar,
        Scroll
    }
}
</script>

<style scoped>

.icon-mini{font-size:32px;position: absolute;left: 1px;top: -6px }
.normal-enter-active,.normal-leave-active{
    transition: all .4s
}
.normal-enter-active .top,
.normal-enter-active .bottom,
.normal-leave-active .top,
.normal-leave-active .bottom{
    transition: all .4s cubic-bezier(0.86,0.18,0.82,1.32)
}
.normal-enter,.normal-leave-to{
    opacity: 0;
}
.normal-enter .top,.normal-leave-to .top{
    transform: translate3d(0,-100px,0)
}
.normal-enter .bottom,.normal-leave-to .bottom{
    transform: translate3d(0,100px,0)
}

.mini-enter-active,.mini-leave-active{
    transition: all .4s
}
.mini-enter,.mini-leave-to{
    opacity: 0;
}

.player .normal-player{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: #222;
}
.player .mini-player{
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 40px;
    padding: 10px 0;
    background: #333;
    display: flex
}
.player .normal-player .background{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: .6;
    -webkit-filter: blur(20px);
    filter: blur(20px);
}
.player .normal-player .top{
    position: relative;
    margin-bottom: 25px;
}
.player .normal-player .top .back{
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;
}
.player .normal-player .icon-back{
    display: block;
    font-family: 'iconfont';
    padding: 9px;
    font-size: 22px;
    color: #31c27c;
    font-style: normal
}
.player .normal-player .icon-back::after{
    content: '\e65b'
}
.player .normal-player .title{
    width: 70%;
    margin: 0 auto;
    line-height: 40px;
    text-align: center;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-size: 18px;
    color: #fff;
}
.player .normal-player .subtitle{
    line-height: 20px;
    text-align: center;
    font-size: 14px;
    color: #fff;
}
.player .normal-player .middle{
    position: fixed;
    width: 100%;
    top: 80px;
    bottom: 170px;
    white-space: nowrap;
    font-size: 0;
}
.player .normal-player .middle-l{
    display: inline-block;
    vertical-align: top;
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 80%;
}
.player .normal-player .middle-l .cd-wrapper{
    position: absolute;
    left: 10%;
    top: 0;
    width: 80%;
    box-sizing: border-box;
    height: 100%;
}  
.player .normal-player .middle-l .cd-wrapper .cd{
    width: 100%;
    height: 100%;
    border-radius: 50%;
}  
.player .normal-player .middle-l .cd-wrapper .image{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border-radius: 50%;
    border: 10px solid hsla(0,0%,100%,.1);
}
.player .normal-player .middle-l .cd-wrapper  .play,.mini-player .play{
    animation: rotate 20s linear infinite
}  
.player .normal-player .middle-l .cd-wrapper  .pause,.mini-player .pause{
    animation-play-state: paused
}  
.player .normal-player .middle-r{
    display: inline-block;
    vertical-align: top;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.player .normal-player  .middle-r .lyric-wrapper{
    width: 80%;
    margin: 0 auto;
    overflow: hidden;
    text-align: center;
}
.player .normal-player  .middle-r .lyric-wrapper .text{
    line-height: 32px;
    color: hsla(0,0%,100%,.5);
    font-size: 14px;
}
.player .normal-player  .middle-r .lyric-wrapper .text.current{
    color: #fff;
}
.player .normal-player  .middle-l .playing-lyric-wrapper{
    width: 80%;
    margin: 30px auto 0;
    overflow: hidden;
    text-align: center;
}
.player .normal-player  .middle-l .playing-lyric-wrapper .playing-lyric{
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    color: hsla(0,0%,100%,.5);
}
    
.player .normal-player .bottom{
    position: absolute;
    bottom: 50px;
    width: 100%;
}
.player .normal-player .bottom .dot-wrapper{
    text-align: center;
    font-size: 0;
}
.player .normal-player .bottom .dot-wrapper .dot{
    display: inline-block;
    vertical-align: middle;
    margin: 0 4px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: hsla(0,0%,100%,.5);
}
.player .normal-player .bottom .dot-wrapper .dot.active{
    width: 20px;
    border-radius: 5px;
    background: hsla(0,0%,100%,.8);
}
.player .normal-player .bottom .progress-wrapper{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    width: 80%;
    margin: 0 auto;
    padding: 10px 0;
}
.player .normal-player .bottom .progress-wrapper .time{
    color: #fff;
    font-size: 12px;
    -webkit-box-flex: 0;
    -ms-flex: 0 0 30px;
    flex: 0 0 30px;
    line-height: 30px;
    width: 30px;
}
.player .normal-player .bottom .progress-wrapper .time-l{
    text-align: left;
}
.player .normal-player .bottom .progress-wrapper .time-r{
    text-align: right;
}
.player .normal-player .bottom .progress-wrapper .progress-bar-wrapper{
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
}
.progress-bar{
    height: 30px;
}
.player .normal-player .bottom .operators{
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
}
.player .normal-player .bottom .operators .icon{
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    color: #31c27c;
    font-family: 'iconfont'
}
.player .normal-player .bottom .operators .icon i{
    font-size: 40px;
    font-family:"iconfont" !important;
   font-style:normal;
   -webkit-font-smoothing: antialiased;
   -webkit-text-stroke-width: 0.2px;
   -moz-osx-font-smoothing: grayscale;
}
.player .normal-player .bottom .operators .i-left{
    text-align: right;
}
.player .normal-player .bottom .operators .i-right{
    text-align: left;
}
.player .normal-player .bottom .operators .i-center{
    text-align: center;
}

.player .mini-player .icon{
    -webkit-box-flex: 0;
    -ms-flex: 0 0 40px;
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
    padding: 0 10px 0 20px;
}
.player .mini-player .image-wrapper{
    width: 100%;
    height: 100%
}
.player .mini-player .image-wrapper img{
    border-radius: 50%
}
.player .mini-player .text{
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
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    line-height: 20px;
    overflow: hidden;
}
.player .mini-player .text .name{
    margin-bottom: 2px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-size: 14px;
    color: #fff;
}
.player .mini-player .text .desc{
    margin-bottom: 2px;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    color: rgb(255, 255, 255,.3);
    overflow: hidden;
}
.player .mini-player .control{
    -webkit-box-flex: 0;
    -ms-flex: 0 0 30px;
    flex: 0 0 30px;
    width: 30px;
    padding: 0 10px;
    font-family: "iconfont"
}
.player .mini-player .control i{
    font-size: 30px;
    font-style: normal;
    color: #31c27c
}
@keyframes rotate {
    0%{
        transform: rotate(0)
    }
    100%{
        transform: rotate(360deg)
    }
}
</style>

