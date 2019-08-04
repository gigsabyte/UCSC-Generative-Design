/*
 * code/asg5/main.js
 * holds main(), the function that initializes all p5 canvases
 * and calls event handler initialization as needed
 * written by gigsabyte
 */

var canvases = [];

function main() {
	let asg5p5 = new p5(asg5, 'asg5');
	canvases.push(asg5p5);

	initEventHandlers();
}