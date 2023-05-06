window.onload = function() {
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

document.getElementById('apply').addEventListener('click', function() {
const rowsInput = document.getElementById('rows');
const colsInput = document.getElementById('cols');
ROWS = parseInt(rowsInput.value);
COLS = parseInt(colsInput.value);
cells = [];
init();
});

const CELL_SIZE = 30;
let ROWS = 15;
let COLS = 15;

const colors = {
'mouth': '#DEB14D',
"killer":"#F82380",
"producer":"#15DE59",
"armor":"#7230DB",
"mover":"#60D4FF",
"eye":"#B6C1EA",
};


let cells = [];

let isMouseDown = false;

function init() {
for (let row = 0; row < ROWS; row++) {
cells[row] = [];
for (let col = 0; col < COLS; col++) {
cells[row][col] = '';
}
}

canvas.width = COLS * CELL_SIZE;
canvas.height = ROWS * CELL_SIZE;

canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mouseup', handleMouseUp);
canvas.addEventListener('mousemove', handleMouseMove);

drawGrid();
}

function drawGrid() {
ctx.beginPath();
for (let col = 0; col <= COLS; col++) {
ctx.moveTo(col * CELL_SIZE, 0);
ctx.lineTo(col * CELL_SIZE, canvas.height);
}
for (let row = 0; row <= ROWS; row++) {
ctx.moveTo(0, row * CELL_SIZE);
ctx.lineTo(canvas.width, row * CELL_SIZE);
}
ctx.stroke();
}

function drawDot(row, col, color) {
ctx.fillStyle = color;
ctx.fillRect(col * CELL_SIZE + 1, row * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);

cells[row][col] = color;
}
function handleMouseDown(event) {
isMouseDown = true;
handleMouseMove(event);
}

function handleMouseUp(event) {
isMouseDown = false;
}

function handleMouseMove(event) {
if (isMouseDown) {
const col = Math.floor(event.offsetX / CELL_SIZE);
const row = Math.floor(event.offsetY / CELL_SIZE);

const colorInput = document.querySelector('input[name="dot-color"]:checked');
const color = Object.keys(colors).find(color => colors[color] === colorInput.getAttribute("value"));
drawDot(row, col, colors[color]);
}
}

init();

const saveButton = document.getElementById('save');
saveButton.addEventListener('click', saveData);

// Planned to be fully customizable, rn its just a template
function saveData() {
const data = {
c: COLS,
r: ROWS,
lifetime: 0,
food_collected: 0,
living: true,
direction: 2,
rotation: 0,
can_rotate: true,
move_count: 0,
move_range: 4,
ignore_brain_for: 0,
mutability: 5,
damage: 0,
anatomy: {
birth_distance: 16,
is_producer: true,
is_mover: true,
has_eyes: true,
cells: []
},
brain: {
decisions: {
empty: 0,
food: 2,
wall: 0,
mouth: 0,
producer: 0,
mover: 0,
killer: 1,
armor: 0,
eye: 0
}
},
species_name: '6pzxcv0bwx'
};

for (let row = 0; row < ROWS; row++) {
for (let col = 0; col < COLS; col++) {
if (cells[row][col]) {
const color = Object.keys(colors).find(color => colors[color] === cells[row][col]);
data.anatomy.cells.push({
  loc_col: col - Math.floor(COLS / 2),
  loc_row: row - Math.floor(ROWS / 2),
  state: { name: color }
});
}
}
}

const jsonData = JSON.stringify(data);
const dataUri = "data:text/json;charset=utf-8," + encodeURIComponent(jsonData);
const downloadLink = document.createElement('a');
downloadLink.setAttribute('href', dataUri);
downloadLink.setAttribute('download', 'organism.json');
document.body.appendChild(downloadLink);
downloadLink.click();
document.body.removeChild(downloadLink);
}

function loadData(event) {
ctx.clearRect(0, 0, canvas.width, canvas.height);


const file = event.target.files[0];
const reader = new FileReader();

reader.onload = function(e) {
const data = JSON.parse(e.target.result);

ROWS = data.r;
COLS = data.c;
cells = [];
for (let row = 0; row < ROWS; row++) {
cells[row] = [];
for (let col = 0; col < COLS; col++) {
cells[row][col] = '';
}
}
for (let i = 0; i < data.anatomy.cells.length; i++) {
const cell = data.anatomy.cells[i];
const color = cell.state.name;
const col = Math.floor(COLS / 2) + cell.loc_col;
const row = Math.floor(ROWS / 2) + cell.loc_row;

drawDot(row, col, colors[color]);
}
}

reader.readAsText(file);

drawGrid();
}

const loadInput = document.getElementById('load');
loadInput.addEventListener('change', loadData);
}
