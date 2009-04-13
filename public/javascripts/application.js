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
	var mat = $(battle_mat_window.document.getElementById("mat"));
	var mats = new Array(mini_mat, mat);
	
	/* Get number of visible rows: Loop until we've either found the first row
	 * that's marked with the style directive "display: none" or the end of the
	 * array. */
	var visible_rows_num = 0;
	for(; visible_rows_num != mat.rows.length; ++visible_rows_num)
		if("hidden" == mat.rows[visible_rows_num].cells[0].style.visibility)
			break;
	
	for(var m = 0; m != mats.length; ++m) {
		/* Add rows */
		if(n > 0) {
			for(var r = visible_rows_num - 1; r != visible_rows_num + n; ++r) {
				/* There are two cases: Either the row exists, but its cells are
				 * hidden, then we just set the "visibility" style attribute to
				 * "show". If there _is_ no row, we add a new one.
				 */
				if(r != mats[m].rows.length) {
					/* Row's just hidden */
					for(var c = 0; c != mats[m].rows[r].cells.length; ++c) {
						if(mats[m].rows[r-1].cells[c].style.visibility) {
							mats[m].rows[r].cells[c].style.visibility = 
								mats[m].rows[r-1].cells[c].style.visibility;
						} else {
							mats[m].rows[r].cells[c].style.visibility = 
								"visible";
						}
					}
				} else {
					/* Add a new row */
					var id_prefix = "mat";
					if(mini_mat == mats[m]) id_prefix = "mini-" + id_prefix;
					
					var tr = mats[m].insertRow(r);
					tr.id = id_prefix + "-row-" + (r+1);
					for(var c = 0; c != mats[m].rows[r-1].cells.length; ++c) {
						var td = tr.insertCell(c);
						td.id = id_prefix + "-cell-" + (r+1) + "x" + (c+1);
						td.innerHTML = "<img " +
							"src=\"/images/textures/tiles/Spacer.png\" " +
							"alt=\"Spacer\" class=\"spacer\" " +
							"id=\"" + id_prefix + "-tile-" + 
							(r+1) + "x" + (c+1) + "\" />";
						
						// Set style for this new cell, because it should match
						// the style of its counterpart in other rows
						if(mats[m].rows[r-1].cells[c].style.visibility) {
							td.style.visibility = 
								mats[m].rows[r-1].cells[c].style.visibility;
						} else {
							td.style.visibility = "visible";
						}
					}
				}
			}
		}
		
		/* Remove rows, which means setting their display 
		 * attribute to "none". */
		if(n < 0) {
			/* Safety check to make sure we've got always at least one row */ 
			if(visible_rows_num + n < 1) return;
			
			for(var r = visible_rows_num - 1; r >= visible_rows_num + n; --r) {
				for(var c = 0; c != mats[m].rows[r].cells.length; ++c) {
					mats[m].rows[r].cells[c].style.visibility = "hidden";
				}
			}
		}
	}

	/* Update mat dimension display */
	$("mat-x-dimension").innerHTML = (visible_rows_num + n);
}


/**
 * Used to modifiy the number of columns a Mat has.
 * @param n Number of columns that are to be added or removed. Positive values 
 * 	add n columns to the mat, while negative values remove n columns.
 */
function mat_modify_column_count(n) {
	var mini_mat = $("mini-mat");
	var mat = $(battle_mat_window.document.getElementById("mat"));
	var mats = new Array(mini_mat, mat);
	
	var visible_cols_num = 0;
	for(; visible_cols_num != mat.rows[0].cells.length; ++visible_cols_num)
		if("hidden" == mat.rows[0].cells[visible_cols_num].style.visibility)
			break;
	
	/* Add cols? */
	if(n > 0) {
		for(var m = 0; m != mats.length; ++m) {
			for(var r = 0; r != mats[m].rows.length; ++r) {
				for(var c = visible_cols_num - 1; c != visible_cols_num + n;
						++c) {
					/* Decide whether to just show the col or add a new one */
					if(c != mats[m].rows[r].cells.length) {
						/* Just show */
						if(mats[m].rows[r].cells[c-1].style.visibility) {
							mats[m].rows[r].cells[c].style.visibility = 
								mats[m].rows[r].cells[c-1].style.visibility;
						} else {
							mats[m].rows[r].cells[c].style.visibility = 
								"visible";
						}
					} else {
						/* Really add */
						var id_prefix = "mat";
						if(mats[m] == mini_mat) id_prefix = "mini-" + id_prefix;
						
						var td = mats[m].rows[r].insertCell(c);
						td.id = id_prefix + "-cell-" + (r+1) + "x" + (c+1);
						td.innerHTML = "<img " +
							"src=\"/images/textures/tiles/Spacer.png\" " +
							"alt=\"Spacer\" class=\"spacer\" " +
							"id=\"" + id_prefix + "-tile-" + 
							(r+1) + "x" + (c+1) + "\" />";
						if(mats[m].rows[r].cells[c-1].style.visibility) {
							mats[m].rows[r].cells[c].style.visibility = 
								mats[m].rows[r].cells[c-1].style.visibility;
						} else {
							mats[m].rows[r].cells[c].style.visibility = 
								"visible";
						}
					}
				}
			}
		}
		
	}

	/* Hide columns? */
	if(n < 0) {
		/* Sanity check: Make sure there's at least one column. */
		if(visible_cols_num + n < 1) return;
		
		for(var m = 0; m != mats.length; ++m) {
			for(var r = 0; r != mats[m].rows.length; ++r) {
				for(var c = visible_cols_num - 1; c >= visible_cols_num + n; 
						--c) {
					mats[m].rows[r].cells[c].style.visibility = "hidden";
				}
			}
		}
	}
	
	$("mat-y-dimension").innerHTML = (visible_cols_num + n);
}