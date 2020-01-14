 (function ( $ ) {
	 
	 /**
	 * BEST NAVIGATION
	 * @version 2.0.3
	 * @author Senthil Kumar
	 */
 
    $.fn.bestnav = function( options ) {
		
		//DEFAULT VALUES
        var defaults = {
			breakpoint : 1023,
			dropDownWidth : 200,
			customUlClass : "menu",
			mobileBtnCustom : false,
			mobileBtnClass : "navBtn",
			mobileNavLinkClickClose : false,
			addBodyClass : false,
        };
		//OVERIDE DEFAULT VALUES
		var settings = $.extend({}, defaults, options);
		
		//MAIN VARIABLES
		var $selector = $(this);
		var winWidth = $(window).width();
		var winHeight = $(window).height();
		var handheld = false;
		var breakpoint = settings.breakpoint;
		var dropDownWidth = settings.dropDownWidth;
		var mobileBtnCustom = settings.mobileBtnCustom;
		var mobileBtnClass =  settings.mobileBtnClass;
		var mobileNavLinkClickClose = settings.mobileNavLinkClickClose;
		
		var addBodyClass = settings.addBodyClass;
		
		var $navBtn = $('.'+settings.mobileBtnClass);
		
		var $menuWrapper =  $selector.find(' > .menuWrapper');
		var customUlClass = settings.customUlClass;
		var $primaryUL = $selector.find('ul.'+customUlClass);
		var $primaryItems = $primaryUL.find(' > li');
		var $allUl = $selector.find('ul');
		var $allItems = $primaryUL.find('li');
		
		var currentNavPos = 0;
		var oldWidth = $(window).width();
		
		//ADDING HANDHELD NAVBTN
		if(!mobileBtnCustom){
			$selector.prepend('<div class="'+ mobileBtnClass +'"></div>');
			$navBtn = $('.'+settings.mobileBtnClass);
		}
		
		//WINDOW RESIZE FUNCTIONS
		$(window).resize(function(){
			winWidth = $(window).width();
			winHeight = $(window).height();
			
			if(oldWidth != winWidth){
			    oldWidth = winWidth;
			    handheldChk();
			    clsMobiMenu();
			}
			
		});
		//HANDHELD CHECK FUNCTION
		function handheldChk(){
			if(winWidth > breakpoint && breakpoint !== 0){
				handheld = false; 
				$selector.removeClass('handheld');
				if(addBodyClass){ $('body').removeClass('handheldView'); }
				//POSITIONING SUBNAV CONTAINERS
				$menuWrapper.show(0);
				$primaryUL.find('ul').hide(0).css({'width':dropDownWidth+'px'}).find('ul').hide(0).css({'left':dropDownWidth+'px'});
				$menuWrapper.css({'height':'','overflow-x':'visible'});
				//alert($primaryUL('ul ul'));
				$('#bestNav').animate({'opacity':1});
			}else if(winWidth <= breakpoint || breakpoint === 0){
				handheld = true; 
				$selector.addClass('handheld'); 
				if(addBodyClass){ $('body').addClass('handheldView'); }
				$primaryUL.find('ul').css({'width':''}).find('ul').css({'left':''});
				$menuWrapper.hide(0);
				$('#bestNav').animate({'opacity':1});
			}
		}
		handheldChk();
		
		//DESKTOP DROPDOWN NAV FUNCTION
		$selector.on({
			mouseenter : function(){ 
				if(!handheld && $(this).find(' > ul').length > 0){ dropDown($(this),true); }
			},
			mouseleave : function(){ 
				if(!handheld && $(this).find(' > ul').length > 0){ dropDown($(this),false); }
			}
		},'li');
		
		//DROPDOWN FUNCTIONS
		function dropDown(elm,action){
			var $subNav = elm.find(' > ul');
			var firstUl = elm.parent().hasClass(customUlClass);
			if(action){
				//CALCULATING WINDOW WIDTH AGAINST DD MENU WIDTH, THEN DECIDE WHERE TO DISPLAY DD MENU (LEFT OR RIGHT)
				if(firstUl){ $subNav.css({'left':'','right':''});
				}else{ $subNav.css({'left':dropDownWidth+'px','right':''}); }
				
				var subNavLft = $subNav.show(0).offset().left;
				$subNav.hide(0);
				
				if(dropDownWidth + subNavLft > winWidth){ 
					if(firstUl){ $subNav.css({'left':"",'right':'0'}); 
					}else{ $subNav.css({'left':"",'right':dropDownWidth+'px'});  }
				}else{ 
					if(firstUl){ $subNav.css({'left':"0",'right':''}); 
					}else{ $subNav.css({'left':dropDownWidth+'px'});  }
				}
				
				$subNav.stop().fadeIn(200);
			}else{
				$subNav.stop().fadeOut(200, function(){ $subNav.css({'left':'','right':''}); });
				
			}
		}
		
		//ADDING ARROWS FOR SUBNAV CONTAINERS
		function addMarkers(){
			$allItems.has('ul').find('> a').each(function(){
				var anchroLink = $(this).attr('href');
				if(anchroLink === "#"){
					$(this).addClass('accordLink');
				}
				
			});
			$allItems.has('ul').addClass('subNavParent').prepend('<span class="accordLink"></span>');
		}
		
		addMarkers();
		
		
		//HANDHELD NAV BUTTON FUNCTION
		$navBtn.on('click',function(){
			handHeldNavFunc();
		});
		
		var naveBeingOpened = false;
		function handHeldNavFunc(){
			
			if(naveBeingOpened){ return; }
			naveBeingOpened = true;
			setTimeout(function(){ naveBeingOpened = false; },400);
			
			var navActive = $navBtn.hasClass('navActive');
			if(!navActive){
				var navTop = $menuWrapper.css('top');
				$menuWrapper.css({'overflow-x':'auto','height':winHeight-navTop+'px'}).fadeIn();
				$navBtn.addClass('navActive');
				if(addBodyClass){ $('body').addClass('navOpened'); }
				
			}else if(navActive){
				clsMobiMenu();
			}
			
			if(!navActive){
				var itemHeight = $primaryUL.find(' > li > a').innerHeight();
				$primaryUL.find('span.accordLink').css({'height':itemHeight+'px'});	
			}
		}
		
		function clsMobiMenu(){ 
			var navActive = $navBtn.hasClass('navActive');
			if(navActive){
				$navBtn.removeClass('navActive');
				if(addBodyClass){ $('body').removeClass('navOpened'); }
				$menuWrapper.hide(0, function(){ $(this).css({'height':'','display':''}); });
			}
			$primaryUL.find('ul').slideUp();
			$primaryUL.find('span.accordLink').removeClass('active');
		}
		
		//CLOSE NAV WHEN CLICK OUTSIDE OR NAV LINKS
		$(document).on('click',function(e){
			if(handheld && !mobileNavLinkClickClose){
				var selId = $selector.attr('id');
				if(!$(e.target).is('.'+settings.mobileBtnClass+', .'+settings.mobileBtnClass+' *,#'+selId+' *')){ clsMobiMenu(); }
			}else if(handheld){
				if(!$(e.target).is('.'+settings.mobileBtnClass)){ clsMobiMenu(); }
			}
		});
		
		
		//SUBNAV ARROW CLICK FUNCTION
		$selector.on('click','.accordLink',function(e){
			e.preventDefault();
			if(handheld){
				$(this).toggleClass('active').parent().find(' > ul').slideToggle(300);
				$(this).parent().siblings().find('ul').slideUp();
				$(this).parent().siblings().find('.accordLink').removeClass('active');
			}
		});
		
		
		
 		//RETURN THIS OBJECT FOR CHAINABLITY
        return this;
 
    };
	
	
	/**
	 * BEST TABS
	 * @version 3.0.2
	 * @author Senthil Kumar
	 */
 
    $.fn.besttabs = function( options ) {
		
		//DEFAULT VALUES
        var defaults = {
			breakpoint:767, // You can also use HTML5 data attribute in the main container( ex: data-breakPoint="991" ) IMPORTANT: data attribute overides jquery breakpoint.
			effect:'none',
			tabNavClass:'tabsNav',
			tabCntClass:'tabContnt',
			tabSecondaryNavElem:'.tabsSecNav a',
			urlChange:true,
			scrollToNav:true,
			scrollToElem:'',
			scrollTopOffsetTab:0,
			scrollTopOffsetAccord:0,
			selfClose:false,
			changedToSmall: function(){},
			changedToLarge: function(){},
			beforeChange: function(){},
			afterChange: function(){}
		};
	   
		//OVERIDE DEFAULT VALUES
		var settings = $.extend({}, defaults, options);
		
		//MAIN VARIABLES
		var $selector = $(this);
		var breakpoint = settings.breakpoint;
		
		if($selector.attr('data-breakPoint')){
			breakpoint = $selector.attr('data-breakPoint');
		}
		
		var effect = settings.effect;
		var urlChange = settings.urlChange;
		
		var tabNavClass = '.'+settings.tabNavClass;
		var $tabNav = $(tabNavClass);
		
		var tabSecNavElem = settings.tabSecondaryNavElem;
		
		var tabCntClass = '.'+settings.tabCntClass;
		var $tabCnt = $(tabCntClass);
		
		var urlMatch = false;
		
		var scrollToNav = settings.scrollToNav;
		var $scrollToElem = (settings.scrollToElem === "")? $tabNav: $(settings.scrollToElem) ;
		var scrollToPos = $scrollToElem.offset().top;
		var scrollTopOffsetTab = settings.scrollTopOffsetTab;
		var scrollTopOffsetAccord = settings.scrollTopOffsetAccord;
		
		var selfClose = settings.selfClose;
		
		//var changeUrl;	
		var istabs = true;
		var breakLarge, breakSmall = false;
		
		//METHOD FOR CREATING ACCORDION LINKS
		function createAccodianLinks(){
			var counter = 0;
			$tabNav.find('a').each(function(){
				var id = $(this).attr('href');
				var accordLabel = $(this).text();
				if(counter == 0){
					var accordAnchor = '<a href="'+id+'" class="tabsAccordLink active">'+accordLabel+'</a>';
				}else{
					var accordAnchor = '<a href="'+id+'" class="tabsAccordLink">'+accordLabel+'</a>';
				}
				var elem = $(this).attr('href');
				$selector.find(elem).prepend(accordAnchor);
				counter++;
			});
		}
		createAccodianLinks();
		
		//METHOD FOR CHANGING EVERYTHING BETWEEEN TABS AND ACCORDION
		function checkTabs(){
			var winWidth = $(window).width();
			if(winWidth > breakpoint){ 
				istabs = true;
				$selector.removeClass('accordion');
				if(!breakLarge){ settings.changedToLarge(); breakLarge = true; breakSmall = false; }
				
				if(selfClose && $selector.find('.currentTab').length <= 0){
					var url = window.location.href;
					showTabByURL(url);
				}
			}else{
				istabs = false;
				$selector.addClass('accordion'); 
				if(!breakSmall){ settings.changedToSmall(); breakSmall = true; breakLarge = false; }
			}
		}
		checkTabs();
		
		//WINDOW RESIZE MTHOD
		$(window).resize(function(){
			checkTabs();
		});
		
		//CAPTURE URL TO CHANGE THE TABS
		if(urlChange){ 
			var url = window.location.href;
			showTabByURL(url);
		}
		
		
		//ACCORDION NAV CLICK METHOD
		$tabCnt.on('click','a.tabsAccordLink',function(e){
			e.preventDefault();
			var id = $(this).attr('href');
			
			$(this).toggleClass('active').parent().siblings().find('a.tabsAccordLink').removeClass('active');
			
			//CHANGING TABS NAV FROM ACCORDIAN FOR RESPONSIVENESS
			$tabNav.find('a[href="'+id+'"]').addClass('active').siblings().removeClass('active');
			
			changeUrl(this.hash);
			switchTabs(id);
			
		});
		
		//TABS NAV CLICK METHOD
		$tabNav.on('click','a',function(e){
			e.preventDefault();
			var id = $(this).attr('href');
			
			var tabsCntHeight = $selector.find(tabCntClass+id).innerHeight();
			$tabCnt.parent().css({'height':tabsCntHeight});
			
			//CHANGING ACCORDIAN NAV FROM TABS FOR RESPONSIVENESS
			$selector.find(tabCntClass+id).find('a.tabsAccordLink').addClass('active').parent().siblings().find('a.tabsAccordLink').removeClass('active');
			
			$(this).addClass('active').siblings().removeClass('active');
			$tabCnt.removeClass('currentTab');
			
			changeUrl(this.hash);
			switchTabs(id);
			
			scrollToPlace();
			
		});
		
		//TABS SECONDARY NAV CLICK METHOD
		$(tabSecNavElem).on('click',function(e){
			
			var url = window.location.href;
			var urlId = url.split('#');
			
			var secNavUrl = $(this).prop('href');
			var secNavId = secNavUrl.split('#');
			
			if(secNavId[0] === urlId[0]){
				e.preventDefault();
				
				if(istabs){
					var tabsCntHeight = $selector.find(tabCntClass+"#"+secNavId[1]).innerHeight();
					$tabCnt.parent().css({'height':tabsCntHeight});
					$tabCnt.removeClass('currentTab');
					scrollToPlace();
				}
				$tabNav.find('a[href="#'+secNavId[1]+'"]').addClass('active').siblings().removeClass('active');
				$selector.find(tabCntClass+"#"+secNavId[1]).find('a.tabsAccordLink').addClass('active').parent().siblings().find('a.tabsAccordLink').removeClass('active');
				
				changeUrl(this.hash);
				switchTabs("#"+secNavId[1]);
			}
		});
		
		//METHOD FOR CHANGE THE TABS BY URL
		function showTabByURL(url){
			var id = url.split('#');
			
			//MAKING TAB SELECTION
			$tabNav.find('a').each(function() {
				var tabLinks = $(this).attr('href');
				tabLinks = tabLinks.replace('#','');
				
				if(id[1] === tabLinks){
					urlMatch = true;
					$tabNav.find('a').removeClass('active');
					$(this).addClass('active');
					//DISPLAY APPROPRIATE TAB 
					$tabCnt.removeClass('currentTab');
					
					switchTabs("#"+id[1]);
				}
				$selector.find(tabCntClass+"#"+id[1]).find('a.tabsAccordLink').addClass('active').parent().siblings().find('a.tabsAccordLink').removeClass('active');
			});
			
			if(urlMatch && istabs){
				scrollToPlace();
			}
			
		}
			
		//TABS SWITCHING METHOD
		function switchTabs(tabId){
			settings.beforeChange();
			if(istabs){
				switch(effect){
					case "fade": fadeTabs(tabCntClass+tabId);
					break;
					case "fadingSlide": fadeSlideTabs(tabCntClass+tabId);
					break;
					case "none": chngTabs(tabCntClass+tabId);
					break;
					default: chngTabs(tabCntClass+tabId);
				}	
			}else{
				slideAccordian(tabCntClass+tabId);
			}
		}
		
		//EFFECTS METHODS
		//NO EFFECT METHOD
		function chngTabs(elem){
			$selector.find(elem).addClass('currentTab');
			removeTabParentHeight();
			settings.afterChange();
		}
		//FADE METHOD
		function fadeTabs(elem){
			$selector.find(elem).addClass('currentTab').css({'opacity':'0'})
			.animate({'opacity':'1'},function(){
				$(this).css({'opacity':''});
				removeTabParentHeight();
				settings.afterChange();
			});
		}
		//FADE WITH SLIDING METHOD
		function fadeSlideTabs(elem){
			$selector.find(elem).addClass('currentTab').css({'opacity':'0','right':'-50px'})
			.animate({'opacity':'1','right':'0px'},function(){
				$(this).css({'opacity':'','right':''});
				removeTabParentHeight();
				settings.afterChange();
			});
		}
		
		//ACCORDION METHOD
		function slideAccordian(elem){
			if($(elem).hasClass('currentTab') && selfClose){
				$(elem+' .tabsContetBody').slideUp(function(){
					$(elem).removeClass('currentTab');
					$(this).css({'display':''});
				});
			}else if(!$(elem).hasClass('currentTab')){
				$tabCnt.find('.tabsContetBody').slideUp();
				$selector.find(elem+' .tabsContetBody').slideUp(0).slideDown(function(){
					$tabCnt.removeClass('currentTab');
					$selector.find(elem).addClass('currentTab');
					$selector.find('.tabsContetBody').css({'display':''});
					
					var accordTop = $selector.find(elem).offset().top;
					scrollToPlace(accordTop);
					settings.afterChange();
				});
			}
		}
		
		//REMOVING TABS CONTENT CONTAINER HEIGHT FOR RESPONSIVENESS
		function removeTabParentHeight(){
			if(istabs){
				$tabCnt.parent().css({'height':''});
			}
		}
		
		function changeUrl(url){
			var pos = $(window).scrollTop();
			window.location.hash = url;
			$(window).scrollTop(pos);	
		}
		
		//METHOD FOR SMOOTH SCROLL TABS TO DEFIENED POSITION
		function scrollToPlace(accordTop){
			if(scrollToNav){
				if(istabs){
					scrollToPos = $scrollToElem.offset().top+scrollTopOffsetTab;
					$('html, body').animate({scrollTop:scrollToPos});
				}else{
					scrollToPos = accordTop+scrollTopOffsetAccord;
					if(scrollToPos < $(window).scrollTop()){
						$('html, body').animate({scrollTop:scrollToPos});
					}
				}
			}
		}
		
 		//RETURN THIS OBJECT FOR CHAINABLITY
        return this;
 
    };
 
}( jQuery ));
