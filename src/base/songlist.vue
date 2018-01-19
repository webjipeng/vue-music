<template>
  <div class="song-list">
      <ul>
          <li @click="selectItem(song,index)" class="item" v-for="(song,index) in songs" :key="song.id">
              <div class="content">
                  <h2 class="name">{{song.name}}</h2>
                  <p class="desc">{{getDesc(song)}}</p>
              </div>
          </li>
      </ul>
  </div>
</template>
<script>
export default {
    props:{
        songs:{
            type:Array,
            default:[]
        }
    },
    mounted(){
        
    },
    methods:{
        selectItem(item,index){
            this.$emit("select",item,index)
        },
        getDesc(song){
            return `${song.singer}·${song.album}`
        }
    }
}
</script>
<style scoped>
.song-list{height: 100%}
.song-list .item{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: 14px;
}
.song-list .item .content{
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    line-height: 20px;
    overflow: hidden;
}
.song-list .item .content .name{
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    color: #000;
    font-weight: 100;
    font-size: 14px;
}
.song-list .item .content .desc{
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    margin-top: 4px;
    color: #777;
}
</style>
