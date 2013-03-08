/*
 * BlackBox - jQuery Plugin
 * version: 0.9 (8/03/2013)
 * @requires jQuery v1.4 or later
 *
 *
 * Copyright 2013 Vincent Ting
 * Website http://vincenting.com/
 * License : MIT License / GPL License
 *
 */

(function(){

    var root = this ,
    //用于处理同时多个弹出存在
        box_id = 0,
        overlay_list = [],
        load_array = {},
        $W = $(window);

    /**
     * @constructor
     */
    var BlackBox = function(){

        this.init.apply(this,arguments);

    };

    BlackBox.fn = BlackBox.prototype;

    /**
     * 初始化，产生实例的配置
     * clickOverlayEffect: 点击覆盖层效果，默认为抖动 'shake'，可选关闭 'close'
     * overlayColor : 覆盖层颜色，默认为黑色 #000
     * overlayOpacity : 覆盖层透明度，默认为 .6
     * forceLoad ：载入 iframe 时等待内容载入才显示出来
     * allowPromptBlank ：允许prompt时输入内容为空，默认否，即为空时提交会抖动
     * allowBoxScrolling ：在inline和iframe模式时超出部分使用scroll显示，否则隐藏超出部分
     * displayClose：在alert和prompt模式中显示关闭按钮
     * enableKeyPress：使用快捷键确定和取消
     * @param {Object} config
     */
    BlackBox.fn.init = function(config){

        var default_config = {
            'clickOverlayEffect': 'shake',
            'overlayColor': '#000',
            'overlayOpacity': .6,
            'forceLoad': true,
            'allowPromptBlank': false,
            'allowBoxScrolling': true,
            'displayClose': false,
            'enableKeyPress': true
        };

        if(Object.prototype.toString.call(config)=='[object Object]'){
            var this_config = {};
            jQuery.each(default_config,function(item,value){
                this_config[item] = config[item] || value;
            });
            this.config = this_config;
        }else{
            this.config = default_config;
        }
        if(this.config.enableKeyPress)this._setKeyShort.call(this);
    };

    /**
     * 对box内容进行包裹并保持居中
     * @param $target
     * @private
     */
    BlackBox.fn._boxWrap = function ($target){
        $target.wrap('<div class="BlackBoxContent" id="'+this._getNowID()+'"></div>');
        var $BlackBoxContent = $("#"+this._getNowID()).fadeTo(0,0).fadeTo(400,1),
            box_width = $BlackBoxContent.width(),
            box_height = $BlackBoxContent.height(),
            resize = function(){
                $BlackBoxContent.css({
                    left : ($W.width() - box_width)/2 + 'px',
                    top : ($W.height() - box_height - 80)/2 + 'px'
                })
            };
        $W.resize(resize);
        resize.call(this);
    };

    /**
     * 设置键盘快捷键
     * @private
     */
    BlackBox.fn._setKeyShort = function(){
        var _this = this;
        $(document).bind('keydown.fb', function(e) {
            var $BlackBoxContent = $(".BlackBoxContent");
            if (e.keyCode == 13) {
                e.preventDefault();
                $BlackBoxContent.find(".submit").click();
            } else if (e.keyCode == 27) {
                e.preventDefault();
                var button =  $BlackBoxContent.find(".cancel")[0] || $BlackBoxContent.find(".close")[0];
                if(button){
                    $(button).click();
                }else{
                    _this.boxClose.call(_this);
                }
            }
        });
    };

    /**
     * 产生遮罩
     * @returns {boolean}
     * @private
     */
    BlackBox.fn._setOverlay = function(type,args,delay_appear){
        box_id += 1;
        if(!delay_appear){
            overlay_list.push({
                id : box_id,
                type : type,
                args : args
            });
        }
        if(overlay_list.length!==1){
            return false;
        }
        $("body").append('<div id="BlackBox"><div id="BBOverlay"></div></div>');
        var $BBOverlay = $("#BBOverlay"),
            config = this.config;
        if(!delay_appear){
            $BBOverlay.css({
                background_color:config.overlayColor
            }).fadeTo(0,0).fadeTo(400,config.overlayOpacity);
        }
        var resize = function(){
            $BBOverlay.width($W.width()+"px").height($W.height()+"px");
        };
        resize.call(this);
        $W.resize(resize);
        return true;
    };

    /**
     * 删除遮罩，如果强制删除或者只有一个弹出内容时直接删除dom，否则显示下一个操作
     * @param force
     * @private
     * @param callback
     */
    BlackBox.fn._clearOverlay = function(callback,force){
        if(force){
            overlay_list.length = 0;
        }else{
            overlay_list.shift();
        }
        var _this = this;
        $("#BBOverlay").unbind("click");
        if(overlay_list.length==0){
            $("#BlackBox").fadeOut(400,function(){
                $(this).remove();
                if (callback)callback.call(_this);
            });
        }else{
            if (callback)callback.call(this);
            Array.prototype.push.call(overlay_list[0].args,true);
            this[overlay_list[0].type].apply(this,overlay_list[0].args);
        }
    };

    /**
     * 根据config内容设置遮罩点击效果
     * @private
     */
    BlackBox.fn._setOverlayAttr = function(){
        var click_effect = this.config.clickOverlayEffect,
            $BlackBoxContent = $("#"+this._getNowID()),
            $BBOverlay = $("#BBOverlay"),
            _this = this;
        if(click_effect==='close'){
            $BBOverlay.click(function(){
                var button = $BlackBoxContent.find(".close")[0] ||
                    $BlackBoxContent.find(".cancel")[0] || $BlackBoxContent.find(".submit")[0];
                if(button){
                    $(button).click();
                }else{
                    _this.boxClose.call(_this);
                }
            });
            return;
        }
        $BBOverlay.click(function(){
            _this.boxShake.call(_this);
        })
    };

    /**
     * 根据传入的参数来添加确定取消按钮
     * @param onSubmit
     * @param onCancel
     * @param verify
     * @private
     */
    BlackBox.fn._setButton = function(onSubmit,onCancel,verify){
        if(arguments.length===0)return;
        var $BlackBoxContent = $("#"+this._getNowID()),
            _this = this;
        $BlackBoxContent.find(".Inner").append('<div id="BlackBoxAction"></div>');
        var $BlackBoxAction = $("#BlackBoxAction");
        if(onCancel){
            $BlackBoxAction.append('<button class="cancel">取消</button>');
            $BlackBoxAction.find(".cancel").click(function(){
                _this.boxClose.call(_this,onCancel);
            })
        }
        if(onSubmit){
            $BlackBoxAction.append('<button class="submit">确定</button>');
            $BlackBoxAction.find(".submit").click(function(){
                if(!verify || verify.call(_this)){
                    _this.boxClose.call(_this,onSubmit);
                }else{
                    _this.boxShake.call(_this);
                }
            })
        }
    };

    /**
     * 添加关闭按钮
     * @param onCancel
     * @private
     */
    BlackBox.fn._setClose = function(onCancel){
        var $BlackBoxContent = $("#"+this._getNowID()),
            _this = this;
        $BlackBoxContent.append('<div class="close">Close</div>');
        $BlackBoxContent.find(".close").click(function(){
            _this.boxClose.call(_this,onCancel);
        })
    };

    /**
     * 返回当前的box的id
     * @returns {string}
     * @private
     */
    BlackBox.fn._getNowID = function(){
        var id = overlay_list[0].id;
        return "_box_"+id;
    };

    root.BlackBox = BlackBox;
    root.__ = new BlackBox();

}).call(window);