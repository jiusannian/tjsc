/**
 * 微信配置
 * @param {回调的实体} callbackobj 
1.apierror:调用服务器的接口失败后的回调函数，非微信的，下面的都是微信的
2.wxready:微信接口处理成功验证
3.wxerror:微信接口处理失败验证
 * @param {所要验证的接口，如果没有，那么就按默认的} jsApiList 
 * @param {开启调试模式} debug 
 * @returns {} 
 */
WxConfig = function (callbackobj, jsApiList, debug) {
    //调用接口获取微信端所需的JS配置参数
    $.ajax({
        url: myJS.url('users/jssdk'),
        type: 'get',
        dataType: "json",
        data: { url: window.location.href},
        success: function (result) {
            if (result.errcode===0) {
            //JS接口
                if (!jsApiList) {
                    jsApiList = alljsApiList;
                }
                //初始化微信配置
                wx.config({
                    debug: debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: result.data.app_id, // 必填，公众号的唯一标识
                    timestamp: result.data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: result.data.nonce_str, // 必填，生成签名的随机串
                    signature: result.data.signature,// 必填，签名，见附录1
                    jsApiList: jsApiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
                //微信相关的事件
                
                //接口处理成功验证，或可用$(window).on("WxReady",function(){});$(window).trigger("WxReady", [wx]);进行替换
                wx.ready(function () {
                    // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，
                    //config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，
                    //则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，
                    //则可以直接调用，不需要放在ready函数中;
                    if (callbackobj && callbackobj.wxready && typeof (callbackobj.wxready) === "function") {
                        callbackobj.wxready(result.data);
                    }
                });
                //接口处理失败验证
                wx.error(function (res) {
                    // config信息验证失败会执行error函数，如签名过期导致验证失败，
                    //具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，
                    //对于SPA可以在这里更新签名。
                    //alert("wx.error"+ JSON.stringify(res));
                    if (callbackobj && callbackobj.wxerror && typeof (callbackobj.wxerror) === "function") {
                        callbackobj.wxerror(res);
                    }
                });
            } else {
                //出错时的回调处理
                if (callbackobj && callbackobj.apierror && typeof (callbackobj.apierror) === "function") {
                    callbackobj.apierror(result.ReturnValue);
                }
            }
        },
        error: function (xhr) {
            alert('错误' + xhr.responseText);
        }
    });
};