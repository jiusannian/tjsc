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
        recipes: [], //菜谱
        hotRecipes: [], //热门菜谱
        awesomeRecipes: [], //热门菜谱
        footerMenu:[],//底部菜单,
        recipesClassify: [],//菜谱分类
        slideshowList:[],
        currentCode: 'recipe'
    },
    created: function() {
        this.getRecipes();
        this.getHotRecipes();
        this.getAwesomeRecipes();
        this.getFooterMenu();
        this.getRecipesClassify();
        this.$http.get(myJS.url('recipes/slideshow'))
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
        getRecipes:function(){
            this.$http.get(myJS.url('recipes'))
                .then((response) => {
                    response = response.body;
                    if(response.errcode === 0){
                        this.recipes = response.data.data;
                        console.log(this.recipes);
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
        toCategories:function(id,isProduct){
            if(isProduct){
                window.location.href = 'productRecipesList.html?id=' + id;
            }else{
                window.location.href = 'nourishingSoup.html?id=' + id;
            }
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
            /*$('video').removeAttr("controls");
            $('video').click(function() {
                if ($(this).hasClass('pause')) {
                    $(this).trigger("play");
                    $(this).removeClass('pause');
                    $(this).addClass('play');
                    $(this).attr("controls","controls");
                } else {
                    $(this).trigger("pause");
                    $(this).removeClass('play');
                    $(this).addClass('pause');
                }
            })*/
           /* $('.j_mask').click(function(){
                $(this).hide();
                $(this).next()[0].play();
            })*/
        }
    }
});