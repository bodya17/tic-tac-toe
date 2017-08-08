/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bling__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bling___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__bling__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helpers__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helpers___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__helpers__);
/* globals WebSocket $ */



const board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
]

const ws = new WebSocket('ws://localhost:3000')
let char
let allowedToMove
window.ws = ws

function handleMove (moveData) {
  console.log('moveData')
  console.log(moveData)
  const cell = $(`td[data-pos='${moveData.move}']`)[0]
  cell.classList.add('player' + moveData.player)
  setTimeout(() => {
    cell.classList.add('active')
  }, 100)
  const [x, y] = moveData.move.split('')
  board[x][y] = moveData.player
  if (checkWin(board)) {
    informAboutWin(moveData.player)
  } else {
    console.log('No winner yet')
  }
  console.log()
}

ws.onmessage = function (event) {
  const data = JSON.parse(event.data)
  console.log(data)
  switch (data.type) {
    case 'assignChar':
      char = data.char
      allowedToMove = data.allowedToMove
      break
    case 'move':
      handleMove(data.move)
      allowedToMove = !allowedToMove
      break
    default:
      break
  }
}

ws.onclose = function () {
  console.log('connection closed')
}

// let moves = 0

function whereWinHappened (board) {
  if (allValuesTheSame(Object(__WEBPACK_IMPORTED_MODULE_1__helpers__["getMainDiagonal"])(board))) {
    return 'main-diagonal'
  }
  if (allValuesTheSame(Object(__WEBPACK_IMPORTED_MODULE_1__helpers__["getSecondaryDiagonal"])(board))) {
    return 'secondary-diagonal'
  }
  if (allValuesTheSame(Object(__WEBPACK_IMPORTED_MODULE_1__helpers__["getColumn"])(board, 0))) {
    return 'first-column'
  }
  if (allValuesTheSame(Object(__WEBPACK_IMPORTED_MODULE_1__helpers__["getColumn"])(board, 1))) {
    return 'middle-column'
  }
  if (allValuesTheSame(Object(__WEBPACK_IMPORTED_MODULE_1__helpers__["getColumn"])(board, 2))) {
    return 'third-column'
  }
  if (allValuesTheSame(board[0])) {
    return 'first-row'
  }
  if (allValuesTheSame(board[1])) {
    return 'middle-row'
  }
  if (allValuesTheSame(board[2])) {
    return 'third-row'
  }
}

const allValuesTheSame = arr => arr.indexOf('') === -1 && new Set(arr).size === 1

function checkDiagonals (board) {
  return allValuesTheSame(Object(__WEBPACK_IMPORTED_MODULE_1__helpers__["getMainDiagonal"])(board)) || allValuesTheSame(Object(__WEBPACK_IMPORTED_MODULE_1__helpers__["getSecondaryDiagonal"])(board))
}

function checkRows (board) {
  return board.map(allValuesTheSame).some(el => el === true)
}

function checkColumns (board) {
  return board.map((el, i) => allValuesTheSame(Object(__WEBPACK_IMPORTED_MODULE_1__helpers__["getColumn"])(board, i))).some(el => el === true)
}

function checkWin (board) {
  return [checkColumns, checkRows, checkDiagonals].map(f => f(board)).some(el => el === true)
}

function informAboutWin (char) {
  const crossClass = whereWinHappened(board)
  console.log(`Winner: ${char}`)
  const resultInfo = document.createElement('h3')
  resultInfo.classList.add('info')
  resultInfo.textContent = `${char} is winner!`
  $('body')[0].appendChild(resultInfo)
  // $('td').off('click', clickListener)
  $('table')[0].classList.add(crossClass)
}

$('td').on('click', function clickListener () {
  const [x, y] = this.getAttribute('data-pos').split('')
  if (board[x][y] === '' && allowedToMove) {
    allowedToMove = !allowedToMove
    // const char = ++moves % 2 ? 'X' : '0'
    this.classList.add('player' + char) // global char (server assigns it)
    setTimeout(() => {
      this.classList.add('active')
    }, 100)

    if (ws.readyState === 1) { // connection is open
      ws.send(JSON.stringify({
        player: char,
        move: x + y
      }))
    }
    board[x][y] = char
    if (checkWin(board)) {
      informAboutWin(char)
    } else {
      console.log('No winner yet')
    }
  }
})


/***/ }),
/* 1 */
/***/ (function(module, exports) {

// https://gist.github.com/paulirish/12fb951a8b893a454b32
/* globals Node, NodeList */

window.$ = document.querySelectorAll.bind(document)

Node.prototype.on = window.on = function (name, fn) {
  this.addEventListener(name, fn)
}

Node.prototype.off = window.off = function (name, fn) {
  this.removeEventListener(name, fn)
}

NodeList.prototype.__proto__ = Array.prototype

NodeList.prototype.on = NodeList.prototype.addEventListener = function (name, fn) {
  this.forEach(function (elem, i) {
    elem.on(name, fn)
  })
}

NodeList.prototype.off = NodeList.prototype.removeEventListener = function (name, fn) {
  this.forEach(function (elem, i) {
    elem.off(name, fn)
  })
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

exports.getSecondaryDiagonal = twoDimArr => twoDimArr.map((el, i, arr) => twoDimArr[i][arr.length - 1 - i])
exports.getMainDiagonal = twoDimArr => twoDimArr.map((el, i) => twoDimArr[i][i])
exports.getRow = (twoDimArr, rowNum) => twoDimArr[rowNum]
exports.getColumn = (twoDimArr, colNum) => twoDimArr.map((el, i) => twoDimArr[i][colNum])


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map