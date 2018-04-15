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
var categorieId = $.getUrlVar("id");
var vm = new Vue({
    el: "#app",
    data: {
        photos: [], //轮播图
        recipes: [], //菜谱
        recipeDetail: [], //菜谱详情
        tastyRecipes: [], //美味菜谱
        footerMenu:[],//底部菜单
        currentCode: 'recipe',
        page: 1,
        isLoadMore: false
    },
    created: function() {
        this.getRecipes();
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
    },
    methods: {
        getRecipes:function(){
            this.$http.get(myJS.url('recipes/categories/'+categorieId),
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
                            this.recipes.push(response.data.data[i]);
                        }
                        //this.recipes = response.data.data;
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
            window.location.href = 'recipeDetail.html?id=' + id;
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