/**
 * Prompt 方法
 * @param text
 * @param callback
 * @param options
 * @param _delay_appear
 */
BlackBox.fn.prompt = function (text, callback, options, _delay_appear) {
    if (arguments.length === 0) return;
    var args = this._getArgs.apply(this, arguments);
    if (!this._setOverlay.call(this, 'prompt', arguments, args[3]) && !args[3]) return;
    var verify = args[2].verify ||
        function () {
            return true;
        };
    var $BlackBox = $("#BlackBox");
    $BlackBox.append('<div class = "system Inner" id="prompt' + this._getNowID() + '"><p>' + args[0] + '</p><input id="boxInput"></div>');
    this._boxWrap($("#prompt" + this._getNowID()), args[2]);
    this._setOverlayAttr.call(this);
    var $thisInput = $("#boxInput").focus(),
        onSubmit = function () {
            return args[1].call(this, $thisInput.val());
        },
        onCancel = function () {
            return args[1].call(this, null);
        },
        _this = this;
    $thisInput.blur(function () {
        $(this).val($.trim($(this).val()));
    });
    if (this.config.displayClose) {
        this._setClose.call(this, onCancel);
    }
    args[2].verify = function () {
        if ((_this.config.allowPromptBlank || $thisInput.val()) &&
            verify.call(this, $thisInput.val())) {
            return true;
        }
        $thisInput.addClass("boxError").focus();
        return false;
    };
    this._setButton.call(this, onSubmit, onCancel, args[2]);
};