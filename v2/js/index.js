var STATE = {
	guid: '_'
	, USELOCALSTORAGE: true // at least one of these must be true
	, USEPHPSTORAGE: true // at least one of these must be true
	, zIndexMax: 1
	, top: 0
	, left: 0
	, height: 0
	, content: ''
	, workingAreaId: 'everything'
	, localStorageKey: 'artlungNotes'
	, createUniqueId: function() {
		return '_' + this.guid();
	}
	, guid: function(){
	   return (this._S4()+this._S4()+"-"+this._S4()+"-"+this._S4()+"-"+this._S4()+"-"+this._S4()+this._S4()+this._S4());
	}
	, _S4: function() {
	   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	}
	, frontMostZIndex: function() {
		this.zIndexMax += 1;
		return this.zIndexMax;
	}
	, getSavedNotesPhp: function() {
		// TODO: include function to grab files from load.php
	}
	, getSavedNotesLocalStorage: function() {
		var key = this.localStorageKey;
		var notes = window.localStorage.getItem(key);
		if (notes === null) {
			window.localStorage.setItem(key, '{}');
		} else {
			notes = Ext.decode(notes);
		}
		var outstr = '';
		for(key in notes) {
			var $item = notes[key];
			outstr += "<div class=\"instance savedNote\" id=\""+$item['guid']+"\" style=\"top:"+$item['top']+"px;left:"+$item['left']+"px;/*height:"+$item['height']+"px;*/\">"; // not using height
			outstr += $item['content'];
			outstr += "<\/div>\n";
		}
		return outstr;	}
	, getSavedNotes: function() {
		if (this.USELOCALSTORAGE) {
			return this.getSavedNotesLocalStorage();
		}
		//  else if (this.USEPHPSTORAGE) {
		// 	this.saveExtAjax(params);
		// }
	}
	, localStorageOk: function() {
		return ('localStorage' in window) && window['localStorage'] !== null;
	}
	, saveLocalStorage: function(params) {
		var key = this.localStorageKey;
		// window.localStorage.removeItem(key);
		// window.localStorage.clear();
		var notes = window.localStorage.getItem(key);
		if (notes === null) {
			window.localStorage.setItem(key, '{}');
		} else {
			notes = Ext.decode(notes);
		}
		notes[params.guid] = params;
		window.localStorage.setItem(key, Ext.encode(notes));
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
		if (this.USELOCALSTORAGE) {
			this.saveLocalStorage(params);
		} 
		if (this.USEPHPSTORAGE) {
			this.saveExtAjax(params);
		}
	}
};

// myOverlay global var
var myOverlay;

// Generate the configuration we need for the Ext.Draggable
var getDraggableConfig = function(id) {
	return {
		// cancelSelector: ''
		constrain: STATE.workingAreaId,
		delay: 0,
		direction: 'both',
		disabled: false,
		baseCls:'x-plain',
		// group: 'base',
		listeners: {
			dragstart: function() {
				// not even sure these are doing anything
				var elem = Ext.get(id);
				elem.setStyle({
					zIndex: STATE.frontMostZIndex()
				});
			},
			touch:  function() {
				// not even sure these are doing anything
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
					height : elem.getHeight() // actually not using this anymore
				});
			},
			drag: function() {
				// not even sure these are doing anything
				// not sure what to here
			}
		},
		revert: false
	}
}


Ext.setup({
	icon: 'icon.png', // TODO: graphics
	tabletStartupScreen: 'tablet_startup.png', // TODO: graphics
	phoneStartupScreen: 'phone_startup.png', // TODO: graphics
	glossOnIcon: false,
	onReady: function(){

		Ext.get(STATE.workingAreaId).on('click', function(e, t){

			if (t.getAttribute('id') !== STATE.workingAreaId) {
				return;
			}
		
			var id = STATE.createUniqueId();
			var newDiv = Ext.DomHelper.append(STATE.workingAreaId, {tag : 'div', id :id , cls : 'instance', html: '&nbsp;'});
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
			// make draggable
			new Ext.util.Draggable(id, getDraggableConfig(id));
			
		});

	}



});



