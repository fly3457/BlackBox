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
            'displayClose': false
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
    };

    /**
     * 载入内容
     * @param item 载入内容
     * @param callback 载入完成执行内容
     * @param _delay_appear
     */
    BlackBox.fn.load = function(item,callback,_delay_appear){
        if(arguments.length===0)return;
        callback = callback || $.noop;
        if(!_delay_appear){
            if(Object.prototype.toString.call(load_array[item])=='[object Array]'){
                load_array[item].push(callback);
            }
            load_array[item] = [callback];
        }
        for (var key in load_array){
            if (key !== item)return;
        }
        if(arguments.length===1){
            Array.prototype.push.call(arguments,callback);
        }
        if (!this._setOverlay.call(this,'load',arguments,_delay_appear)&&!_delay_appear)return;
        $("#BlackBox").append('<div id="BlackBoxLoad">载入中</div>');
        var $BoxLoad = $("#BlackBoxLoad").fadeTo(0, 0).fadeTo(400, 1),
            resize = function () {
                $BoxLoad.css({
                    left: ($W.width() - $BoxLoad.width()) / 2,
                    top: ($W.height() - $BoxLoad.height()) / 2
                })
            };
        resize.call(this);
        $W.resize(resize);
    };

    /**
     * 载入完毕并执行相应内容载入完成时的执行函数
     * @param item
     */
    BlackBox.fn.ready = function (item) {
        if(arguments.length===0)return;
        var funcs = load_array[item];
        if(funcs){
            for(var i=0;i<funcs.length;i++){
                var func = funcs[i];
                func.call(this);
            }
        }
        delete load_array[item];
        for(var key in load_array){
            if(load_array.hasOwnProperty(key))return;
        }
        $("#BlackBoxLoad").fadeTo(400, 0);
        this._clearOverlay.call(this);
    };

    /**
     * 强制停止载入队列
     */
    BlackBox.fn.loadClear = function(callback){
        callback = callback || $.noop;
        for(var key in load_array){
            if(load_array.hasOwnProperty(key)){
                delete load_array[key];
            }
        }
        $("#BlackBoxLoad").fadeTo(400, 0);
        this._clearOverlay.call(this,callback);
    };

    /**
     * Alert效果
     * @param {String} text
     * @param {Function} callback
     * @param _delay_appear
     */
    BlackBox.fn.alert = function(text,callback,_delay_appear){
        if(arguments.length===0)return;
        callback = callback || $.noop;
        if(arguments.length===1){
            Array.prototype.push.call(arguments,callback);
        }
        if (!this._setOverlay.call(this,'alert',arguments,_delay_appear)&&!_delay_appear)return;
        var $BlackBox = $("#BlackBox");
        $BlackBox.append('<div class = "system Inner" id="alert'+this._getNowID()+
            '"><p>'+text+'</p></div>');
        this._boxWrap($("#alert"+this._getNowID()));
        this._setOverlayAttr.call(this);
        if(this.config.displayClose){
            this._setClose.call(this,callback);
        }
        this._setButton.call(this,callback);
    };

    /**
     * Confirm 效果
     * @param text
     * @param callback 确认输入true取消输入false
     * @param _delay_appear
     */
    BlackBox.fn.confirm = function(text,callback,_delay_appear){
        if(arguments.length===0)return;
        callback = callback || $.noop;
        if(arguments.length===1){
            Array.prototype.push.call(arguments,callback);
        }
        if (!this._setOverlay.call(this,'confirm',arguments,_delay_appear)&&!_delay_appear)return;
        var $BlackBox = $("#BlackBox");
        $BlackBox.append('<div class = "system Inner" id="confirm'+this._getNowID()+
            '"><p>'+text+'</p></div>');
        this._boxWrap($("#confirm"+this._getNowID()));
        this._setOverlayAttr.call(this);
        var onSubmit = function(){
            return callback.call(this,true);
        },onCancel = function(){
            return callback.call(this,false);
        };
        if(this.config.displayClose){
            this._setClose.call(this,onCancel);
        }
        this._setButton.call(this,onSubmit,onCancel);
    };

    /**
     * Prompt 方法
     * @param text
     * @param callback
     * @param verify 验证用户输入内容，取消返回null
     * @param _delay_appear
     */
    BlackBox.fn.prompt = function(text,callback,verify,_delay_appear){
        if(arguments.length===0)return;
        callback = callback || $.noop;
        verify = verify || function(){
            return true
        };
        if(arguments.length === 1){
            Array.prototype.push.call(arguments,callback,verify);
        }
        if(arguments.length === 2){
            Array.prototype.push.call(arguments,verify);
        }
        if (!this._setOverlay.call(this,'prompt',arguments,_delay_appear)&&!_delay_appear)return;
        var $BlackBox = $("#BlackBox");
        $BlackBox.append('<div class = "system Inner" id="prompt'+this._getNowID()+
            '"><p>'+text+'</p><input id="boxInput"></div></div>');
        this._boxWrap($("#prompt"+this._getNowID()));
        this._setOverlayAttr.call(this);
        var $thisInput = $("#boxInput"),
            onSubmit = function(){
                return callback.call(this,$thisInput.val());
            },
            onCancel = function(){
                return callback.call(this,null);
            },
            _this = this;
        $thisInput.blur(function(){
            $(this).val($.trim($(this).val()));
        });
        if(this.config.displayClose){
            this._setClose.call(this,onCancel);
        }
        var _verify = function(){
            if((_this.config.allowPromptBlank || $thisInput.val()) &&
                verify.call(this,$thisInput.val())){
                return true;
            }
            $thisInput.addClass("boxError");
            return false
        };
        $thisInput.focus(function(){
           $(this).removeClass("boxError");
        });
        this._setButton.call(this,onSubmit,onCancel,_verify);
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
     * 删除boxContent的dom并执行回调函数
     * @param callback
     * @private
     */
    BlackBox.fn._clearBox = function(callback){
        var $BlackBoxContent = $("#"+this._getNowID()),
            _this = this;
        $BlackBoxContent.fadeOut(400,function(){
            $(this).remove();
            _this._clearOverlay.call(_this,callback);
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
        if(overlay_list.length==0){
            $("#BlackBox").fadeOut(400,function(){
                $(this).remove();
                if (callback)callback.call(_this);
            });
        }else{
            if (callback)callback.call(this);
            $("#BBOverlay").unbind("click");
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
                var $button = $BlackBoxContent.find(".close") ||
                $BlackBoxContent.find(".cancel") || $BlackBoxContent.find(".submit");
                $button.click();
            });
            return;
        }
        $BBOverlay.click(function(){
            _this._shakeBox.call(_this);
        })
    };

    /**
     * 抖动盒子
     * @private
     */
    BlackBox.fn._shakeBox = function(){
        var $BlackBoxContent = $("#"+this._getNowID());
        var box_left = $BlackBoxContent.offset().left;
        for(var i=1; 4>=i; i++){
            $BlackBoxContent.animate({left:box_left-(12-3*i)},50);
            $BlackBoxContent.animate({left:box_left+2*(12-3*i)},50);
        }
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
                _this._clearBox.call(_this,onCancel);
            })
        }
        if(onSubmit){
            $BlackBoxAction.append('<button class="submit">确定</button>');
            $BlackBoxAction.find(".submit").click(function(){
                if(!verify || verify.call(_this)){
                    _this._clearBox.call(_this,onSubmit);
                }else{
                    _this._shakeBox.call(_this);
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
            _this._clearBox.call(_this,onCancel);
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

}).call(window);