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