import { playerController } from "./app/playerController";

import "./css/reset.css";
import "./main.css";

const initMazeDepth = 16;
const initMazeWidth = 19;

const maze = document.getElementById('maze');
const generatemaze = document.getElementById('generatemaze');
const setMazeDepth = document.getElementById('setMazeDepth');
const setMazeWidth = document.getElementById('setMazeWidth');

const upButton = document.getElementById('upButton');
const downButton = document.getElementById('downButton');
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');

function randomPosition (emptyCorridors) {
  const maxPosition = (emptyCorridors.length) -1;
  const position = randomIntNumber(1, maxPosition);
  return emptyCorridors[position];
}

function randomIntNumber(min, max) {
  const randomIntNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomIntNumber;
}

function getMazeSize() {
  const getMazeDepth = document.getElementById("setMazeDepth").value;
  const getMazeWidth = document.getElementById("setMazeWidth").value;
  const mazeDepth = Math.round(getMazeDepth * 1);
  const mazeWidth = Math.round(getMazeWidth * 1);
  if (100 > mazeDepth && mazeDepth > 0 && 100 > mazeWidth && mazeWidth > 0) {
    while (maze.firstChild) {
      maze.firstChild.remove()
    }
    putMazeOnScreen(mazeDepth, mazeWidth);
  }
}

function checkScreenSize(mazeWidth) {
  const gameScreen = document.getElementById('gamescreen');
  const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  if ((mazeWidth * 20) + 40 > screenWidth) {
    gameScreen.style.justifyContent = 'left';
  } else {
    gameScreen.style.justifyContent = 'center';
  }
}

function drawMaze(mazeDepth, mazeWidth, mazeBluePrint) {
  let emptyCorridors = new Array();
  let isCorridor = 0
  for (let depth = 0; depth < mazeDepth; depth++) {
    for (let width = 0; width < mazeWidth; width++) {
      const div = document.createElement('div');
      if (mazeBluePrint[depth][width] === 1) {
        maze.appendChild(div).classList.add('wall');
        maze.appendChild(div).id = ('wall-D'+depth+'W'+width);
      } else {
        maze.appendChild(div).classList.add('corridor');
        maze.appendChild(div).id = ('corridor-D'+depth+'W'+width);
        emptyCorridors[isCorridor] = [depth, width];
        isCorridor++;
      }
    }
  }
  return(emptyCorridors);
}

function calculateMazeSize(mazeDepth, mazeWidth) {
  const mazeDepthInPixel = (mazeDepth * 20) + 2;
  maze.style.height = mazeDepthInPixel + 'px';
  const mazeWidthInPixel = (mazeWidth * 20) + 2;
  maze.style.width = mazeWidthInPixel + 'px';
}

function countSquareNeighbours(mazeBluePrint, mazeDepth, mazeWidth, mazeDepthCrawl, mazeWidthCrawl) {
  let countedNeighbours = 0;
  if (mazeDepthCrawl <= 0 || mazeDepthCrawl >= mazeDepth - 1 || mazeWidthCrawl <= 0 || mazeWidthCrawl >= mazeWidth - 1) return 5;
  if (mazeBluePrint[mazeDepthCrawl - 1][mazeWidthCrawl] === 0) {
      countedNeighbours++;
  }
  if (mazeBluePrint[mazeDepthCrawl + 1][mazeWidthCrawl] === 0) {
     countedNeighbours++;
  }
  if (mazeBluePrint[mazeDepthCrawl][mazeWidthCrawl - 1] === 0) {
     countedNeighbours++;
  }
  if (mazeBluePrint[mazeDepthCrawl][mazeWidthCrawl + 1] === 0) {
     countedNeighbours++;
  }
  return countedNeighbours;
}

function createPlainMaze(mazeDepth, mazeWidth) {
  const plainMaze = new Array(mazeDepth);
  for (let depth = 0; depth < mazeDepth; depth++) {
    plainMaze[depth] = new Array(mazeWidth);
  }
  for (let depth = 0; depth < mazeDepth; depth++) {
    for (let width = 0; width < mazeWidth; width++) {
      plainMaze[depth][width] = 1;
    }
  }
  return plainMaze;
}

function addWallLocations(wallLocations, depthPos, widthPos) {
  wallLocations.push([depthPos - 1, widthPos]);
  wallLocations.push([depthPos + 1, widthPos]);
  wallLocations.push([depthPos, widthPos - 1]);
  wallLocations.push([depthPos, widthPos + 1]);
}

function generateMazeBlueprint(mazeDepth, mazeWidth) {
  const mazeBluePrint = new createPlainMaze(mazeDepth, mazeWidth);
  const depthStartPosCrawl = 2;
  const widthStartPosCrawl = 2;
  mazeBluePrint[depthStartPosCrawl][widthStartPosCrawl] = 0;
  let wallLocations = new Array();
  addWallLocations(wallLocations, depthStartPosCrawl, widthStartPosCrawl);
  while (wallLocations.length > 0) {
    let randomWallCheck = randomIntNumber(0, (wallLocations.length - 1));
    let nextDepthPos = wallLocations[randomWallCheck][0];
    let nextWidthPos = wallLocations[randomWallCheck][1];
    if (countSquareNeighbours(mazeBluePrint, mazeDepth, mazeWidth, nextDepthPos, nextWidthPos) === 1) {
      mazeBluePrint[nextDepthPos][nextWidthPos] = 0;
      addWallLocations(wallLocations, nextDepthPos, nextWidthPos);
    }
    wallLocations.splice(randomWallCheck, 1);
  }
  return mazeBluePrint;
}

function putMazeOnScreen(mazeDepth, mazeWidth) {
  const mazeBluePrint = new generateMazeBlueprint(mazeDepth, mazeWidth);
  calculateMazeSize(mazeDepth, mazeWidth);
  checkScreenSize(mazeWidth);
  const emptyCorridors = drawMaze(mazeDepth, mazeWidth, mazeBluePrint);
  const playerStartPosition = randomPosition(emptyCorridors);
  playerController(mazeBluePrint, playerStartPosition[0], playerStartPosition[1]);
}

putMazeOnScreen(initMazeDepth, initMazeWidth);

generatemaze.addEventListener('click', getMazeSize);

setMazeDepth.addEventListener('keyup', function(hitEnter) {
  if (hitEnter.keyCode === 13) {
    const depthNumber = setMazeDepth.value * 1;
    const widthNumber = setMazeWidth.value * 1;
    if (100 > depthNumber && depthNumber >= 5) {
      if (100 > widthNumber && widthNumber >= 5) {
        document.getElementById('generatemaze').focus();
        getMazeSize();
      } else {
        document.getElementById('setMazeWidth').focus();
      }
    }
  }
});

setMazeWidth.addEventListener('keyup', function(hitEnter) {
  if (hitEnter.keyCode === 13) {
    const depthNumber = setMazeDepth.value * 1;
    const widthNumber = setMazeWidth.value * 1;
    if (100 > widthNumber && widthNumber >= 5) {
      if (100 > depthNumber && depthNumber >= 5) {
        document.getElementById('generatemaze').focus();
        getMazeSize();
      } else {
        document.getElementById('setMazeDepth').focus();
      }
    }
  }
});
