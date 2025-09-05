let prevH, prevM, prevS;
let selectedIdxs = [[], [], []];    
let windowPositions = [[], [], []]; 

const heights = [
  [180, 270],
  [300, 380],
  [380, 350]
];

function setup() {
  createCanvas(1000, 400);
  rectMode(CORNER);
  noStroke();
  textFont('monospace');
  textSize(16);
  computeWindowPositions();
}

function draw() {
  background(220);

  const h = hour();
  const m = minute();
  const s = second();

  
  syncSection(0, h);
  syncSection(1, m);
  syncSection(2, s);

  prevH = h; prevM = m; prevS = s;

  drawAllBuildings();

  fill(0);
  const timeString = nf(h, 2) + ':' + nf(m, 2) + ':' + nf(s, 2);
  text(timeString, 10, 24);

  const sectionWidth = width / 3;
  for (let sec = 0; sec < 3; sec++) {
    const x0 = sec * sectionWidth;
    const x1 = x0 + sectionWidth;
    if (mouseX >= x0 && mouseX < x1) {
      // Show count of yellow windows
      const count = selectedIdxs[sec].length;
      const msg = `${count}`;
      // draw a semi-transparent background box
      const tw = textWidth(msg) + 10;
      fill(255, 255, 200, 200);
      rect(mouseX + 12, mouseY - 24, tw, 24, 4);
      fill(0);
      text(msg, mouseX + 16, mouseY - 6);
      break;
    }
  }
}

function syncSection(sec, count) {
  if (count === 0 || selectedIdxs[sec].length > count) {
    selectedIdxs[sec] = [];
  }
  while (selectedIdxs[sec].length < count) {
    pickOneWindow(sec);
  }
}

function pickOneWindow(sec) {
  const all = windowPositions[sec];
  const litSet = new Set(selectedIdxs[sec]);
  const unlit = all.map((_,i) => i).filter(i => !litSet.has(i));
  if (unlit.length === 0) return;
  selectedIdxs[sec].push(random(unlit));
}

function computeWindowPositions() {
  const sectionWidth  = width / 3;
  const buildingWidth = sectionWidth * 0.3;
  const gap           = 0;

  const winW   = 20, winH = 20;
  const hGap   = 8,  vGap = 8;
  const margin = 10;

  for (let i = 0; i < 3; i++) {
    const baseX = i * sectionWidth;
    const bx1   = baseX + (sectionWidth - 2 * buildingWidth) / 2;
    const bx2   = bx1 + buildingWidth + gap;
    windowPositions[i] = [
      ...getWindowPositions(bx1, heights[i][0], buildingWidth, winW, winH, hGap, vGap, margin),
      ...getWindowPositions(bx2, heights[i][1], buildingWidth, winW, winH, hGap, vGap, margin)
    ];
  }
}

function getWindowPositions(bx, bh, bw, winW, winH, hGap, vGap, margin) {
  const groundY = height;
  const by      = groundY - bh;
  const innerW  = bw - 2 * margin;
  const innerH  = bh - 2 * margin;

  const cols = floor((innerW + hGap) / (winW + hGap));
  const rows = floor((innerH + vGap) / (winH + vGap));

  const totalW = cols * winW + (cols - 1) * hGap;
  const totalH = rows * winH + (rows - 1) * vGap;
  const startX = bx + margin + (innerW - totalW) / 2;
  const startY = by + margin + (innerH - totalH) / 2;

  const pos = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      pos.push({
        x: startX + c * (winW + hGap),
        y: startY + r * (winH + vGap)
      });
    }
  }
  return pos;
}

function drawAllBuildings() {
  const sectionWidth  = width / 3;
  const groundY       = height;
  const buildingWidth = sectionWidth * 0.3;
  const gap           = 0;
  const winW = 20, winH = 20;

  fill(50);
  for (let i = 0; i < 3; i++) {
    const baseX = i * sectionWidth;
    const bx1   = baseX + (sectionWidth - 2 * buildingWidth) / 2;
    const bx2   = bx1 + buildingWidth + gap;
    const [h1, h2] = heights[i];
    rect(bx1, groundY - h1, buildingWidth, h1);
    rect(bx2, groundY - h2, buildingWidth, h2);
  }

  for (let sec = 0; sec < 3; sec++) {
    const pos = windowPositions[sec];
    for (let i = 0; i < pos.length; i++) {
      fill(selectedIdxs[sec].includes(i)
           ? 'yellow'
           : color(200, 200, 220, 100));
      rect(pos[i].x, pos[i].y, winW, winH);
    }
  }
}
