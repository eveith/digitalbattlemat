// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

/**
 * Shows a prompt (i. e. a <div> and the shadow) when needed.
 * @param id HTML id of the <div> that shall be shown
 * @see hide_prompt(id)
 */
function display_prompt(id) {
	$('shadow').style.display = "block";
	$(id).style.display = "block";
}


/**
 * Hides a prompt (i. e. a <div> and the shadow) when needed.
 * @param id HTML id of the <div> that shall be hidden
 * @see show_prompt(id)
 */
function hide_prompt(id) {
	$(id).style.display = "none";
	$('shadow').style.display = "none";
}
