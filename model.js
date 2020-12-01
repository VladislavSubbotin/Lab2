function preload() {
 this.length = preload.arguments.length;
 for (var i = 0; i < this.length; i++) {
  this[i] = new Image();
  this[i].src = preload.arguments[i];
 }
}
var pics = new preload("black.gif","gray.gif",
 "you1.gif","you2.gif","you1k.gif","you2k.gif",
 "me1.gif","me2.gif","me1k.gif","me2k.gif");

var black = -1; // computer is black
var red = 1; // visitor is red
var square_dim = 60;
var piece_toggled = false; //подсветка
var my_turn = true; //мой ход
var double_jump = false;
var comp_move = false;
var game_is_over = false;
var safe_from = safe_to = null;
var toggler = null;
var togglers = 0;
var player1=true;
var player2=false;

function Board() {
 board = new Array();
 for (var i=0;i<8; i++) {
  board[i] = new Array();
  for (var j=0;j<8;j++)
   board[i][j] = Board.arguments[8*j+i];
 }
 board[-2] = new Array(); // prevents errors
 board[-1] = new Array(); // prevents errors
 board[8] = new Array(); // prevents errors
 board[9] = new Array(); // prevents errors
}
var board;
Board(1,0,1,0,1,0,1,0,
      0,1,0,1,0,1,0,1,
      1,0,1,0,1,0,1,0,
      0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,
      0,-1,0,-1,0,-1,0,-1,
      -1,0,-1,0,-1,0,-1,0,
      0,-1,0,-1,0,-1,0,-1);

function message(str) {
 if (!game_is_over)
  document.disp.message.value = str;
}
function moveable_space(i,j) {
//вычисляем серое или черное 
 return (((i%2)+j)%2 == 0);
}
function Coord(x,y) {
 this.x = x;
 this.y = y;
}
function coord(x,y) {
 c = new Coord(x,y);
 return c;
}

function clicked(i,j) //обработка нажатия на шашку
{
 if (my_turn) {   //мой ход
	//alert(integ(board[i][j]));
  if (integ(board[i][j])==1) 
	{toggle(i,j);} 
  else if (piece_toggled)
	{
	move(selected,coord(i,j));}
  else message("click of red pieces");
 } else {
  message("Black");
  //alert(board[i][j]);
  if (integ(board[i][j])==-1) 
	{toggle(i,j);} 
  else if (piece_toggled)
	{
	move(selected,coord(i,j));}
 }
}
function toggle(x,y) { //перекрашивалка

 //alert("piece:"+piece_toggled);
	if (piece_toggled)
	{   if(player1)
		draw(selected.x,selected.y,"you1"+((board[selected.x][selected.y]==1.1)?"k":"")+".gif");
		if(player2)
		draw(selected.x,selected.y,"me1"+((board[selected.x][selected.y]==1.1)?"k":"")+".gif");
	}
	if (piece_toggled && (selected.x == x) && (selected.y == y)) 
	{
		piece_toggled = false;
		if (double_jump) 
			{ my_turn = double_jump = false; computer(); }
	} 
	else {
	piece_toggled = true;
	if(player1)
	draw(x,y,"you2"+((board[x][y]==1.1)?"k":"")+".gif");
    if(player2)	
	draw(x,y,"me2"+((board[x][y]==1.1)?"k":"")+".gif");//выделяем выбранную шашку
	}
	selected = coord(x,y); //запоминаем координаты
  //alert("x="+selected.x+"y="+selected.y);
 
}

