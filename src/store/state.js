import {playMode} from '@/assets/js/config'
const state={
    singer:{},
    playing:false,
    fullScreen:false,
    playList:[],
    sequenceList:[],
    mode:playMode.sequence,
    currentIndex:-1,
    disc:{},
    rankList:{},
    searchHistory:[]
}

export default state