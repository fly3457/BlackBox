(function (window, document, $, undefined){

	var W = $(window),
			D = $(document);

	
	BlackBox = function(setting){
		//默认设置
		var Default = {
			clickOutShake:true
		}
		this.settings = Default;
		//将用户的自定义设置写入属性
		if(setting){
			for (var _key in setting){
				if(_key in Default)this.settings[_key] = setting[_key]
			}
		}
		//打开盒子
		this.open = $.noop
		//关闭盒子
		this.close = function(){
		}
		is_box_open = false;
	}
	
	BlackBox.prototype.alert = function(text,callback){
		this._createGap();
		var html = "<div class = system><p>"+text+"</p></div>"
		this._createBox(html);
		var _close = this._close;
		this._createButton(_onConfirm=function(){
			if(callback)callback();
			_close();
		})
		return true;
	}
	
	BlackBox.prototype.confirm = function(text,onConfirm,onCancel){
		this._createGap();
		var html = "<div class = system><p>"+text+"</p></div>"
		this._createBox(html);
		var _close = this._close;
		this._createButton(_onConfirm=function(){
			if(onConfirm)onConfirm();
			_close();
		},_onCancel = function(){
			if(onCancel)onCancel();
			_close();
		}
		)
		return true;
	}
	
	BlackBox.prototype.load= function(){
		this._createGap();
		$("#BlackBox").append("<div id=BlackBoxload>载入中</div>")
		function _init_(){
		var W_width = W.width(),
				W_height = W.height();
		$("#BlackBoxload").css({
			left:(W_width-$("#BlackBoxload").width())/2,
			top:(W_height-$("#BlackBoxload").height())/2
		})
		}
		_init_();
		$(window).resize(function(){
			_init_();
		})
	}
	
	BlackBox.prototype.ready= function(){
		$("#BlackBox").remove();
	}
	
	
	BlackBox.prototype._init_ = function(){
		if($("#BlackBox").html())$("#BlackBox").remove();
		is_box_open = true;
	}
	
	BlackBox.prototype._createButton = function(_onConfirm,_onCancel,_onClose){
		if(_onConfirm || _onCancel){
			$("#BlackBoxContent > .Inner").append("<div id = actions></div>")
			if(_onConfirm){
				$(".Inner > #actions").prepend("<div class = confirm>确认</div>")
				$("#actions > .confirm").click(function(){
					_onConfirm();
				})
			}
			if(_onCancel){
				$(".Inner > #actions").prepend("<div class = cancel>取消</div>")
				$("#actions > .cancel").click(function(){
					_onCancel();
				})
			}
		}
		if(_onClose){
			//预留给关闭按钮
		}
	}
	
	BlackBox.prototype._createBox= function(html){
		$("#BlackBox").append("<div id=BlackBoxContent></div>")
		var content = "<div class = Outer></div><div class = Inner>"+html+"</div>"
		$("#BlackBoxContent").html(content).fadeIn("fast")
		function _init_(){
			var W_width = W.width(),
					W_height = W.height(),
					U_width = $("#BlackBoxContent > .Inner").width()+18,
					U_height = $("#BlackBoxContent > .Inner").height()+18;
			$("#BlackBoxContent").css({
				left:(W_width-U_width)/2,
				top:(W_height-U_height)/2,
				width:U_width,
				height:U_height
			});
			$("#BlackBoxContent > .Outer").css({
				width:U_width,
				height:U_height
			}).fadeTo(0, 0.6);
		}
		_init_();
		if(this.settings.clickOutShake){
			$("#BlackBoxGap").click(function(){
				$("#BlackBoxContent").BlackBoxShake()
			})
		}
		$(window).resize(function(){
			_init_();
		})
	}
	
	BlackBox.prototype._createGap = function(){
		//初始化，防止有未关闭的盒子
		this._init_();
		$("body").append("<div id=BlackBox><div id=BlackBoxGap></div></div>")
		function _init_(){
			var W_width = W.width(),
					W_height = W.height();
			$("#BlackBoxGap").css({
				width:W_width,
				height:W_height
			}).fadeTo(0, 0.6);
			if ( $.browser.msie && $.browser.version =="6.0" ){
				$(window).scroll(function(){
					$("#BlackBox").css({
						position:"absolute",
						top:$(document).scrollTop()
					})
				})
			}
		}
		_init_();
		$(window).resize(function(){
			_init_();
		})
	};
	
	
	//由于此处出现BUG，需要修改！！
	BlackBox.prototype._close = function(){
		if(is_box_open)$("#BlackBox").remove();
		is_box_open = false;
	}
	
	$.BlackBox = BlackBox
	
	//向jquery中添加抖动的方法
	$.fn.extend({"BlackBoxShake": function (){
		var $panel = $(this),
				box_left = $panel.offset().left;
		for(var i=1; 4>=i; i++){
			$panel.animate({left:box_left-(12-3*i)},50);
			$panel.animate({left:box_left+2*(12-3*i)},50);
		}
	}})

}(window,document,jQuery))