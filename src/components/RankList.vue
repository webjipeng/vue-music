<template>
    <transition name="slide">
        <music-list :title="title" :bg-image="bgImage" :songs="songs" :rank="true"></music-list>
    </transition>
</template>

<script>
import MusicList from './MusicList'
import {mapGetters} from 'vuex'
import {getMusicList} from '@/api/rank'
import {ERR_OK} from '@/api/config'
import {createSong} from '@/assets/js/song'

export default {
    components:{
        MusicList
    },
    data(){
        return {
            bgImage:'',
            songs:[]
        }
    },
    computed:{
        title(){
            return this.rankList.topTitle
        },
        ...mapGetters([
            'rankList'
        ])
    },
    created(){
        this._getMusicList()
    },
    methods:{
        _getMusicList(){
            if(!this.rankList.id){
                this.$router.push("/rank")
            }
            getMusicList(this.rankList.id).then((res)=>{
                if(res.code===ERR_OK){
                    this.bgImage=res.topinfo.pic_album
                    this.songs=this._normalizeSongs(res.songlist)
                }
            })
        },
        _normalizeSongs(list){
            let ret=[]
            list.forEach((item)=>{
                const musicData=item.data
                if(musicData.songid && musicData.albumid){
                    ret.push(createSong(musicData))
                }
            })
            return ret;
        }
    }
}
</script>

<style scoped>
.slide-enter-active,.slide-leave-active{
    transition: all .3s ease
}

.slide-enter,.slide-leave-to{
    transform: translate3d(100%,0,0)
}
</style>


