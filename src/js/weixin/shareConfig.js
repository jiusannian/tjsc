/**
 * 所要验证微信的JS接口
 */
var alljsApiList = [
    "checkJsApi",
    "onMenuShareTimeline",
    "onMenuShareAppMessage",
    "onMenuShareQQ",
    "onMenuShareWeibo",
    "hideMenuItems",
    "showMenuItems",
    "hideAllNonBaseMenuItem",
    "showAllNonBaseMenuItem",
    "translateVoice",
    "startRecord",
    "stopRecord",
    "onRecordEnd",
    "playVoice",
    "pauseVoice",
    "stopVoice",
    "uploadVoice",
    "downloadVoice",
    "chooseImage",
    "previewImage",
    "uploadImage",
    "downloadImage",
    "getNetworkType",
    "openLocation",
    "getLocation",
    "hideOptionMenu",
    "showOptionMenu",
    "closeWindow",
    "scanQRCode",
    "chooseWXPay",
    "openProductSpecificView",
    "addCard",
    "chooseCard",
    "openCard",
    "editAddress",
];

WxConfig({
      //接口失败时回调
      apierror: function (errmsg) {
          console.log("apierror:" + errmsg);
      },
      //微信初始化完成时回调
      wxready: function () {
          console.log("wxready");
          /*wx.checkJsApi({
              jsApiList: [
                  'hideMenuItems',
                  'showMenuItems'
              ],
              success: function (res) {
                  alert(JSON.stringify(res));
              }
          });*/
          //测试分享
          //其他分享，请自阅：https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115&token=&lang=zh_CN
          try {

              //分享标题
              var title = "天际私厨";
              //分享描述
              var desc = "提供食谱和产品";
              //分享链接
              var link = "http://tianji.sz-utop.com/news.html";
              //分享图标
              //var imgUrl = "http://wx.qlogo.cn/mmopen/5FdSYjcOmdMb6FYIKW37azORMKL733frte8c20nHsvwuhZ2QuIoy2TtCRGKAjKY5h0tmw6jcjKeTgV1FTf0ibZRictfnNLfib8o/0";
              //wx.hideOptionMenu();
              wx.hideMenuItems({
                  menuList: ["menuItem:share:qq","menuItem:share:weiboApp","menuItem:share:QZone","menuItem:share:facebook"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
              });
              wx.onMenuShareAppMessage({
                title: title, // 分享标题
                desc: desc, // 分享描述
                link: link, // 分享链接
                //imgUrl: imgUrl, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                    alert("分享成功");

                    //保存分享结果

                    //时间戳，这个只能用前端生成，防止重复调用
                    var sharestamp = Math.round(new Date().getTime() / 1000);
                    //当前分享地址
                    var url = window.location.href;
                    //分享类型：分享到朋友圈 = 1,分享给朋友 = 2,分享到QQ = 3,分享到腾讯微博 = 4,分享到QQ空间 = 5,
                    var sharetype = 2;

                    //分享的全部内容
                    
                    
                    //保存分享结果
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                    alert("取消分享");
                }
              });

              wx.onMenuShareTimeline({
                  title: title, // 分享标题
                  link: link, // 分享链接
                  //imgUrl: imgUrl, // 分享图标
                  trigger: function (res) {
                      //用户点击分享到朋友圈
                  },
                  success: function () {
                      // 用户确认分享后执行的回调函数
                      //alert("分享成功");

                      //保存分享结果

                      //时间戳，这个只能用前端生成，防止重复调用
                      var sharestamp = Math.round(new Date().getTime() / 1000);
                      //当前分享地址
                      var url = window.location.href;
                      //分享类型：分享到朋友圈 = 1,分享给朋友 = 2,分享到QQ = 3,分享到腾讯微博 = 4,分享到QQ空间 = 5,
                      var sharetype = 1;

                      //分享的全部内容
                      var pJson = {
                          OpenID: OpenID,
                          Title: title,
                          Link: link,
                          ImgUrl: imgUrl,
                          Sharestamp: sharestamp,
                          Sharetype: sharetype,
                          Url: url,
                      };

                  },
                  fail:function(){
                    alert('分享失败了，再试试吧');
                  },
                  cancel: function () {
                      // 用户取消分享后执行的回调函数
                      alert("取消分享");
                  }
              });
          } catch (e) {
              alert(e.message);
          }
      },
      //微信失败时回调
      wxerror: function (res) {
          console.log("wxerror:" + JSON.stringify(res));
      }
  },alljsApiList,false);