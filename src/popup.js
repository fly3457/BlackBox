/**
 * 自定义弹出内容
 * @param html
 * @param _delay_appear
 * @returns {*|jQuery|HTMLElement}
 */
BlackBox.fn.popup = function (html, _delay_appear) {
    if (arguments.length === 0) return $W;
    if (!this._setOverlay.call(this, 'popup', arguments, _delay_appear) && !_delay_appear) return $W;
    var $BlackBox = $("#BlackBox");
    $BlackBox.append('<div class="normal" id="popup' + this._getNowID() + '">' + html + '</div>');
    this._boxWrap($("#popup" + this._getNowID()));
    this._setOverlayAttr.call(this);
    return $BlackBox;
};