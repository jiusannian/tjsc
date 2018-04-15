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
var classify = $.getUrlVar("classify");
var vm = new Vue({
    el: "#app",
    data: {
        collections: [], //咨询列表
        footerMenu:[],//底部菜单,
        collectionCategories:[],//资讯分类
        currentCode: 'user',
        page: 1,
        collectionCode: classify,
        //keywordList:[{title:"123"},{title:"156"},{title:"789"}],
        keyword:''
    },
    created: function() {
        this.getCollectionCategories();
        this.getCollections();
        this.getFooterMenu();
    },
    mounted: function () {
        
        this.$nextTick(function () {
            // Code that will run only after the
            // entire view has been rendered
        })
    },
    computed: {  
        keywordList: function () { 
            var that = this; 
            var arr = [];
            if (that.collections == null) {
              return arr;
            }
            that.collections.filter(function (item,index) {
                if(that.keyword.length>0 && item.title.indexOf(that.keyword) != -1){
                    arr.push(item);
                }
                if(that.keyword.length==0){
                    arr = that.collections;
                }
            });
            return arr;
        }  
    },  
    methods: {
        getCollectionCategories:function(){
            this.$http.get(myJS.url('global/collectionsConfig'))
                .then((response) => {
                    response = response.body;
                    this.collectionCategories = response.data;
                })
                .catch(function(response) {
                    console.log(response)
                })
        },
        getCollections:function(){

            this.$http.get(myJS.url(classify+'/collections'),
                {
                    params: {page: this.page}
                    
                })
                .then((response) => {
                    response = response.body;
                    if(response.errcode === 0){
                        this.collections = response.data.data;
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
        getCollectionsList:function(code){
            this.$http.get(myJS.url(code+'/collections'),
                {
                    params: {page: this.page}
                    
                })
                .then((response) => {
                    response = response.body;
                    if(response.errcode === 0){
                        this.collections = response.data.data;
                        this.$nextTick(function () {
                            this.loadPhoto();
                        })
                    }
                })
                .catch(function(response) {
                    console.log(response)
                })
        },
        toCategories:function(code){
            this.collectionCode = code;
            this.getCollectionsList(code);
        },
        toInfoDetail:function(id){
            if(this.collectionCode === 'recipes'){
                window.location.href = 'recipeDetail.html?id=' + id;
            }
            if(this.collectionCode === 'news'){
                window.location.href = 'infoDetail.html?id=' + id;
            }
            if(this.collectionCode === 'manuals'){
                window.location.href = 'manualDetail.html?id=' + id;
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
            myJS.imgScale('.j_1715', '17', '15');
            myJS.imgScale('.j_53', '5', '3');
            myJS.imgScale('.j_85', '8', '5');
            myJS.ImgFull('.loadImg','images/error.png');
        }
    },
    watch:{
        "keywordList":function(){
            this.$nextTick(function () {
                this.loadPhoto();
            })
        }
    }
});