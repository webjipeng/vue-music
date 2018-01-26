import jsonp from '@/assets/js/jsonp'
import {commonParams,options} from './config'

export function getHotKey(){
    const url='https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

    const data=Object.assign({},commonParams,{
        g_tk:1300250123,
        uin:0,
        format:'jsonp',
        notice:0,
        platform:'h5',
        needNewCode:1
    })

    return jsonp(url,data,options)
}

export function search(query,page,zhida){
    const url='https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'

    const data=Object.assign({},commonParams,{
        w:query,
        p:page,
        catZhida:zhida,
        zhidaqu:1,
        g_tk:1300250123,
        t:0,
        flag:1,
        ie:'utf-8',
        sem:1,
        aggr:0,
        perpage:20,
        n:20,
        remoteplace:'txt.mqq.all',
        needNewCode:1,
        platform:'h5',
        notice:0,
        uin:0
    })

    return jsonp(url,data,options)
}