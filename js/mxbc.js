/**
 * 蜜雪冰城
 * cron 11 12 * * *  mxbc.js
 * 感谢大佬的代码
 * ========= 青龙--配置文件 ===========
 * # 项目名称
 * export mxbc_data='token @ token'
 *
 * 多账号用 换行 或 @ 分割
 * 抓包 mxsa.mxbc.net/api , 找到 Access-Token 即可
 * ====================================
 *
 */


const Env = require('./env')
const $ = new Env("蜜雪冰城")

const ckName = "MXBC_ENV"

//-------------------- 一般不动变量区域 -------------------------------------
const Notify = 1;		 //0为关闭通知,1为打开通知,默认为1
let envSplitor = ["@", "\n"]; //多账号分隔符
let msg = '';       //let ck,msg
let userCookie = ($.isNode() ? process.env[ckName] : $.getdata(ckName)) || '';
let userList = [];
let userIdx = 0;
let userCount = 0;
//---------------------- 自定义变量区域 -----------------------------------
//---------------------------------------------------------

async function start() {

  // await getNotice()
  console.log('\n================== 用户CK ==================\n');
  taskall = [];
  for (let user of userList) {
    taskall.push(await user.user_info());
    await $.wait(1000); //延迟  1秒  可充分利用 $.环境函数
  }
  await Promise.all(taskall);
  console.log('\n================== 每日签到 ==================\n');
  taskall = [];
  for (let user of userList) {
    if (user.ckStatus) {
      taskall.push(await user.task_signin());
      await $.wait(1000); //延迟  1秒  可充分利用 $.环境函数
    }
  }
  await Promise.all(taskall);
}


class UserInfo {
  constructor(str) {
    this.index = ++userIdx;
    this.ck = str.split('&')[0]; //单账号多变量分隔符
    //let ck = str.split('&')
    //this.data1 = ck[0]
    this.ckStatus = true
  }
  async user_info() {
    try {
      let options = {
        url: `https://mxsa.mxbc.net/api/v1/customer/info?appId=d82be6bbc1da11eb9dd000163e122ecb&t=${ts13()}&sign=${getSHA256withRSA('appId=d82be6bbc1da11eb9dd000163e122ecb&t=' + ts13())}`,
        headers: {
          'app': 'mxbc',
          'appchannel': 'xiaomi',
          'appversion': '3.0.3',
          'Access-Token': this.ck,
          'Host': 'mxsa.mxbc.net',
          'Connection': 'Keep-Alive',
          //'Accept-Encoding': 'gzip',
          'User-Agent': 'okhttp/4.4.1'
        }
      }
      //console.log(options);
      let result = await httpRequest(options);
      //console.log(result);
      if (result.code == 0) {
        DoubleLog(`账号[${this.index}]  用户CK有效: [${result.data.mobilePhone}] 雪王币剩余[${result.data.customerPoint}]`);
        this.ckStatus = true

      } else {
        DoubleLog(`账号[${this.index}]  用户CK失效:,原因未知！`);
        this.ckStatus = false

        console.log(result);
      }
    } catch (e) {
      console.log(e);
    }
  }
  async task_signin() {
    try {
      let options = {
        url: `https://mxsa.mxbc.net/api/v1/customer/signin?appId=d82be6bbc1da11eb9dd000163e122ecb&t=${ts13()}&sign=${getSHA256withRSA('appId=d82be6bbc1da11eb9dd000163e122ecb&t=' + ts13())}`,
        headers: {
          'app': 'mxbc',
          'appchannel': 'xiaomi',
          'appversion': '3.0.3',
          'Access-Token': this.ck,
          'Host': 'mxsa.mxbc.net',
          'Connection': 'Keep-Alive',
          //'Accept-Encoding': 'gzip',
          'User-Agent': 'okhttp/4.4.1'
        }
      }
      //console.log(options);
      let result = await httpRequest(options);
      //console.log(result);
      if (result.code == 0) {
        DoubleLog(`账号[${this.index}]  签到成功:累计签到 [${result.data.ruleValueGrowth}]天 本次获得[${result.data.ruleValuePoint}]币`);
        this.ckStatus = true

      } else {
        DoubleLog(`账号[${this.index}]  签到:失败 ❌ 了呢,原因未知！`);
        console.log(result);
      }
    } catch (e) {
      console.log(e);
    }
  }




}

!(async () => {
  if (!(await checkEnv())) return;
  if (userList.length > 0) {
    await start();
  }
  await SendMsg(msg);
})()
  .catch((e) => console.log(e))
  .finally(() => $.done());


//********************************************************
// 变量检查与处理
async function checkEnv() {
  if (userCookie) {
    // console.log(userCookie);
    let e = envSplitor[0];
    for (let o of envSplitor)
      if (userCookie.indexOf(o) > -1) {
        e = o;
        break;
      }
    for (let n of userCookie.split(e)) n && userList.push(new UserInfo(n));
    userCount = userList.length;
  } else {
    console.log("未找到CK");
    return;
  }
  return console.log(`共找到${userCount}个账号`), true;//true == !0
}
/////////////////////////////////////////////////////////////////////////////////////
var rs = require("jsrsasign");

