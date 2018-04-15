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
        starProducts:[],//明星产品
        productCategories:[],//产品分类
        adsList: [], //产品列表
        footerMenu:[],//底部菜单
        currentCode: 'product',
        page: 1
    },
    created: function() {
        this.getAds();
        this.getStarProducts();
        this.getProductCategories();
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
        getAds:function(){
            this.$http.get(myJS.url('products/ads'))
                .then((response) => {
                    response = response.body;
                    if(response.errcode === 0){
                        this.adsList = response.data;
                        this.$nextTick(function () {
                            this.loadPhoto();
                        })
                    }
                })
                .catch(function(response) {
                    console.log(response)
                })
        },
        getStarProducts:function(){
            this.$http.get(myJS.url('products/star'))
                .then((response) => {
                    response = response.body;
                    if(response.errcode === 0){
                        this.starProducts = response.data;
                        this.$nextTick(function () {
                            this.loadPhoto();
                        })
                    }
                })
                .catch(function(response) {
                    console.log(response)
                })
        },
        getProductCategories:function(){
            this.$http.get(myJS.url('products/categories'))
                .then((response) => {
                    response = response.body;
                    if(response.errcode === 0){
                        this.productCategories = response.data;
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
                        console.log(this.footerMenu)
                    }
                })
                .catch(function(response) {
                    console.log(response)
                })
        },
        toCategories:function(id){
            this.getProductRecipesList(id);
        },
        toProductDetail:function(id){
            window.location.href = 'productDetail.html?id=' + id;
            console.log(id);
        },
        getProductRecipesList:function(id){
            this.$http.get(myJS.url('products/categories/'+id),
                {
                    params: {page: this.page}
                    
                })
                .then((response) => {
                    response = response.body;
                    if(response.errcode === 0){
                        this.starProducts = response.data.data;
                        this.$nextTick(function () {
                            this.loadPhoto();
                        })
                    }
                })
                .catch(function(response) {
                    console.log(response)
                })
        },
        loadPhoto:function(){
            myJS.imgScale('.j_3019', '30', '19');
            myJS.imgScale('.j_53', '5', '3');
            myJS.imgScale('.j_85', '8', '5');
            myJS.imgScale('.j_1715', '17', '15');
            myJS.ImgFull('.loadImg');
            $('.j_mask').click(function(){
                $(this).hide();
                $(this).next()[0].play();
            })
        }
    }
});