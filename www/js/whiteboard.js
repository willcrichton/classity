// Only executed our code once the DOM is ready.
window.onload = function() {
    // Get a reference to the canvas object
    var canvas = document.getElementById('myCanvas');
    // Create an empty project and a view for the canvas:
    paper.setup(canvas);
}

function switchMarker(myPath, marker){
    myPath.strokeColor = marker.strokeColor;
    myPath.strokeWidth = marker.strokeWidth;
    myPath.strokeCap = marker.strokeCap;
}

function drawRoundedSquare(corner, size){
    var rectangle = new Rectangle(corner, size);
    var cornerSize = new Size(5, 5);
    return new Path.Rectangle(rectangle, cornerSize);
}

function drawSidebar(sidebarInfo){
    strokeColor = 'black';
    strokeWidth = '1';
    r = sidebarInfo.radius;
    side = 2*r;
    //Draws increase.
    var incpath = drawRoundedSquare(new Point(sidebarInfo.plusX - r, sidebarInfo.plusY - r) ,
		 			      new Size(side, side));
    incpath.strokeColor = strokeColor;
    var circbg = new Path.Circle(new Point(sidebarInfo.plusX, sidebarInfo.plusY), 5); 
    var circsm = new Path.Circle(new Point(sidebarInfo.minusX, sidebarInfo.minusY), 2); 
    circbg.strokeColor = strokeColor;
    circsm.strokeColor = strokeColor;
    
    //Draws decrease.
    var decpath = drawRoundedSquare(new Point(sidebarInfo.minusX - r, sidebarInfo.minusY - r),
					      new Size(side, side));
    decpath.strokeColor = strokeColor;

    //Loops through colors and draws colors. Fills colors with colors.
    var ipath = [];
    for(var i = 0; i < (2 * sidebarInfo.rows); i++){
	var col, row;
	if(i < sidebarInfo.rows)
	    col = sidebarInfo.sca1 - r;
	else
	    col = sidebarInfo.sca2 - r;
	row = (i % 5) * sidebarInfo.box  + sidebarInfo.offset;
	ipath[i] = drawRoundedSquare(new Point(col, row), new Size(side, side));
	console.log(col, row, side);
	ipath[i].fillColor = sidebarInfo.color[i];
    }

    
 }

function specialPoints(p){
    r = sidebarInfo.radius;
    if(p.x < sidebarInfo.sca1 - r || p.x > sidebarInfo.sca2 + r || 
       p.y < sidebarInfo.plusX - r || p.y > sidebarInfo.rows * sidebarInfo.box + sidebarInfo.offset){
	//console.log("safe");
	return 0;
    }
    //returns 0 if nothing changes, 1 if markersize is increased by 1, -1 if markersize if decreased by 1, otherwise the hex value for the color.
    //100 < x < 200 and 50 < X < 250
    //200, 300. 50 space 350 to 450. 50 space. 500 to 1000.
    if( sidebarInfo.plusX - r < p.x && p.x < sidebarInfo.plusX + r &&
	sidebarInfo.plusY - r < p.y && p.y < sidebarInfo.plusY + r){
	return 1;
    }
    if( sidebarInfo.minusX - r < p.x && p.x < sidebarInfo.minusX + r  &&
	sidebarInfo.minusY - r < p.y && p.y < sidebarInfo.minusY + r){
	return -1;
    }
    
    qx = p.x - sidebarInfo.sca1 + r;
    dx = Math.floor(qx/sidebarInfo.box);
    qy = p.y - sidebarInfo.offset;
    dy = Math.floor(qy/sidebarInfo.box);
    console.log(qx, qy);
    j = dx * 5 + dy;
    if(j >= 0)
	return 10+j; //very hacky coding to avoid conflicts
    else 
	return 0;
}

function updateMarker(change, marker){
    if(change == 1 && marker.strokeWidth < 30){
	marker.strokeWidth = 5;
	//marker.strokeWidth++;
    }
    if(change == -1 && marker.strokeWidth > 1){
	//marker.strokeWidth--;
	marker.strokeWidth = 2;
    }
    if(10 <= change && change < 99){
	marker.strokeColor = sidebarInfo.color[change-10];
    }
}

function onMouseDown(event) {
    // Add a segment to the path at the position of the mouse:
    myPath = new Path();
    switchMarker(myPath, marker);
    console.log(specialPoints(event.point));
    if(specialPoints(event.point) == 0)
	myPath.add(event.point);
    else{
	updateMarker(specialPoints(event.point), marker);
	switchMarker(myPath, marker);
    }
}

function onMouseDrag(event) {
    //Continue adding segments to path at position of mouse:
    if(specialPoints(event.point) == 0)
	myPath.add(event.point);
}

function onMouseUp(event) {
    //Should stop tracking points;
   myPath.add(event.point);
}

var marker = {
    strokeColor: 'black', 
    strokeWidth: '4',
    strokeCap: 'round'
}

var sidebarInfo = {
    radius: 22,
    box: 50,
    plusX:  75,
    plusY:  75,
    minusX: 75,
    minusY: 125,
    offset: 150,
    sca1: 50,
    sca2: 100,
    rows: 5,
    color: ["#FAFAFA", "#ADBEEF", "#345678", '#00FF00', "#00FFFF", "#FF00FF", "#FFFF00", "#555555", "#FF0000", "#0000FF"]
};


drawSidebar(sidebarInfo);

//var testpath = drawRoundedSquare(new Point(50, 950), new Size(44, 44));
//testpath.strokeColor = 'black';
  


// This function is called whenever the user
// clicks the mouse in the view:
