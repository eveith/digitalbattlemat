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
 * Shows a small dropdown prompt without enabling the shadow.
 * @param id HTML id of the prompt element container
 * @see hide_dropdown_prompt
 */
function display_dropdown_prompt(id) {
	$(id).style.display = "block";
}


/**
 * Hides a dropdown prompt
 * @param id HTML id of the prompt element container
 * @see display_dropdown_prompt
 */
function hide_dropdown_prompt(id) {
	$(id).style.display = "none";
}

/**
 * This function scales an element if its size exceeds certain values in width
 * or height. While doing this, it keeps the original aspect ratio.
 * @param element The element that is to be scaled
 * @param width Maximum width, -1 indicates that the width does not matter
 * @param height Maximum height, -1 indicates that the height does not matter
 */
function scale_if_bigger_than(element, max_width, max_height) {
	var dimensions = element.getDimensions;
	var ratio = dimensions.height / dimensions.width;
	var new_dimensions = {
		width: dimensions.width,
		height: dimensions.height
	};
	
	if(-1 == max_width) max_width = dimensions.width;
	if(-1 == max_height) max_height = dimensions.height;
	
	
	if((dimensions.width - max_width) 
			> (dimensions.height - max_height)) {
		/* Its broader than high, so scale because of width. */
		new_dimensions.width = max_width;
		new_dimensions.height = max_width * ratio; 
	} else {
		/* Its higher than broad, scale because of height. */
		new_dimensions.height = max_height;
		new_dimensions.width = max_height * ratio;
	}
	
	element.style.width = new_dimensions.width + "px";
	element.style.height = new_dimensions.height + "px";
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