import jsonp from '@/assets/js/jsonp'
import {commonParams,options} from './config'
import axios from 'axios'
export function getRecommend(){
    const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

    const data = Object.assign({},commonParams,{
        platform:'h5',
        format:'jsonp',
    })

    return jsonp(url,data,options)
}

export function getDissList(){
    const url='/api/getDissList'

    const data = Object.assign({},commonParams,{
        platform:'yqq',
        sin:0,
        ein:29,
        sortId:5,
        categoryId:'10000000',
        rnd:Math.random(),
        hostUin:0,
        needNewCode:0,
        format:'json',
    })

    return axios.get(url,{
        params:data
    }).then((res)=>{
        return Promise.resolve(res.data)
    })

}

export function getSongList(disstid){
    const url='/api/getSongList'
    const data=Object.assign({},commonParams,{
        type:1,
        json:1,
        utf8:1,
        onlysong:0,
        disstid:disstid,
        format:'json',
        loginUin:0,
        hostUin:0,
        platform:'yqq',
        needNewCode:0,
        g_tk:1662866709
    })

    return axios.get(url,{
        params:data
    }).then((res)=>{
        return Promise.resolve(res.data)
    })
}