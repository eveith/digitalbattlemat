// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

/**
 * Shows a prompt (i. e. a <div> and the shadow) when needed.
 * @param id HTML id of the <div> that shall be shown
 * @see hide_fullscreen_prompt(id)
 */
function display_fullscreen_prompt(id) {
	$('shadow').style.display = "block";
	$(id).style.display = "block";
}


/**
 * Hides a prompt (i. e. a <div> and the shadow) when needed.
 * @param id HTML id of the <div> that shall be hidden
 * @see show_fullscreen_prompt(id)
 */
function hide_fullscreen_prompt(id) {
	$(id).style.display = "none";
	$('shadow').style.display = "none";
}


/**
 * The currently shown dropdown
 */
var current_dropdown_id = null;


/**
 * Toggles a dropdown prompt. If no prompt is shown, it displays the clicked.
 * If there is already one shown, it hides the old one and displays the new.
 * If the user didn't click on any new prompt, the old one is hidden, but no
 * new one shown.
 * @param id The prompt's HTML id.
 */
function toggle_dropdown(id) {
	var new_dropdown_id = null;
	
	if(null != id && id != current_dropdown_id) {
		$(id).style.display = "block";
		new_dropdown_id = id;
	}
	
	if(null != current_dropdown_id)
		$(current_dropdown_id).style.display = "none";
	
	current_dropdown_id = new_dropdown_id;
}


/**
 * Window in which the mat pops up.
 */
var battle_mat_window = null;


/**
 * Used to modifiy the number of rows a Mat has.
 * @param n Number of rows that are to be added or removed. Positive values add
 * 	n rows to the mat, while negative values remove n rows.
 */
function mat_modify_row_count(n) {
	var mini_mat = $("mini-mat");
	var mat = battle_mat_window.document.getElementById("mat");
	mat = $(mat);
	var tbody = null;
	
	/* Modify Mini Mat first. */
	/* Get array of minimat elements. */
	tbody = mini_mat.childElements()[0];
	
	/* Sanity check: Don't make it smaller than 1 row. If we check and abort 
	 * here, the big mat won't be affected, too.
	 */
	if(1 == tbody.childElements().length && n < 0) return;

	/* Decided whether to add or remove rows */
	if(n > 0) {
		/* Add */
		for(var i = 0; i != n; ++i) {
			/* Create new tr */
			var tr = new Element("tr", {
				id: "mini-mat-row-" + tbody.childElements().length
			});
			
			/* Add tds to the new row */
			for(var j = 0; j != tbody.childElements()[0].childElements().length;
					++j) {
				var td = new Element("td", {
					id: "mini-mat-cell-" + tbody.childElements().length +
						"x" + j
				});
				tr.insert(td, { position: "bottom" });
			}
			
			/* Append new tr to the tbody */
			tbody.insert(tr, { position: "bottom" });
		}
	} else {
		/* Remove */
		for(var i = 0; i != (n * -1); ++i) {
			var trs = tbody.childElements();
			trs[trs.length - 1].remove();
		}
	}
	
	
	/* Now the same for the real Mat */
	tbody = mat.childElements()[0];
	
	/* Decided whether to add or remove rows */
	if(n > 0) {
		/* Add */
		for(var i = 0; i != n; ++i) {
			/* Create new tr */
			var tr = new Element("tr", {
				id: "mat-row-" + tbody.childElements().length
			});
			
			/* Add tds to the new row */
			for(var j = 0; j != tbody.childElements()[0].childElements().length;
					++j) {
				var td = new Element("td", {
					id: "mat-cell-" + tbody.childElements().length + "x" + j
				});
				tr.insert(td, { position: "bottom" });
			}
			
			/* Append new tr to the tbody */
			tbody.insert(tr, { position: "bottom" });
		}
	} else {
		/* Remove */
		for(var i = 0; i != (n * -1); ++i) {
			var trs = tbody.childElements();
			trs[trs.length - 1].remove();
		}
	}	
	/* Update dimension display */
	$("mat-x-dimension").innerHTML = tbody.childElements().length;
}


/**
 * Used to modifiy the number of columns a Mat has.
 * @param n Number of columns that are to be added or removed. Positive values 
 * 	add n columns to the mat, while negative values remove n columns.
 */
function mat_modify_column_count(n) {
	var mini_mat = $("mini-mat");
	var mat = battle_mat_window.document.getElementById("mat");
	mat = $(mat);
	var tbody = null;
	
	/* Mini Mat comes first. */
	tbody = mini_mat.childElements()[0];
	
	/* Sanity first: Check that the number of columns doesn't go below 1.
	 * We check it with the Mini Mat here first, but exit the whole 
	 * function, so the real Mat won't get affected, too.
	 */
	if(1 == tbody.childElements()[0].childElements().length && n < 0) return;

	/* Add or remove? */
	if(n > 0) {
		/* Add column */
		for(var i = 0; i != n; ++i) {
			var trs = tbody.childElements();
			for(var j = 0; j != trs.length; ++j) {
				var td = new Element("td", {
					id: "mini-mat-cell-" + (i+1) + "x" + 
						trs[j].childElements().length
				});
				trs[j].insert(td, { position: "bottom" });
			}
		}
	} else {
		/* Remove column */
		for(var i = 0; i != (n * -1); ++i) {
			var trs = tbody.childElements();
			for(var j = 0; j != trs.length; ++j) {
				var tds = trs[j].childElements();
				tds[tds.length - 1].remove();
			}
		}
	}
	
	/* Now the real Mat. */
	tbody = mat.childElements()[0];
	
	/* Add or remove? */
	if(n > 0) {
		/* Add column */
		for(var i = 0; i != n; ++i) {
			var trs = tbody.childElements();
			for(var j = 0; j != trs.length; ++j) {
				var td = new Element("td", {
					id: "mat-cell-" + (i+1) + "x" + 
						trs[j].childElements().length
				});
				trs[j].insert(td, { position: "bottom" });
			}
		}
	} else {
		/* Remove column */
		for(var i = 0; i != (n * -1); ++i) {
			var trs = tbody.childElements();
			for(var j = 0; j != trs.length; ++j) {
				var tds = trs[j].childElements();
				tds[tds.length - 1].remove();
			}
		}
	}
	
	/* Set new display size */
	$("mat-y-dimension").innerHTML = 
		(tbody.childElements())[0].childElements().length;
}