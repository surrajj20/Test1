jQuery( document ).ready(function( $ ) {
	
	var winWidth = $(window).width();
	var winHeight = $(window).height();
	var winTop = $(window).scrollTop();
	
	$(window).resize(function(){
		winWidth = $(this).width();
		winHeight = $(this).height();
	});
	
	$(window).scroll(function(){
		winTop = $(this).scrollTop();
		
		isScrolling();
	});
	
	function isScrolling(){
		if(winTop > 100){ $('#masterhead').addClass('scrolling');  
		}else{ $('#masterhead').removeClass('scrolling');  }
		
		if(winTop > 100){ $('body').addClass('bodyScrolling');  
		}else{ $('body').removeClass('bodyScrolling');  }

	}
	isScrolling();
	
	function getScrollbarWidth() {
		var outer = document.createElement("div");
		outer.style.visibility = "hidden";
		outer.style.width = "100px";
		outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps
	
		document.body.appendChild(outer);
	
		var widthNoScroll = outer.offsetWidth;
		// force scrollbars
		outer.style.overflow = "scroll";
	
		// add innerdiv
		var inner = document.createElement("div");
		inner.style.width = "100%";
		outer.appendChild(inner);        
	
		var widthWithScroll = inner.offsetWidth;
	
		// remove divs
		outer.parentNode.removeChild(outer);
	
		return widthNoScroll - widthWithScroll;
	}
	
	$('.memberContainer .memberImg').on('click',function(){
		var scw = getScrollbarWidth();
		$('html').css({'overflow':'hidden','padding-right':scw+'px'});
		var popCnt = $(this).parent().find(' > .memPopup').html();
		$('#mPopCntWrap').html(popCnt);
		$('#mPopBox, .mPopOverlay').fadeIn();
	});
	
	$(document).on('click','#mPopCls, .mPopOverlay',function(e){
		e.preventDefault();
		$('#mPopBox, .mPopOverlay').fadeOut(function(){
			$('html').css({'overflow':'','padding-right':''});
		});
		
	});
	
	
		
	
});
