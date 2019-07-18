/*
 * code/asg3/main.js
 * holds main(), the function that initializes all p5 canvases
 * and calls event handler initialization as needed
 * written by gigsabyte
 */

var canvases = [];

function main() {
	let asg3p5 = new p5(asg3, 'asg3');
	canvases.push(asg3p5);

	initEventHandlers();
}