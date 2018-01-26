import storage from 'good-storage' 

function getRandomInt(min,max){
    return Math.floor(Math.random()*(max-min+1)+min)
}

export function randomList(list){
    let arr=list.slice()
    for(let i=0;i<arr.length;i++){
        let j=getRandomInt(0,i)
        let t=arr[i]
        arr[i]=arr[j]
        arr[j]=t
    }
    return arr
}

export function debounce(func,delay){
    let timer

    return function(...args){
        if(timer){
            clearTimeout(timer)
        }
        timer=setTimeout(()=>{
          func.apply(this,args)  
        },delay)
    }
}

const search_key='__search__'
const search_max_length=15

function insertArray(arr,val,compare,maxLen){
    const index=arr.findIndex(compare)
    if(index===0){
        return
    }
    if(index>0){
        arr.splice(index,1)
    }
    arr.unshift(val)
    if(maxLen && arr.length>maxLen){
        arr.pop()
    }
}

export function saveSearch(query){
    let searches=storage.get(search_key,[])
    insertArray(searches,query,(item)=>{
        item===query
    },search_max_length)
    storage.set(search_key,searches)
    return searches
}