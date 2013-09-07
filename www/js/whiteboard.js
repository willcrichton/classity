// Only executed our code once the DOM is ready.
window.onload = function() {
    // Get a reference to the canvas object
    var canvas = document.getElementById('myCanvas');
    // Create an empty project and a view for the canvas:
    paper.setup(canvas);
    // Create a Paper.js Path to draw a line into it:
    var path = new paper.Path();
    // Give the stroke a color
    path.strokeColor = 'black';
}


var myPath = new Path();
var strokeColor = 'black';
myPath.strokeColor = strokeColor;


// This function is called whenever the user
// clicks the mouse in the view:
function onMouseDown(event) {
    // Add a segment to the path at the position of the mouse:
    myPath = new Path();
    myPath.strokeColor = strokeColor;
    myPath.add(event.point);
    console.log(event.point.x, event.point.y);
    

}

function onMouseDrag(event) {
    //Continue adding segments to path at position of mouse:
    myPath.add(event.point);
}

function onMouseUp(event) {
    //Should stop tracking points;
    myPath.add(event.point);
}