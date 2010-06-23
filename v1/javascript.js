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
	, top: 0
	,left: 0
	, height: 0
	, content: ''
	, save: function(div){
		$.ajax({
			type: 'POST',
			url: 'save.php',
			data: {
				'guid': STATE.guid,
				'top': STATE.top,
				'left': STATE.left,
				'height': STATE.height,
				'content': STATE.content
			},
			success: function(data) {
				if (data == 'ok') {
					// something good
				} else {
					// something else
				}
			},
			dataType: 'text'
		});
	}
}
