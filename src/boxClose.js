/**
 * 删除boxContent的dom并执行回调函数
 * @param callback
 */
BlackBox.fn.boxClose = function (callback) {
    var $BlackBoxContent = $("#" + this._getNowID()),
        _this = this;
    if (!$BlackBoxContent[0]) return;
    $BlackBoxContent.fadeOut(400,
        function () {
            $(this).remove();
            _this._clearOverlay.call(_this, callback);
        });
};