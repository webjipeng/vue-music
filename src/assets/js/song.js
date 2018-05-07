import {getLyric} from '@/api/song'
import {Base64} from 'js-base64'
import {ERR_OK} from '@/api/config'

export default class Song{
    constructor({id,mid,singer,name,album,duration,image,url}){
        this.id=id
        this.mid=mid,
        this.singer=singer,
        this.name=name,
        this.album=album,
        this.duration=duration,
        this.image=image,
        this.url=url
    }
    getLyric(){
        if(this.lyric){
            return Promise.resolve(this.lyric)
        }
        return new Promise((resolve,reject)=>{
            getLyric(this.mid).then((res)=>{
                if(typeof res==='string'){
                    var reg=/^\w+\(({[^()]+})\)$/
                    var matches=res.match(reg)
                    if(matches){
                        res=JSON.parse(matches[1])
                    }
                }
                if(res.retcode === ERR_OK){
                    this.lyric=Base64.decode(res.lyric)
                    resolve(this.lyric)
                }else{
                    reject('no lyric')
                }
            })
        })
    }
}

export function createSong(musicData){
    return new Song({
        id:musicData.songid,
        mid:musicData.songmid,
        singer:filterSinger(musicData.singer),
        name:musicData.songname,
        album:musicData.albumname,
        duration:musicData.interval,
        image:`//y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        url:`//dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?guid=5648866400&vkey=7E6522DCDB994C9231A6E036705D8A0957CE4762D8A59257DBFA8F5A7CDB87C9E6A39F0FDA06822F7172D4A4C4485A6DB64AEABCCDD03128&uin=2756&fromtag=38`,
    })
}

function filterSinger(singer){
    let ret=[]
    if(!singer){
        return []
    }
    singer.forEach((item)=>{
        ret.push(item.name)
    })
    return ret.join('/')
}