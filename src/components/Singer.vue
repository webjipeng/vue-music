<template>
  <div class="singer" ref="singer">
      <list-view @select="selectSinger" :data="singers" ref="list"></list-view>
      <router-view></router-view>
  </div>
</template>

<script>
import {getSingerList} from '@/api/singer'
import {ERR_OK} from '@/api/config'
import ListView from '@/base/listview'
import {mapMutations} from 'vuex'
import {playListMixin} from '@/assets/js/mixin'

const HOT_NAME = '热门'
const HOT_SINGER_LENGTH = 10

export default {
    mixins:[playListMixin],
    data(){
        return{
            singers:[]
        }
    },
    components:{
        ListView
    },
    created(){
        this._getSingerList()
    },
    methods:{
        handlePlayList(playList){
            const bottom=playList.length>0?'60px':''
            this.$refs.singer.style.bottom=bottom
            this.$refs.list.refresh()
        },
        selectSinger(singer){
            this.$router.push({
                path:`/singer/${singer.id}`
            })
            this.setSinger(singer)
        },
        _getSingerList(){
            getSingerList().then((res)=>{
                if(res.code===ERR_OK){
                    this.singers=this._normalizeSinger(res.data.list)
                }
            })
        },
        //格式化歌手数据
        _normalizeSinger(list){
            let map={
                hot:{
                    title:HOT_NAME,
                    items:[]
                }
            }
            list.forEach((item,index)=>{
                if(index<HOT_SINGER_LENGTH){
                    map.hot.items.push({
                        id:item.Fsinger_mid,
                        name:item.Fsinger_name,
                        avatar:`https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
                    })
                }
                const key = item.Findex
                if(!map[key]){
                    map[key]={
                        title:key,
                        items:[]
                    }
                }
                map[key].items.push({
                    id:item.Fsinger_mid,
                    name:item.Fsinger_name,
                    avatar:`https://y.gtimg.cn/music/photo_new/T001R150x150M000${item.Fsinger_mid}.jpg?max_age=2592000`
                })
            });
            //map处理为有序列表
            let hot = []
            let ret = []
            for(let key in map){
                let val=map[key]
                if(val.title.match(/[a-zA-Z]/)){
                    ret.push(val)
                }else if(val.title===HOT_NAME){
                    hot.push(val);
                }
            }
            ret.sort((a,b)=>{
                return a.title.charCodeAt(0) - b.title.charCodeAt(0)
            })
            return hot.concat(ret)
        },
        ...mapMutations({
            setSinger:'SET_SINGER'
        })
    }

}
</script>

<style scoped>
.singer{position: fixed;top:88px;bottom: 0;width: 100%}
</style>
