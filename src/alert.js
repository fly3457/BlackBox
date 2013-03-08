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