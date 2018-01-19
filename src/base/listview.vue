<template>
    <scroll class="listview" :data="data" ref="listView" :probeType="3" :listenScroll="listenScroll"
    @scroll="scroll">
        <ul>
            <li v-for="group in data" class="list-group" :key="group.id" ref="listGroup">
                <h2 class="list-grour-title">{{group.title}}</h2>
                <ul>
                    <li @click="selectItem(item)" v-for="item in group.items" :key="item.id" class="list-group-item">
                        <img v-lazy="item.avatar" class="avatar"/>
                        <span class="name">{{item.name}}</span>
                    </li>  
                </ul>
            </li>
        </ul>
        <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
            <ul>
                <li  v-for="(item,index) in shortCutList" class="item" :key="index" :data-index="index" :class="{'active':currentIndex==index}">{{item}}</li>
            </ul>
        </div>
        <div class="list-fixed" v-show="fixedTitle" ref="fixed">
            {{fixedTitle}}
        </div>
        <div v-show="!data.length">
            <loading></loading>
        </div>
    </scroll>
</template>

<script>
import Scroll from '@/base/scrollview'
import {getData} from '@/assets/js/dom'
import Loading from '@/base/loading'

const ANCHOR_HEIGHT=18 //锚点高度
const TITLE_HEIGHT=30

export default {
    created(){
        this.touch={},
        this.listenScroll=true
        this.listHeight=[]
    },
    props:{
        data:{
            type:Array,
            default:[]
        }
    },
    data(){
        return {
            scrollY:-1,
            currentIndex:0,
            diff:-1
        }
    },
    computed:{
        shortCutList(){
            return this.data.map((group)=>{
                return group.title.substr(0,1)
            })
        },
        fixedTitle(){
            if(this.scrollY>0){
                return ''
            }
            return this.data[this.currentIndex]?this.data[this.currentIndex].title:''
        }
    },
    methods:{
        refresh(){
            this.$refs.listView.refresh()
        },
        selectItem(item){
            this.$emit("select",item)
        },
        onShortcutTouchStart(e){
            let achorIndex=getData(e.target,'index')
            this.touch.y1=e.touches[0].pageY;
            this.touch.anchorIndex=achorIndex;
            this._scrollTo(achorIndex)
        },
        onShortcutTouchMove(e){
            this.touch.y2=e.touches[0].pageY;
            let delta = (this.touch.y2-this.touch.y1)/ANCHOR_HEIGHT | 0;
            let achorIndex=parseInt(this.touch.anchorIndex)+delta
            this._scrollTo(achorIndex)
        },
        scroll(pos){
            this.scrollY = pos.y
        },
        _scrollTo(achorIndex){
            if(!achorIndex && achorIndex!==0){
                return;
            }
            if(achorIndex<0){
                achorIndex=0
            }else if(achorIndex>this.listHeight.length-2){
                achorIndex=this.listHeight.length-2
            }
            this.scrollY=this.listHeight[achorIndex]
            this.$refs.listView.scrollToElement(this.$refs.listGroup[achorIndex],200)
        },
        _calculateHeight(){
            this.listHeight=[]
            const list = this.$refs.listGroup
            let height=0
            this.listHeight.push(height)
            for(let i=0;i<list.length;i++){
                let item=list[i]
                height+=item.clientHeight
                this.listHeight.push(height)
            }
        }
    },
    watch:{
        data(){
            setTimeout(() => {
                this._calculateHeight()
            }, 20);
        },
        scrollY(newY){
            const listHeight=this.listHeight
            //当滚动到顶部
            if(newY>0){
                this.currentIndex=0
                return
            }
            //在中间滚动
            for(let i=0;i<listHeight.length-1;i++){
                let heigth1=listHeight[i]
                let height2=listHeight[i+1]
                if(-newY>=heigth1 && -newY<height2){
                    this.currentIndex=i
                    this.diff=height2+newY
                    return
                }
            }
            //滚动到最底部
            this.currentIndex=listHeight.length-2
        },
        diff(newVal){
            let fixTop=(newVal>0 && newVal<TITLE_HEIGHT)?newVal-TITLE_HEIGHT:0
            if(this.fixTop === fixTop){
                return
            }
            this.fixTop=fixTop
            this.$refs.fixed.style.transform=`translate3d(0,${fixTop}px,0)`
        }
    },
    components:{
        Scroll,
        Loading
    }
}
</script>

<style scoped>
.listview{position: relative;width: 100%;height: 100%;overflow: hidden}
.list-group{padding-bottom: 30px;}
.list-grour-title{height: 30px;line-height: 30px;padding-left: 20px;font-size: 14px;background: #fff}
.list-group-item{display: flex;align-items: center;padding: 20px 0 0 30px;}
.list-group-item .avatar{border-radius: 50%;width: 50px;height: 50px}
.list-group-item .name{margin-left: 20px;font-size: 14px;}

.list-shortcut{position: absolute;z-index: 30;right: 0;top: 50%;
-webkit-transform: translateY(-50%);transform: translateY(-50%);font-family: Helvetica;}
.list-shortcut .item{padding: 6px 16px 0;line-height: 1;text-align: center;
font-size: 12px;}
.list-shortcut .item.active{color: #31c27c}

.list-fixed{z-index: 1;position: absolute;top: 0;left: 0;right: 0;padding:  8px 0 8px 20px;background: #fff;font-size: 14px;line-height: 1;font-weight: 600}

</style>
