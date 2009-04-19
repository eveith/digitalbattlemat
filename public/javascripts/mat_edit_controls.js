function open_battle_mat_window(id) {
		battle_mat_window = window.open("/mats/" + id, "battle_mat_window", 
			"location=no,menubar=no,resizable=yes,left=0,screenX=0,top=0," +
			"screenY=0,status=no,toolbar=no,scrollbars=no," +
			"width=100%,height=100%");
}


function show_ajax_failure_window(request) {
	var error_window = window.open("");
	error_window.document.write(request.responseText);
}	


/**
 * Saves a complete battle mat, along with everything that belongs to it.
 * @param form The submitting form
 */
function save_mat(form) {
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
	var dimensions = encodeURI("mat[x_dimension]=" + mat.rows.length +
		"&mat[y_dimension]=" + mat.rows[0].cells.length);
	
	// Encode mat background, too
	var background = "";
	if($("mat-mini-container").style.backgroundImage) {
		background = encodeURI("mat[background]=" +
				$("mat-mini-container").style.backgroundImage);
	}
		
	// Create a pseudo-list of all tiles in the format
	// mat[tile][row][column][visibility] = "visible"
	// mat[tile][row][column][src] = "/path/to/tile/source"
	var tiles = "";
	for(var i = 0; i != mat.rows.length; ++i) {
		for(var j = 0; j != mat.rows[i].cells.length; ++j) {
			// Get visibility. Default is "visible"
			var visibility = "visible";
			if(mat.rows[i].cells[j].style.visibility) {
				visibility = mat.rows[i].cells[j].style.visibility;
			}
			
			// Try to get tile image and its src attribute, but keep a default
			var uri = "/images/textures/tiles/Spacer.png";
			var tile = $("mini-mat-tile-" + i + "x" + j);
			if(tile) {
				uri = tile.src;
			}
			
			// Add the & for HTTP POST, but only if neccessary.
			if((i == 0 && j > 0) || i > 0) {
				tiles += "&";
			}
			tiles += encodeURI("mat[tiles][" + i + "][" + j + "][visibility]=" +
					visibility);
			tiles += "&" + encodeURI("mat[tiles][" + i + "][" + j + "][src]=" +
					uri);
		}
	}
	
	
	new Ajax.Request(action, {
		method: method,
		parameters: Form.serialize(form) + "&" + dimensions + "&" + background +
			"&" + tiles,
		onFailure: function(transport) {
			show_ajax_failure_window(transport);
			document.location.reload();
		},
		onSuccess: function(transport) {
			// Get the "save" button and show some animation.
			Effect.Shrink($$(".button-mat-save")[0]);
			setTimeout('Effect.Grow($$(".button-mat-save")[0]);', 2000);
		}
	});
}



function set_mat_background(url) {
	battle_mat_window.document.body.style.backgroundImage = 
		"url(" + url + ")";
	$("mat-mini-container").style.backgroundImage =
		"url(" + url + ")";
}


var current_tile = null;


function set_tile(mini_mat_img) {
	if(null == current_tile || null == battle_mat_window) return;
	
	var mat_img = battle_mat_window.document.getElementById(
			mini_mat_img.id.replace(/^mini-/, ""));
	
	mini_mat_img.src = current_tile.src;
	mat_img.src = current_tile.src;
}
