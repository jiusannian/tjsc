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

var vm = new Vue({
    el: "#app",
    data: {
        photos: [], //轮播图
        newsList: [], //咨询列表
        footerMenu:[],//底部菜单,
        newsCategories:[],//资讯分类
        slideshowList:[],
        currentCode: 'news',
        page: 1,
        isLoadMore: false
    },
    created: function() {
        this.getNewsCategories();
        this.getNewsList();
        this.getFooterMenu();
        this.$http.get(myJS.url('news/slideshow'))
                .then((response) => {
                    response = response.body;
                    if(response.errcode === 0){
                        this.slideshowList = response.data;
                        this.$nextTick(function () {
                            this.loadPhoto();
                        })
                    }
                })
                .catch(function(response) {
                    console.log(response)
                })
    },
    mounted: function () {
        
        this.$nextTick(function () {
            // Code that will run only after the
            // entire view has been rendered
        })
    },
    methods: {
        getNewsList:function(){
            this.$http.get(myJS.url('news'))
                .then((response) => {
                    response = response.body;
                    if(response.errcode === 0){
                        this.newsList = response.data.data;
                        this.$nextTick(function () {
                            this.loadPhoto();
                        })
                    }
                })
                .catch(function(response) {
                    console.log(response)
                })
        },
        getNewsCategories:function(){
            this.$http.get(myJS.url('news/categories'))
                .then((response) => {
                    response = response.body;
                    if(response.errcode === 0){
                        this.newsCategories = response.data;
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
        getNewsCategoriesList:function(id){
            this.$http.get(myJS.url('news/categories/'+id),
                {
                    params: {page: this.page}
                    
                })
                .then((response) => {
                    response = response.body;
                    if(response.errcode === 0){
                        if(response.data.data.length >= 10){
                            this.page++;
                            this.isLoadMore = true;
                        }else{
                            this.isLoadMore = false;
                        }
                        for (var i = 0; i < response.data.data.length; i++) {
                            this.newsList.push(response.data.data[i]);
                        }
                        //this.newsList = response.data.data;
                        this.$nextTick(function () {
                            this.loadPhoto();
                        })
                    }
                })
                .catch(function(response) {
                    console.log(response)
                })
        },
        toInfoDetail:function(id){
            window.location.href = 'infoDetail.html?id=' + id;
            console.log(id);
        },
        toCategories:function(id){
            this.page = 1;
            this.newsList = [];
            this.getNewsCategoriesList(id);
        },
        loadPhoto:function(){
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
            myJS.imgScale('.j_53', '5', '3');
            myJS.imgScale('.j_85', '8', '5');
            myJS.ImgFull('.loadImg','images/error.png');
        }
    }
});