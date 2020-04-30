const randomScrPoint = (offset = 0) => {
  let tmp = p5.Vector.random2D();
  tmp = createVector(tmp.x * (width * 0.5 - offset) + width * 0.5, tmp.y * (height * 0.5 - offset) + height * 0.5);
  //console.log(tmp);
  return tmp;
}

const sumArrayAndColor = (arr, col) => ([arr[0] + red(col), arr[1] + green(col), arr[2] + blue(col)]);

const debugColorArray = (colArr, n) => text(`${thatColorAvg(colArr, 0, n)}\n${thatColorAvg(colArr, 1, n)}\n${thatColorAvg(colArr, 2, n)}`, 10, 30);

const thatColorAvg = (arr, index, n) => (arr[index] / n).toFixed(2);

const randomColor = (minBright = 0, maxBright = 255) => {
  let v = p5.Vector.random3D().array();
  v = v.map(item => map(item, -1, 1, minBright, maxBright))
  let col = color(v);
  return col;
}

const getInRadius = (pos, rad, arr) => arr.filter(item => p5.Vector.sub(item.pos, pos).magSq() < rad * rad);

const act_array = arr => arr.forEach(item => item.act());
const draw_array = arr => arr.forEach(item => item.draw());
const draw_collide_array = arr => arr.forEach(item => item.drawCollider());
const tick_array = arr => arr.forEach(item => item.tick());

let chooseMode = 0; // 0 - nearest, 1 - most trash, 2 - nearest/trash;

let mind;
let curd;
let minObj;
const findNearest = (arr, limit, pos, binsearch = false, banned = []) => {
  mind = Number.POSITIVE_INFINITY;
  minObj = null;
  arr.forEach(item => {
    let trash_mod = !binsearch && chooseMode ? item.trash : 1;
    let ban_mod = banned.includes(item) ? 0.25 : 1;
    curd = p5.Vector.sub(item.pos, pos).magSq() / lerp(0.2, 1.0, trash_mod * ban_mod);
    if (curd < mind && item.trash < limit && (item.trash > 0.01 || binsearch)) {
      minObj = item;
      mind = curd;
    }
  })
  return minObj;
}

let maxObj;
let maxValue;
let curValue;
const getMaxTrash = (arr, limit, pos) => {
  maxObj = null;
  maxValue = 0;
  curValue;
  arr.forEach(item => {
    curValue = item.trash;
    if (curValue < limit && curValue > maxValue) {
      maxObj = item;
      maxValue = curValue;
    }
  })
  return maxObj;
}

const getTrashInTargets = arr => arr.reduce((acc, target) => acc + target.trash, 0);

let collideTable;
const collideArrays = (a, b) => {
  [...a, ...b].forEach(item => {
    item.isColliding = false;
    item.collideWith = []
  });
  collideTable = [];
  a.forEach(ai => {
    b.forEach(bi => {
      if (collide(ai, bi)) {
        collideTable.push([ai, bi]);
      }
    })
  });
  collideTable.forEach(item => {
    item[0].isColliding = true;
    item[1].isColliding = true;
    item[0].collideWith.push(item[1]);
    //console.log(`${item[0].name} x ${item[1].name}`);
  });
}

let sumrd;
const collide = (a, b) => {
  sumrd = a.collideRad + b.collideRad;
  sumrd *= 0.5;
  return (p5.Vector.sub(a.pos, b.pos).magSq() <= (sumrd * sumrd))
}

const uniquePush = (arrA, arrB) => {
  arrB.forEach(item => {
    if (!arrA.includes(item)) arrA.push(item);
  });
}

let leftTrash;
let givenTrash;
const transferTrash = (a, b, speed = 0.015) => {
  leftTrash = Math.max(0, b.trash - speed);
  givenTrash = b.trash - leftTrash;
  b.trash = leftTrash;
  a.trash += givenTrash;
}