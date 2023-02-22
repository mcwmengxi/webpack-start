"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkapp1"] = self["webpackChunkapp1"] || []).push([["index_js"],{

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"createApp\": function() { return /* binding */ createApp; },\n/* harmony export */   \"renderHeader\": function() { return /* binding */ renderHeader; }\n/* harmony export */ });\nfunction createApp(){\n  renderHeader()\n  console.log(\"app1 container\");\n}\nfunction renderHeader(){\n  const headerRoot =   document.createElement('div')\n  headerRoot.innerHTML= `\n    <div style=\"      width: 100%;\n    height: 64px;\n    background: #023032;\n    color: #fff;\" >header</div>\n  `\n  document.querySelector(\"body\").appendChild(headerRoot)\n}\n\ncreateApp()\n\n\n//# sourceURL=webpack://app1/./index.js?");

/***/ })

}]);