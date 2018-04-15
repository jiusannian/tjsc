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

var manualId = $.getUrlVar("id");
var vm = new Vue({
    el: "#app",
    data: {
        photos: [], //轮播图
        manualDetail: [], //说明书详情
        footerMenu:[],//底部菜单
        currentCode: 'manual',
        isCollectedFlag: false
    },
    created: function() {
        this.getWeiXinAuth();
        this.isCollected();
        this.getManualDetail();
        this.getFooterMenu();
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
            this.$http.get(myJS.url('manuals/'+manualId+'/isCollected'))
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
                this.$http.post(myJS.url('manuals/'+manualId+'/unCollect'))
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
                this.$http.post(myJS.url('manuals/'+manualId+'/collect'))
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
        doShare:function(){
            $(".wechat_bg,.wechat").show();
        },
        getManualDetail:function(){
            this.$http.get(myJS.url('manuals/'+manualId))
                .then((response) => {
                    response = response.body;
                    if(response.errcode === 0){
                        this.manualDetail = response.data;
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