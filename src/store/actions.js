import * as types from './mutation-types'
import {playMode} from '@/assets/js/config'
import {randomList} from '@/assets/js/utils'

function findIndex(list,song){
    return list.findIndex((item)=>{
        return item.id===song.id
    })
}

export const selectPlay=function({commit,state},{list,index}){
    commit(types.SET_SEQUENCE_LIST,list)
    if(state.mode===playMode.random){
        let random=randomList(list)
        commit(types.SET_PLAYLIST,random)
        index=findIndex(random,list[index])
    }
    else{
        commit(types.SET_PLAYLIST,list)
    }
    commit(types.SET_CURRENT_INDEX,index)
    commit(types.SET_FULL_SCREEN,true)
    commit(types.SET_PLAYING_STATE,true)
}

export const randomPlay=function({commit},{list}){
    commit(types.SET_PLAY_MODE,playMode.random)
    commit(types.SET_SEQUENCE_LIST,list)
    let random=randomList(list)
    commit(types.SET_PLAYLIST,random)
    commit(types.SET_CURRENT_INDEX,0)
    commit(types.SET_FULL_SCREEN,true)
    commit(types.SET_PLAYING_STATE,true)
}