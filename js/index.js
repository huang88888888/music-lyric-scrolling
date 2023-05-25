/**
 * 获取dom，将dom放在doms对象中
 */
let doms={
    audio:document.querySelector("audio"),
    ul:document.querySelector(".container ul"),
    container:document.querySelector(".container")
}

/**
 * 将lrc歌词解析
 * 返回一个数组对象
 * [{time:0.6,words:"难念的经"}]
 */
function parseLrc(){
    let lines=lrc.split('\n')
    let result=[]  //歌词数组
    for(let i=0;i<lines.length;i++){
        let str=lines[i]
        // 把每一行的时间和内容分开split
        let parts=str.split(']')
        let timeStr=parts[0].slice(1)
        // console.log('timeStr', timeStr)
    // console.log('str', str)
    let obj={
        time:parseTime(timeStr),
        words:parts[1],
    }
    result.push(obj)
    }
    // console.log('result', result)

    return result

}




/**
 * 将一个时间字符串转成数字
 * @param {string} timeStr 
 * @returns 返回时间数字（秒）
 */
function parseTime(timeStr){
    let parts=timeStr.split(':')
    // console.log('parts', +parts[1])
    
    return parts[0]*60 + +parts[1]
}

let lrcData=parseLrc()
/**
 * 根据audio的当前播放时间 返回正确的歌词数组的索引
 * 遍历歌词数组中的time，如果time大于audioTime，返回索引减1
 * @returns 返回播放器对应时间歌词的索引数字
 */
function findIndex(){
    let audioTime=doms.audio.currentTime
    for (let i =0;i<lrcData.length;i++){
        if(audioTime<lrcData[i].time){
            return i-1
        }
    }
    // console.log('audioTime', audioTime)
   return lrcData.length-1
}
findIndex()


// 界面
/**
 * 创建歌词元素li  并将li添加到ul中
 */
function createElementLrc(){
    // 为了不频繁操作dom添加东西，创建一个文档片段fragment
    let frag=document.createDocumentFragment()
    for(let i=0;i<lrcData.length;i++){
        let li=document.createElement("li")
        li.textContent=lrcData[i].words
        frag.appendChild(li)
    }
    doms.ul.appendChild(frag)
}
createElementLrc()

// 歌词结束最大偏移量maxOffset
let maxOffset=doms.ul.clientHeight-doms.container.clientHeight
let liHeight=doms.ul.children[0].clientHeight
let containerHeight=doms.container.clientHeight
// 设置ul偏移量
function setOffset(){
    // index可能为-1,-1的时候还未播放
    let index=findIndex()
    var offset=liHeight*index+liHeight/2-containerHeight/2
    if(offset<0){
        offset=0
    }else if(offset>maxOffset){
        offset=maxOffset
    }
    doms.ul.style.transform=`translateY(-${offset}px)`
    let li =doms.ul.querySelector(".active")
    if(li){
        li.classList.remove("active")
    }
    li=doms.ul.children[index]
    // 判断li不为-1 false 给li添加active
    if(li){
        li.classList.add("active")
    }
}

doms.audio.addEventListener("timeupdate",setOffset)