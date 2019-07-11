/*
 * code/asg2/main.js
 * holds main(), the function that initializes all p5 canvases
 * and calls event handler initialization as needed
 * written by gigsabyte
 */

var canvases = [];

function main() {
	let asg2p5 = new p5(asg2, 'asg2');
	canvases.push(asg2p5);

	initEventHandlers();
}