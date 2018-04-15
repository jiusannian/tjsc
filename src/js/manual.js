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
        manualsList: [], //说明书列表
        footerMenu:[],//底部菜单,
        manualsCategories:[],//资讯分类
        currentCode: 'manual',
        initCategoryId:'',
        page: 1,
        isLoadMore: false
    },
    created: function() {
        this.getManualsCategories(); 
        
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
        getManualsList:function(){
            this.$http.get(myJS.url('manuals/categories/' + this.initCategoryId))
                .then((response) => {
                    response = response.body;
                    if(response.errcode === 0){
                        this.manualsList = response.data.data;
                        this.$nextTick(function () {
                            this.loadPhoto();
                        })
                    }
                })
                .catch(function(response) {
                    console.log(response)
                })
        },
        getManualsCategories:function(){
            this.$http.get(myJS.url('manuals/categories'))
                .then((response) => {
                    response = response.body;
                    if(response.errcode === 0){
                        this.manualsCategories = response.data;
                        this.initCategoryId = this.manualsCategories[0].id;
                        this.$nextTick(function () {
                            this.getManualsList(); //必须先拿分类
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
        getManualCategoriesList:function(id){
            this.$http.get(myJS.url('manuals/categories/'+id),
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
                            this.manualsList.push(response.data.data[i]);
                        }
                        //this.manualsList = response.data.data;
                        this.$nextTick(function () {
                            this.loadPhoto();
                        })
                    }
                })
                .catch(function(response) {
                    console.log(response)
                })
        },
        toManualDetail:function(id){
            window.location.href = 'manualDetail.html?id=' + id;
            console.log(id);
        },
        toCategories:function(id){
            this.page = 1;
            this.manualsList = [];
            this.getManualCategoriesList(id);
        },
        loadPhoto:function(){
            myJS.imgScale('.j_3019', '30', '19');
            myJS.imgScale('.j_53', '5', '3');
            myJS.imgScale('.j_85', '8', '5');
            myJS.imgScale('.j_1715', '17', '15');
            myJS.ImgFull('.loadImg');
        }
    }
});