function draw(x,y,name) {
 document.images["space"+x+""+y].src = name;
}
function integ(num) { //роверка целочисенности
 if (num != null)
  return Math.round(num); //округляем
 else
  return null;
}
function abs(num) {
 return Math.abs(num);
}
function sign(num) {
 if (num < 0) return -1;
 else return 1;
}
function concatenate(arr1,arr2) {
 // function tacks the second array onto the end of the first and returns result
 for(var i=0;i<arr2.length;i++)
  arr1[arr1.length+i] = arr2[i];
 return arr1;
}
function legal_move(from,to) { //корректность пути
//alert("h1");
 if ((to.x < 0) || (to.y < 0) || (to.x > 7) || (to.y > 7)) {//alert("h-3"); 
 return false;}
 //alert("h2");
 piece = board[from.x][from.y];
 distance = coord(to.x-from.x,to.y-from.y);
 if ((distance.x == 0) || (distance.y == 0)) {
  message("You may only move diagonally.");
  return false;
 }
 //alert("h3");
 if (abs(distance.x) != abs(distance.y)) {
  message("Invalid move.");
  return false;
 }
// alert("h4");
 if (abs(distance.x) > 2) {
  message("Invalid move.");
  return false;
 }
 //alert("h5");
 if ((abs(distance.x) == 1) && double_jump) {
  return false;
 }
 //alert("h6");
 if ((board[to.x][to.y] != 0) || (piece == 0)) {
  return false;
 }
 //alert("h7");
 if ((abs(distance.x) == 2)
 && (integ(piece) != -integ(board[from.x+sign(distance.x)][from.y+sign(distance.y)]))) {
  return false;
 }
 //alert("h8");
 if ((integ(piece) == piece) && (sign(piece) != sign(distance.y))) {
  return false;
 }
 //alert("h9");
 return true;
}
function move(from,to) {

 my_turn = true;
 //alert(legal_move(from,to));
 if (legal_move(from,to)) {
  piece = board[from.x][from.y];  
  distance = coord(to.x-from.x,to.y-from.y);
  if ((abs(distance.x) == 1) && (board[to.x][to.y] == 0)) {
  //alert("mov1");
   swap(from,to); //ход
  } else if ((abs(distance.x) == 2)
  && (integ(piece) != integ(board[from.x+sign(distance.x)][from.y+sign(distance.y)]))) {  //если бьем
   double_jump = false;
   swap(from,to);
   //alert("jjj");
   remove(from.x+sign(distance.x),from.y+sign(distance.y));
   if ((legal_move(to,coord(to.x+2,to.y+2)))
   || (legal_move(to,coord(to.x+2,to.y-2)))
   || (legal_move(to,coord(to.x-2,to.y-2)))
   || (legal_move(to,coord(to.x-2,to.y+2)))) {
    double_jump = true;
    message("You may complete the double jump or click on your piece to stay still.");
   }
  }
  if ((board[to.x][to.y] == 1) && (to.y == 7)) king_me(to.x,to.y);
  selected = to;
  if (game_over() && !double_jump) {
  //alert("ллд"+to.x+","+to.y);
   if(player1)
   setTimeout("toggle("+to.x+","+to.y+");my_turn = double_jump = player1= false; player2=true;",1000);
   if(player2)
   setTimeout("toggle("+to.x+","+to.y+");double_jump = player2= false; player1=true; my_turn=true;",1000);
  }
 }
 return true;
 
}
function king_me(x,y) {
//alert("ллд");
 if (board[x][y] == 1) {
  board[x][y] = 1.1; // king you
  draw(x,y,"you2k.gif");
 } else if (board[x][y] == -1) {
  board[x][y] = -1.1; // king me
  draw(x,y,"me2k.gif");
 }
}

function swap(from,to) { //ход
 if (my_turn || comp_move || player1 || player2) {
 //alert("dwap1");
  dummy_src = document.images["space"+to.x+""+to.y].src;
  document.images["space"+to.x+""+to.y].src = document.images["space"+from.x+""+from.y].src;
  document.images["space"+from.x+""+from.y].src = dummy_src;
 }
 dummy_num = board[from.x][from.y];
 board[from.x][from.y] = board[to.x][to.y];
 board[to.x][to.y] = dummy_num;
}
function remove(x,y) {
 if (my_turn || comp_move || player1 || player2)
  draw(x,y,"gray.gif");
 board[x][y] = 0;
}
function Result(val) {
 this.high = val;
 this.dir = new Array();
}

function game_over() { // make sure game is not over (return false if game is over)
 comp = you = false;
 for(var i=0;i<8;i++) {
  for(var j=0;j<8;j++) {
   if(integ(board[i][j]) == -1) comp = true;
   if(integ(board[i][j]) == 1) you = true;
  }
 }
 if (!comp) message("You beat me!");
 if (!you) message("Gotcha! Game over.");
 game_is_over = (!comp || !you)
 return (!game_is_over);
}

// the higher the jump_priority, the more often the computer will take the jump over the safe move
var jump_priority = 10;

function jump(i,j) {
 if (board[i][j] == -1.1) {
  if (legal_move(coord(i,j),coord(i+2,j+2))) {
   move_comp(coord(i,j),coord(i+2,j+2));
   setTimeout("jump("+(i+2)+","+(j+2)+");",500);
   return true;
  } if (legal_move(coord(i,j),coord(i-2,j+2))) {
   move_comp(coord(i,j),coord(i-2,j+2));
   setTimeout("jump("+(i-2)+","+(j+2)+");",500);
   return true;
  }
 } if (integ(board[i][j]) == -1) {
  if (legal_move(coord(i,j),coord(i-2,j-2))) {
   move_comp(coord(i,j),coord(i-2,j-2));
   setTimeout("jump("+(i-2)+","+(j-2)+");",500);
   return true;
  } if (legal_move(coord(i,j),coord(i+2,j-2))) {
   move_comp(coord(i,j),coord(i+2,j-2));
   setTimeout("jump("+(i+2)+","+(j-2)+");",500);
   return true;
  }
 }
 return false;
}

message("You may begin! Select a piece to move.");