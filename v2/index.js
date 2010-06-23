function S4() {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}
function guid() {
   return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}
function uniqueID() {
	return 'id' + guid();
}
var STATE = {
	guid: 'x'
	, zIndexMax: 0
	, top: 0
	, left: 0
	, height: 0
	, content: ''
	, frontMostZIndex: function() {
		this.zIndexMax += 1;
		return this.zIndexMax;
	}
	, saveExtAjax: function(params){
		Ext.Ajax.request({
			url: 'save.php',
			type: 'POST',
			params: params, 
			success: function(response, opts) {
				// alert(response.responseText);
				if (response == 'ok') {
					// something good
				} else {
					// something else
					// alert('something went wrong.');
				}
			}
		});
	}
	, save: function(params){
		this.saveExtAjax(params);
	}
};

var myOverlay;
var getDraggableConfig = function(id) {
	return {
		// cancelSelector: ''
		constrain: 'everything',
		delay: 0,
		direction: 'both',
		disabled: false,
		baseCls:'x-plain',
		// group: 'base',
		listeners: {
			dragstart: function() {
				// nothing
				var elem = Ext.get(id);
				elem.setStyle({
					zIndex: STATE.frontMostZIndex()
				});
			},
			touch:  function() {
				// nothing
				var elem = Ext.get(id);
				elem.setStyle({
					zIndex: STATE.frontMostZIndex()
				});
			},
			dragend: function() {
				var elem = Ext.get(id);
				STATE.save({
					guid : id,
					top : elem.getTop(),
					left : elem.getLeft(),
					content : elem.dom.innerHTML,
					height : elem.getHeight()
				});
			},
			drag: function() {
				// nothing
			}
		},
	    revert: false
	}
}


Ext.setup({
    icon: 'icon.png',
    tabletStartupScreen: 'tablet_startup.png',
    phoneStartupScreen: 'phone_startup.png',
    glossOnIcon: false,
    onReady: function(){

		Ext.get('everything').on('click', function(e, t){

			if (t.getAttribute('id') !== 'everything') {
				return;
			}
		
			var id = uniqueID();
			var newDiv = Ext.DomHelper.append('everything', {tag : 'div', id :id , cls : 'instance', });
			Ext.get(id).setStyle({
				top: e.xy[1],
				left: e.xy[0]
			});
	        var overlayTb = new Ext.Toolbar({
	            dock: 'bottom',
				items: [{
                    text: 'Save',
                    ui: 'action',
                    handler: function() {
						var elem = Ext.get(id);
						elem.addClass('savedNote').dom.innerHTML = Ext.get('inputText').getValue();
						STATE.save({
							guid : id,
							top : elem.getTop(),
							left : elem.getLeft(),
							content : Ext.get('inputText').getValue(),
							height : elem.getHeight()
						});
						new Ext.util.Draggable(id, getDraggableConfig(id));
						myOverlay.destroy();
                    }
                }]
	        });

	        myOverlay = new Ext.Panel({
	            floating: true,
	            modal: true,
	            centered: true,
	            width: Ext.platform.isPhone ? 260 : 400,
	            height: Ext.platform.isPhone ? 220 : 400,
	            styleHtmlContent: true,
	            dockedItems: overlayTb,
	            scroll: 'vertical',
	            // contentEl: 'hiddenForm',
				html: "<form action='.' method='POST'><textarea id='inputText' style='width: "+(Ext.platform.isPhone ? 200 : 340)+"px;height: "+(Ext.platform.isPhone ? 160 : 340)+"px'><\/textarea><\/form>",
	            cls: 'htmlcontent'
	        });
            myOverlay.show();

		
		} );
		// initialize the saved notes
		Ext.select('div.savedNote').each(function(){
			var id = this.getAttribute('id');

			var div = this;
			var div2 = document.getElementById(id);
			this.setStyle({
				height: '10px'
			});
			// alert(div.getHeight());
			// alert(document.getElementById(id).clientHeight);
			// TODO I want to right-size these elements!
			
			// if ( div.getWidth() !== div2.clientWidth || div.getHeight() () !== div2.clientHeight ) {
			// 	while (div.getWidth() !== div2.clientWidth || div.getHeight() () !== div2.clientHeight) {
			// 		// var h = div.getHeight() + 2;
			// 		alert(h);
			// 		div.setStyle({
			// 			height: (div2.clientHeight)
			// 		});     // element just got scrollbars
			// 	}
			// }


			// fix the height
			new Ext.util.Draggable(id, getDraggableConfig(id));
		});

    }



});



