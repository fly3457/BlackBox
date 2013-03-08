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
        '"><p>'+text+'</p><input id="boxInput"></div>');
    this._boxWrap($("#prompt"+this._getNowID()));
    this._setOverlayAttr.call(this);
    var $thisInput = $("#boxInput").focus(),
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