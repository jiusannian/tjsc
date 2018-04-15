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
        keyword: '天际电器', //关键词
        region:'广东省汕头市龙湖区',//区域
        footerMenu:[],//底部菜单
        currentCode: 'user'
    },
    created: function() {
        this.getLocat();
        this.getFooterMenu();
        
        
    },
    mounted: function () {
        this.$nextTick(function () {
            var fontSize = parseInt($('html').css('fontSize'));
            document.getElementById('markPage').height = $(document).height()-fontSize*2.7-fontSize*2.6-$('.selectBox').outerHeight();
        })
    },
    methods: {
        getLocat:function(){
            var _self = this;
            var markUrl = 'http://apis.map.qq.com/uri/v1/search?keyword='+ _self.keyword +'&region='+ _self.region +'&referer=myapp';
            document.getElementById('markPage').src = markUrl;
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
        }
    }
});