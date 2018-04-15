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

var vm = new Vue({
    el: "#app",
    data: {
        hotline: [], //客服热线
        userInfo:{
            headPic: 'images/1-error.png',//微信头像
            nickname: '昵称',//昵称
        },
        recipes: [], //菜谱
        hotRecipes: [], //热门菜谱
        awesomeRecipes: [], //热门菜谱
        footerMenu:[],//底部菜单,
        recipesClassify: [],//菜谱分类
        currentCode: 'user',
        collections:[]
    },
    created: function() {
        this.getHotline();
        this.getHeaderPic();
        this.getCollections();
        this.getHotRecipes();
        this.getAwesomeRecipes();
        this.getFooterMenu();
        this.getRecipesClassify();
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
    },
    methods: {
        getCollections:function(){
            this.$http.get(myJS.url('global/collectionsConfig'))
                .then((response) => {
                    response = response.body;
                    this.collections = response.data;
                })
                .catch(function(response) {
                    console.log(response)
                })
        },
        getHeaderPic:function(){
            var code = $.getCookie("code") || $.getUrlVar("code");
            this.$http.get(myJS.url('users/me'),{
                params: { code: code}
            })
                .then((response) => {
                    response = response.body;
                    if(response.errcode === 0){
                        history.replaceState(null, document.title, location.href.split("?")[0]);
                        this.userInfo = {
                            headPic: response.data.headimgurl,
                            nickname: response.data.nickname
                        };

                    }else if(response.errcode===403){
                        var cb = location.href;
                        window.location.href = "/api/users/oauth?redirectUrl=" + cb;
                    }
                })
                .catch(function(response) {
                    console.log(response)
                })
        },
        getRecipesClassify:function(){
            this.$http.get(myJS.url('recipes/categories'))
                .then((response) => {
                    response = response.body;
                    if(response.errcode === 0){
                        this.recipesClassify = response.data;
                        this.$nextTick(function () {
                            this.loadPhoto();
                        })
                    }
                })
                .catch(function(response) {
                    console.log(response)
                })
        },
        getHotRecipes:function(){
            this.$http.get(myJS.url('recipes/hot'))
                .then((response) => {
                    response = response.body;
                    if(response.errcode === 0){
                        this.hotRecipes = response.data;
                        console.log(this.hotRecipes)
                        this.$nextTick(function () {
                            this.loadPhoto();
                        })
                    }
                })
                .catch(function(response) {
                    console.log(response)
                })
        },
        getHotline:function(){
            this.$http.get(myJS.url('global/hotline'))
                .then((response) => {
                    response = response.body;
                    if(response.errcode === 0){
                        this.hotline = response.data;
                        this.$nextTick(function () {
                            this.loadPhoto();
                        })
                    }
                })
                .catch(function(response) {
                    console.log(response)
                })
        },
        getAwesomeRecipes: function(){
            this.$http.get(myJS.url('recipes/awesome'))
                .then((response) => {
                    response = response.body;
                    if(response.errcode === 0){
                        this.awesomeRecipes = response.data;
                        
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
            window.location.href = 'recipeDetail.html?id=' + id;
            console.log(id);
        },
        toCollections:function(classify){
            window.location.href = 'collections.html?classify=' + classify;
        },
        toCategories:function(id,isProduct){
            if(isProduct){
                window.location.href = 'productRecipesList.html?id=' + id;
            }else{
                window.location.href = 'nourishingSoup.html?id=' + id;
            }
        },
        loadPhoto:function(){
            myJS.imgScale('.j_3019', '30', '19');
            myJS.imgScale('.j_53', '5', '3');
            myJS.imgScale('.j_85', '8', '5');
            myJS.ImgFull('.loadImg');
        }
    }
});