var privateKeyString = `-----BEGIN PRIVATE KEY-----
MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCtypUdHZJKlQ9L
L6lIJSphnhqjke7HclgWuWDRWvzov30du235cCm13mqJ3zziqLCwstdQkuXo9sOP
Ih94t6nzBHTuqYA1whrUnQrKfv9X4/h3QVkzwT+xWflE+KubJZoe+daLKkDeZjVW
nUku8ov0E5vwADACfntEhAwiSZUALX9UgNDTPbj5ESeII+VztZ/KOFsRHMTfDb1G
IR/dAc1mL5uYbh0h2Fa/fxRPgf7eJOeWGiygesl3CWj0Ue13qwX9PcG7klJXfToI
576MY+A7027a0aZ49QhKnysMGhTdtFCksYG0lwPz3bIR16NvlxNLKanc2h+ILTFQ
bMW/Y3DRAgMBAAECggEBAJGTfX6rE6zX2bzASsu9HhgxKN1VU6/L70/xrtEPp4SL
SpHKO9/S/Y1zpsigr86pQYBx/nxm4KFZewx9p+El7/06AX0djOD7HCB2/+AJq3iC
5NF4cvEwclrsJCqLJqxKPiSuYPGnzji9YvaPwArMb0Ff36KVdaHRMw58kfFys5Y2
HvDqh4x+sgMUS7kSEQT4YDzCDPlAoEFgF9rlXnh0UVS6pZtvq3cR7pR4A9hvDgX9
wU6zn1dGdy4MEXIpckuZkhwbqDLmfoHHeJc5RIjRP7WIRh2CodjetgPFE+SV7Sdj
ECmvYJbet4YLg+Qil0OKR9s9S1BbObgcbC9WxUcrTgECgYEA/Yj8BDfxcsPK5ebE
9N2teBFUJuDcHEuM1xp4/tFisoFH90JZJMkVbO19rddAMmdYLTGivWTyPVsM1+9s
tq/NwsFJWHRUiMK7dttGiXuZry+xvq/SAZoitgI8tXdDXMw7368vatr0g6m7ucBK
jZWxSHjK9/KVquVr7BoXFm+YxaECgYEAr3sgVNbr5ovx17YriTqe1FLTLMD5gPrz
ugJj7nypDYY59hLlkrA/TtWbfzE+vfrN3oRIz5OMi9iFk3KXFVJMjGg+M5eO9Y8m
14e791/q1jUuuUH4mc6HttNRNh7TdLg/OGKivE+56LEyFPir45zw/dqwQM3jiwIz
yPz/+bzmfTECgYATxrOhwJtc0FjrReznDMOTMgbWYYPJ0TrTLIVzmvGP6vWqG8rI
S8cYEA5VmQyw4c7G97AyBcW/c3K1BT/9oAj0wA7wj2JoqIfm5YPDBZkfSSEcNqqy
5Ur/13zUytC+VE/3SrrwItQf0QWLn6wxDxQdCw8J+CokgnDAoehbH6lTAQKBgQCE
67T/zpR9279i8CBmIDszBVHkcoALzQtU+H6NpWvATM4WsRWoWUx7AJ56Z+joqtPK
G1WztkYdn/L+TyxWADLvn/6Nwd2N79MyKyScKtGNVFeCCJCwoJp4R/UaE5uErBNn
OH+gOJvPwHj5HavGC5kYENC1Jb+YCiEDu3CB0S6d4QKBgQDGYGEFMZYWqO6+LrfQ
ZNDBLCI2G4+UFP+8ZEuBKy5NkDVqXQhHRbqr9S/OkFu+kEjHLuYSpQsclh6XSDks
5x/hQJNQszLPJoxvGECvz5TN2lJhuyCupS50aGKGqTxKYtiPHpWa8jZyjmanMKnE
dOGyw/X4SFyodv8AEloqd81yGg==
-----END PRIVATE KEY-----
`;
function getSHA256withRSA(content) {
  const key = rs.KEYUTIL.getKey(privateKeyString);

  const signature = new rs.KJUR.crypto.Signature({ alg: "SHA256withRSA" });

  signature.init(key);

  signature.updateString(content);

  const originSign = signature.sign();
  const sign64u = rs.hextob64u(originSign);

  return sign64u;
}

function ts13() {
  return Math.round(new Date().getTime()).toString();
}

function httpRequest(options, method) {
  //options = changeCode(options)
  typeof (method) === 'undefined' ? ('body' in options ? method = 'post' : method = 'get') : method = method
  return new Promise((resolve) => {
    $[method](options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${method}请求失败`);
          //console.log(JSON.parse(err));
          $.logErr(err);
          //throw new Error(err);
          //console.log(err);
        } else {
          //httpResult = data;
          //httpResponse = resp;
          if (data) {
            //console.log(data);
            data = JSON.parse(data);
            resolve(data)
          } else {
            console.log(`请求api返回数据为空，请检查自身原因`)
          }
        }
      } catch (e) {
        //console.log(e, resp);
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}
// 双平台log输出
function DoubleLog(data) {
  if ($.isNode()) {
    if (data) {
      console.log(`${data}`);
      msg += `\n${data}`
    }
  } else {
    console.log(`${data}`);
    msg += `\n${data}`
  }
}
// 发送消息
async function SendMsg(message) {
  if (!message) return;
  if (Notify > 0) {
    if ($.isNode()) {
      const notify = require("./sendNotify");
      await notify.sendNotify($.name, message)
    } else {
      $.msg($.name, '', message)
    }
  } else {
    console.log(message)
  }
}
