/**
 * Alert效果
 * @param {String} text
 * @param {Function} callback
 * @param options
 * @param _delay_appear
 */
BlackBox.fn.alert = function (text, callback, options, _delay_appear) {
    if (arguments.length === 0) return;
    var args = this._getArgs.apply(this, arguments);
    if (!this._setOverlay.call(this, 'alert', args, args[3]) && !args[3]) return;
    var $BlackBox = $("#BlackBox");
    $BlackBox.append('<div class = "system Inner" id="alert' + this._getNowID() + '"><p>' + args[0] + '</p></div>');
    this._boxWrap($("#alert" + this._getNowID()), args[2]);
    this._setOverlayAttr.call(this);
    if (this.config.displayClose) {
        this._setClose.call(this, args[1]);
    }
    this._setButton.call(this, args[1], null, args[2]);
};