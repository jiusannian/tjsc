/**
 * 
 * @authors Riche
 * @date    2016-07-05 10:39:22
 * @version 1.1.0
 */

/*Vue.transition('fade', {
    enterClass: 'fadeInLeft',
    leaveClass: 'hide'
});*/

/*Vue.use(VueTouch);*/
Vue.http.interceptors.push((request, next) => {
    request.credentials = true;
    next();
});

var infoId = $.getUrlVar("id");
var vm = new Vue({
    el: "#app",
    data: {
        photos: [], //轮播图
        infoDetail: [], //菜谱详情
        footerMenu:[],//底部菜单
        currentCode: 'news',
        isCollectedFlag: false
    },
    created: function() {
        this.getInfoDetail();
        this.getWeiXinAuth();
        this.getFooterMenu();
        this.isCollected();
        this.doShareTimeline();
    },
    mounted: function () {
        // 轮播
        var swiper = new Swiper('.full2',{
            pagination: '.full2 .pagination',
            paginationClickable: true,
            speed: 2000,
            autoplay: 3000,
            loop: true,
            autoplayDisableOnInteraction: false
        });
        // 轮播比例
        myJS.imgScale('.j_3019', '30', '19');
        myJS.ImgFull('.loadImg','images/error.png');
        this.$nextTick(function () {
            // Code that will run only after the
            // entire view has been rendered
        })
        $(".wechat_bg").on('click', function() {
            $(".wechat_bg,.wechat").hide();
        });
    },
    methods: {
        getWeiXinAuth:function(){
            var code = $.getCookie("code") || $.getUrlVar("code");
            this.$http.get(myJS.url('users/me'),{
                params: { code: code}
            })
                .then((response) => {
                    response = response.body;
                    if(response.errcode === 0){
                        //去掉返回的code，防止在当前页刷新时出错
                        var paramStr = location.href.split('?')[1];
                        var urlStr = location.href.split('?')[0];
                        if(paramStr) var paramArr = paramStr.split('&');
                        paramArr.forEach(function(val, index){
                            if(val.indexOf('code')>-1){
                                paramArr.splice(index, 1)
                            }
                            
                        })
                        //console.log(urlStr+'?'+paramArr.join('&'));
                        history.replaceState(null, document.title, urlStr+'?'+paramArr.join('&'));

                        //console.log('可以收藏');

                    }else if(response.errcode===403){
                        var cb = location.href;
                        window.location.href = "/api/users/oauth?redirectUrl=" + cb;
                    }
                })
                .catch(function(response) {
                    console.log(response)
                })
        },
        isCollected:function(){
            this.$http.get(myJS.url('news/'+infoId+'/isCollected'))
                .then((response) => {
                    response = response.body;
                    if(response.errcode === 0){
                        //alert(JSON.stringify(response));
                        this.isCollectedFlag = response.data;
                    }
                })
                .catch(function(response) {
                    console.log(response)
                })
        },
        doCollectOrCancel:function(){
            if(this.isCollectedFlag){
                this.$http.post(myJS.url('news/'+infoId+'/unCollect'))
                .then((response) => {
                    response = response.body;
                    if(response.errcode === 0){
                        //alert('取消成功'+e.target);
                        this.isCollectedFlag = !this.isCollectedFlag;
                    }
                })
                .catch(function(response) {
                    console.log(response)
                })
            }else{
                this.$http.post(myJS.url('news/'+infoId+'/collect'))
                .then((response) => {
                    response = response.body;
                    if(response.errcode === 0){
                        //alert('收藏成功'+e.target);
                        this.isCollectedFlag = !this.isCollectedFlag;
                    }
                })
                .catch(function(response) {
                    console.log(response)
                })
            }
            
        },
        doShareTimeline:function(){
            //分享标题
            var title = "天际电器";
            //分享描述
            var desc = "咨询详情";
            //分享链接
            var link = location.href;
            //分享图标
            //var imgUrl = "http://wx.qlogo.cn/mmopen/5FdSYjcOmdMb6FYIKW37azORMKL733frte8c20nHsvwuhZ2QuIoy2TtCRGKAjKY5h0tmw6jcjKeTgV1FTf0ibZRictfnNLfib8o/0";
            wx.ready(function() {  
                wx.onMenuShareTimeline({
                  title: title, // 分享标题
                  desc: desc, // 分享描述
                  link: link, // 分享链接
                  //imgUrl: imgUrl, // 分享图标
                  trigger: function (res) {
                      //用户点击分享到朋友圈
                  },
                  success: function () {
                      // 用户确认分享后执行的回调函数
                      //alert("分享成功");

                      //保存分享结果

                  },
                  fail:function(){
                    alert('分享失败了，再试试吧');
                  },
                  cancel: function () {
                      // 用户取消分享后执行的回调函数
                      alert("取消分享");
                  }
                });
            })
            wx.ready(function() {
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
            })
        },
        doShareAppMessage:function(){

        },
        doShare:function(){
            $(".wechat_bg,.wechat").show();
        },
        getInfoDetail:function(){
            this.$http.get(myJS.url('news/'+infoId))
                .then((response) => {
                    response = response.body;
                    if(response.errcode === 0){
                        this.infoDetail = response.data;
                        this.$nextTick(function () {
                            this.loadPhoto();
                        })
                    }
                })
                .catch(function(response) {
                    console.log(response)
                })
        },
        getTastyRecipes:function(){
            this.$http.get(myJS.url('recipes/tasty'))
                .then((response) => {
                    response = response.body;
                    if(response.errcode === 0){
                        this.tastyRecipes = response.data;
                        this.$nextTick(function () {
                            this.loadPhoto();
                        })
                    }
                })
                .catch(function(response) {
                    console.log(response)
                })
        },
        getFooterMenu: function() {
            this.$http.get(myJS.url('global/menus'))
                .then((response) => {
                    response = response.body;
                    if(response.errcode === 0){
                        this.footerMenu = response.data;
                        this.$nextTick(function () {
                            this.loadPhoto();
                        })
                    }
                })
                .catch(function(response) {
                    console.log(response)
                })
        },
        toRecipeDetail:function(id){
            console.log(id);
        },
        loadPhoto:function(){
            myJS.imgScale('.j_3019', '30', '19');
            myJS.imgScale('.j_53', '5', '3');
            myJS.imgScale('.j_85', '8', '5');
            myJS.ImgFull('.loadImg');
        }
    }
});