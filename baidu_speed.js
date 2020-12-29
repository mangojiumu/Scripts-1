/*
百度极速版签到任务

本脚本默认使用chavyleung大佬和Nobyda的贴吧ck，获取方法请看大佬仓库说明

~~~~~~~~~~~~~~~~

*/
const $ = new Env('百度极速版')

let CookieArr = [];

if ($.isNode()) {
  if (process.env.BAIDU_COOKIE && process.env.BAIDU_COOKIE.indexOf('&') > -1) {
  StartBody = process.env.BAIDU_COOKIE.split('&');
  }
 if (process.env.BAIDU_COOKIE && process.env.BAIDU_COOKIE.indexOf('\n') > -1) {
  BDCookie = process.env.BAIDU_COOKIE.split('\n');
  } else {
  BDCookie = process.env.BAIDU_COOKIE.split()
  }
  Object.keys(BDCookie).forEach((item) => {
        if (BDCookie[item]) {
          CookieArr.push(BDCookie[item])
        } 
    })
} else {
 CookieArr.push($.getdata(`chavy_cookie_tieba`)||$.getdata(`CookieTB`))
}
if ($.isNode()) {
      console.log(`============ 脚本执行-国际标准时间(UTC)：${new Date().toLocaleString()}  =============\n`)
      console.log(`============ 脚本执行-北京时间(UTC+8)：${new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toLocaleString()}  =============\n`)
}

!(async() => {
  if (!CookieArr[0]) {
    console.log($.name, '【提示】请把百度Cookie填入Github 的 Secrets 中，请以&或者换行隔开')
    return;
  }
  console.log(`您共提供${CookieArr.length}个百度账号Cookie`)
  for (let i = 0; i < CookieArr.length; i++) {
    if (CookieArr[i]) {
      cookieval = CookieArr[i];
      $.index = i + 1;
      await getsign();
      await coinInfo();
      await firstbox();
      await TaskCenter()
      await getRewards();
     //await drawPrize();
  }
 } 
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())

//签到
function getsign() {
  return new Promise((resolve, reject) =>{
   let signurl =  {
      url:  `https://haokan.baidu.com/activity/acusercheckin/update`,
      headers: {Cookie:cookieval},
      body: 'productid=2&ugus=9766888061'
      }
   $.post(signurl, (error, response, data) => {
     let get_sign = JSON.parse(data)
     if (get_sign.errno == 0){
         $.sub = get_sign.data.tips+`🎉`
         $.desc = `签到收益: ${get_sign.data.bonus.coin}💰，`  
         }  
     else if (get_sign.errno == 10053){
         $.sub =  get_sign.msg
          $.desc = ``
         }
     else {
         $.sub = `签到失败❌`
         $.desc = `说明: `+ get_sign.msg
         $.msg($.name,$.sub,$.desc)
         return
         }
     resolve()
    })
  })
}

function coinInfo() {
  return new Promise((resolve, reject) =>{
   let infourl =  {
      url: `https://haokan.baidu.com/activity/h5/displaybyday?type=1&page=1&productid=2`,
      headers: {Cookie:cookieval}
      }
   $.get(infourl, (error, response, data) => {
     let get_info = JSON.parse(data)
     if (get_info.errno == 0){
         $.sub += ' 今日收益: ' + get_info.data.datalist.data[0].desc
         }  
      resolve()
    })
  })
}

function getRewards() {
  return new Promise((resolve, reject) =>{
   let rewurl =  {
      url: `https://haokan.baidu.com/activity/tasks/taskreward?productid=2`,
      headers: {Cookie:cookieval}
      }
   $.get(rewurl, async(error, response, data) => {
     let get_reward = JSON.parse(data)
     if (get_reward.errno == 0&&get_reward.data.coin!==0){
         $.desc += '获得总收益: +' + get_reward.data.coin
         await invite()
         }  
       resolve()
    })
  })
}

function invite() {
  return new Promise((resolve, reject) =>{
   let rewurl =  {
      url: `https://haokan.baidu.com/activity/h5/vault?productid=2&inviteCode=WKQLC6&pkg=%5Bpkg%5D `,
      headers: {Cookie:cookieval}
      }
   $.get(rewurl, (error, response, data) => {
   //  let get_reward = JSON.parse(data)
      resolve()
    })
  })
}


function TaskCenter() {
  return new Promise((resolve, reject) =>{
   let rewurl =  {
      url: `https://haokan.baidu.com/activity/h5/vault?_format=json&productid=2&channel=2`,
      headers: {Cookie:cookieval}
      }
   $.get(rewurl, async(error, resp, data) => {
  try{
     let get_tasks = JSON.parse(data)
      //$.log("获取任务数据"+data)
       tasks = get_tasks.data.comps
      for ( x in tasks){
         //taskid = tasks[x].taskId
         id = tasks[x].id
        if(id == 962){
         for (jingangs  of  tasks[x].data.jingang_list_ios ){
         if(jingangs.jingangType==2){
          tid = jingangs.jingangTid
          taskName = '【'+jingangs.jingangName+'】'
          RefererUrl = jingangs.jingangUrl
        $.log(taskName+"tid:"+tid
