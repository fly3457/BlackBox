/**
 * Confirm 效果
 * @param text
 * @param callback 确认输入true取消输入false
 * @param options
 * @param _delay_appear
 */
BlackBox.fn.confirm = function (text, callback, options, _delay_appear) {
    if (arguments.length === 0) return;
    var args = this._getArgs.apply(this, arguments);
    if (!this._setOverlay.call(this, 'confirm', args, args[3]) && !args[3]) return;
    var $BlackBox = $("#BlackBox");
    $BlackBox.append('<div class = "system Inner" id="confirm' + this._getNowID() + '"><p>' + args[0] + '</p></div>');
    this._boxWrap($("#confirm" + this._getNowID()), args[2]);
    this._setOverlayAttr.call(this);
    var onSubmit = function () {
            return args[1].call(this, true);
        },
        onCancel = function () {
            return args[1].call(this, false);
        };
    if (this.config.displayClose) {
        this._setClose.call(this, onCancel);
    }
    this._setButton.call(this, onSubmit, onCancel, args[2]);
};