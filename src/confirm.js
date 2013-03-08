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