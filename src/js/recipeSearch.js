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
        recipesList: [], //咨询列表
        footerMenu:[],//底部菜单,
        recipesClassify: [],//菜谱分类
        currentCode: 'recipe',
        keyword:'',
        categoryId:''
    },
    created: function() {
        this.getRecipesClassify();
        
        this.getFooterMenu();
    },
    mounted: function () {
        
        this.$nextTick(function () {
            // Code that will run only after the
            // entire view has been rendered
        })
    },
    methods: {
        getRecipesList:function(){
            if(this.isIdEmpty()||this.isKeywordEmpty()){
                this.recipesList = [];
                return;
            }

            this.$http.get(myJS.url('recipes/search'),{
                params:{
                    categoryId:this.categoryId,
                    keyword: this.keyword
                }
            })
            .then((response) => {
                response = response.body;
                if(response.errcode === 0){
                    this.recipesList = response.data.data;
                    this.$nextTick(function () {
                        this.loadPhoto();
                    })
                }
            })
            .catch(function(response) {
                console.log(response)
            })
        },
        isIdEmpty:function(){
            return this.categoryId.length === 0 ? true : false;
        },
        isKeywordEmpty:function(){
            return this.keyword.length === 0 ? true : false;
        },
        getRecipesClassify:function(){
            this.$http.get(myJS.url('recipes/categories'))
                .then((response) => {
                    response = response.body;
                    if(response.errcode === 0){
                        this.recipesClassify = response.data;
                        this.categoryId = response.data[0].id;
                        this.$nextTick(function () {
                            //this.getRecipesList();
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
        toInfoDetail:function(id){
            window.location.href = 'infoDetail.html?id=' + id;
            console.log(id);
        },
        toCategories:function(id){
            this.categoryId = id;
            this.getRecipesList();
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