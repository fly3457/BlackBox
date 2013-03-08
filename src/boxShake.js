/**
 * 抖动盒子
 */
BlackBox.fn.boxShake = function(){
    var $BlackBoxContent = $("#"+this._getNowID());
    if(!$BlackBoxContent[0])return;
    var box_left = $BlackBoxContent.offset().left;
    for(var i=1; 4>=i; i++){
        $BlackBoxContent.animate({left:box_left-(12-3*i)},50);
        $BlackBoxContent.animate({left:box_left+2*(12-3*i)},50);
    }
};