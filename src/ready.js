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
