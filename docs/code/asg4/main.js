/*
 * code/asg4/main.js
 * holds main(), the function that initializes all p5 canvases
 * and calls event handler initialization as needed
 * written by gigsabyte
 */

var canvases = [];

function main() {
	let asg4p5 = new p5(asg4, 'asg4');
	canvases.push(asg4p5);

	initEventHandlers();
}