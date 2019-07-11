/*
 * code/asg1/main.js
 * holds main(), the function that initializes all p5 canvases
 * and calls event handler initialization as needed
 * written by gigsabyte
 */

var canvases = [];

function main() {
	let asg1p5 = new p5(asg1, 'asg1');
	canvases.push(asg1p5);

	initEventHandlers();
}