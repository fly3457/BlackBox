/**
 * 载入完毕并执行相应内容载入完成时的执行函数
 * @param item
 */
BlackBox.fn.ready = function (item) {
    if (arguments.length === 0) return;
    var func_list = load_array[item];
    if (func_list) {
        for (var i = 0; i < func_list.length; i++) {
            var func = func_list[i];
            func.call(this);
        }
    }
    delete load_array[item];
    for (var key in load_array) {
        if (load_array.hasOwnProperty(key)) return;
    }
    var _this = this;
    $("#BlackBoxLoad").fadeTo(400, 0, function () {
        $(this).remove();
        _this._clearOverlay.call(_this);
    });
};

/**
 * 强制停止载入队列
 * @param callback
 */
BlackBox.fn.loadClear = function (callback) {
    callback = callback || $.noop;
    for (var key in load_array) {
        if (load_array.hasOwnProperty(key)) {
            delete load_array[key];
        }
    }
    $("#BlackBoxLoad").fadeTo(400, 0);
    this._clearOverlay.call(this, callback);
};