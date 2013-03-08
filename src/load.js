/**
 * 载入内容
 * @param item 载入内容
 * @param callback 载入完成执行内容
 * @param _delay_appear
 */
BlackBox.fn.load = function(item,callback,_delay_appear){
    if(arguments.length===0)return;
    callback = callback || $.noop;
    if(!_delay_appear){
        if(Object.prototype.toString.call(load_array[item])=='[object Array]'){
            load_array[item].push(callback);
        }
        load_array[item] = [callback];
    }
    for (var key in load_array){
        if (key !== item)return;
    }
    if(arguments.length===1){
        Array.prototype.push.call(arguments,callback);
    }
    if (!this._setOverlay.call(this,'load',arguments,_delay_appear)&&!_delay_appear)return;
    $("#BlackBox").append('<div id="BlackBoxLoad">载入中</div>');
    var $BoxLoad = $("#BlackBoxLoad").fadeTo(0, 0).fadeTo(400, 1),
        resize = function () {
            $BoxLoad.css({
                left: ($W.width() - $BoxLoad.width()) / 2,
                top: ($W.height() - $BoxLoad.height()) / 2
            })
        };
    resize.call(this);
    $W.resize(resize);
};