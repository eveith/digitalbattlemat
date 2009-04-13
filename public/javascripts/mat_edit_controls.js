function open_battle_mat_window(id) {
		battle_mat_window = window.open("/mats/" + id, "battle_mat_window", 
	"location=no,menubar=no,resizable=yes,left=0,screenX=0,top=0,screenY=0,status=no,toolbar=no,scrollbars=no,width=100%,height=100%");
}


function show_ajax_failure_window(request) {
	var error_window = window.open("");
	error_window.document.write(request.responseText);
}	


function save_mat(form, mat) {
	var action = form.action;
	var method = form.method;
	var mat = $("mini-mat");
	
	// Update HTTP request method
	for(element in form.elements) {
		if("_method" == element.name) {
			method = element.value;
			break;
		} 
	}
	
	// Create artifical form elements for the Mat dimensions (total)
	var dimensions = "mat[x_dimension]=" + mat.rows.length +
		"&mat[y_dimension]=" + mat.rows[0].cells.length;
		
	// Create a pseudo-list of all tiles in the format
	// mat[tile][row][column] = "visible;/path/to/tile/source".
	
	new Ajax.Request(action, {
		method: method,
		parameters: Form.serialize(form) + "&" + encodeURI(dimensions),
		onFailure: function(transport) {
			show_ajax_failure_window(transport);
			document.location.reload();
		}
	});
}



function set_mat_background(url) {
	battle_mat_window.document.body.style.backgroundImage = 
		"url(" + url + ")";
	$("mat-mini-container").style.backgroundImage =
		"url(" + url + ")";
}