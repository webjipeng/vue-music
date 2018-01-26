import * as types from './mutation-types'
import {playMode} from '@/assets/js/config'
import {randomList,saveSearch} from '@/assets/js/utils'

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

export const insertSong=function({commit,state},song){
    let playList=state.playList.slice()
    let sequenceList=state.sequenceList.slice()
    let currentIndex=state.currentIndex

    //记录当前歌曲
    let currentSong=playList[currentIndex]
    //判断当前列表是否已有当前歌曲,返回索引
    let fpIndex=findIndex(playList,song)

    //如果已经包含这首歌，则修改当前索引
    if(fpIndex>-1){
        currentIndex=fpIndex
    }
    //如果没有这首歌,则添加到列表最后,并更新当前索引为最后
    else{
        playList.splice(playList.length,0,song)
        sequenceList.push(sequenceList.length,0,song)
        currentIndex=playList.length-1
    }
    commit(types.SET_SEQUENCE_LIST,sequenceList)

    commit(types.SET_PLAYLIST,playList)
    commit(types.SET_CURRENT_INDEX,currentIndex)
    commit(types.SET_FULL_SCREEN,true)
    commit(types.SET_PLAYING_STATE,true)
}


export const saveSearchHistory=function({commit},query){
    commit(types.SET_SEARCH_HISTORY,saveSearch(query))
}