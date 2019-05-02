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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./mid-long-term/static/javascripts/manage/type.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./mid-long-term/static/javascripts/manage/type.js":
/*!*********************************************************!*\
  !*** ./mid-long-term/static/javascripts/manage/type.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var header = document.getElementById('header'); // variables > functions
// add project button clicked

var addButtonClicked = function addButtonClicked(event) {
  $('#addForm').modal({
    onApprove: function onApprove() {
      return false;
    }
  }).modal('show');
}; // handle dropdown on change


var yearDropdownOnChange = function yearDropdownOnChange(event) {
  var campusesDropDown = event.target.parentNode.parentNode.querySelector('.campus-dropdown').firstChild;

  if (event.target.value == '0') {
    // find the innerHTML of .normal
    campusesDropDown.innerHTML = event.target.parentNode.parentNode.querySelector('.normal').innerHTML;
  } else if (event.target.value == '1') {
    // find the innerHTML of .others
    campusesDropDown.innerHTML = event.target.parentNode.parentNode.querySelector('.others').innerHTML;
  }
};

var restrictYear = function restrictYear(event) {
  var to = parseInt(addForm.querySelector('.yearTo').value);
  var from = parseInt(addForm.querySelector('.yearFrom').value);
  if (from >= to) addForm.querySelector('.yearTo').value = ++from;
}; // init
//refresh dropdwon in addForm


$('select.dropdown').dropdown(); // add event listener
// add event listener to the add button

header.querySelector('.add').addEventListener('click', addButtonClicked); // add event listener to the dropdown of addForm

addForm.querySelector('.type-dropdown').firstChild.addEventListener('change', yearDropdownOnChange); // trigger dropdown on change to refresh the selection of school

addForm.querySelector('.type-dropdown').firstChild.dispatchEvent(new Event('change'));
addForm.querySelector('.yearTo').addEventListener('change', restrictYear);
addForm.querySelector('.yearFrom').addEventListener('change', restrictYear);

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbWlkLWxvbmctdGVybS9zdGF0aWMvamF2YXNjcmlwdHMvbWFuYWdlL3R5cGUuanMiXSwibmFtZXMiOlsiaGVhZGVyIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsImFkZEJ1dHRvbkNsaWNrZWQiLCJldmVudCIsIiQiLCJtb2RhbCIsIm9uQXBwcm92ZSIsInllYXJEcm9wZG93bk9uQ2hhbmdlIiwiY2FtcHVzZXNEcm9wRG93biIsInRhcmdldCIsInBhcmVudE5vZGUiLCJxdWVyeVNlbGVjdG9yIiwiZmlyc3RDaGlsZCIsInZhbHVlIiwiaW5uZXJIVE1MIiwicmVzdHJpY3RZZWFyIiwidG8iLCJwYXJzZUludCIsImFkZEZvcm0iLCJmcm9tIiwiZHJvcGRvd24iLCJhZGRFdmVudExpc3RlbmVyIiwiZGlzcGF0Y2hFdmVudCIsIkV2ZW50Il0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNsRkEsSUFBTUEsTUFBTSxHQUFHQyxRQUFRLENBQUNDLGNBQVQsQ0FBd0IsUUFBeEIsQ0FBZixDLENBRUE7QUFFQTs7QUFDQSxJQUFNQyxnQkFBZ0IsR0FBRyxTQUFuQkEsZ0JBQW1CLENBQUNDLEtBQUQsRUFBVztBQUNsQ0MsR0FBQyxDQUFDLFVBQUQsQ0FBRCxDQUFjQyxLQUFkLENBQW9CO0FBQ2xCQyxhQUFTLEVBQUcscUJBQVU7QUFBQyxhQUFPLEtBQVA7QUFBYTtBQURsQixHQUFwQixFQUVHRCxLQUZILENBRVMsTUFGVDtBQUdELENBSkQsQyxDQU1BOzs7QUFDQSxJQUFNRSxvQkFBb0IsR0FBRyxTQUF2QkEsb0JBQXVCLENBQUNKLEtBQUQsRUFBVztBQUN0QyxNQUFNSyxnQkFBZ0IsR0FBR0wsS0FBSyxDQUFDTSxNQUFOLENBQWFDLFVBQWIsQ0FBd0JBLFVBQXhCLENBQW1DQyxhQUFuQyxDQUFpRCxrQkFBakQsRUFBcUVDLFVBQTlGOztBQUNBLE1BQUdULEtBQUssQ0FBQ00sTUFBTixDQUFhSSxLQUFiLElBQXNCLEdBQXpCLEVBQTZCO0FBQzNCO0FBQ0FMLG9CQUFnQixDQUFDTSxTQUFqQixHQUE2QlgsS0FBSyxDQUFDTSxNQUFOLENBQWFDLFVBQWIsQ0FBd0JBLFVBQXhCLENBQW1DQyxhQUFuQyxDQUFpRCxTQUFqRCxFQUE0REcsU0FBekY7QUFDRCxHQUhELE1BSUssSUFBR1gsS0FBSyxDQUFDTSxNQUFOLENBQWFJLEtBQWIsSUFBc0IsR0FBekIsRUFBNkI7QUFDaEM7QUFDQUwsb0JBQWdCLENBQUNNLFNBQWpCLEdBQTZCWCxLQUFLLENBQUNNLE1BQU4sQ0FBYUMsVUFBYixDQUF3QkEsVUFBeEIsQ0FBbUNDLGFBQW5DLENBQWlELFNBQWpELEVBQTRERyxTQUF6RjtBQUNEO0FBQ0YsQ0FWRDs7QUFZQSxJQUFNQyxZQUFZLEdBQUcsU0FBZkEsWUFBZSxDQUFDWixLQUFELEVBQVc7QUFDOUIsTUFBSWEsRUFBRSxHQUFHQyxRQUFRLENBQUNDLE9BQU8sQ0FBQ1AsYUFBUixDQUFzQixTQUF0QixFQUFpQ0UsS0FBbEMsQ0FBakI7QUFDQSxNQUFJTSxJQUFJLEdBQUdGLFFBQVEsQ0FBQ0MsT0FBTyxDQUFDUCxhQUFSLENBQXNCLFdBQXRCLEVBQW1DRSxLQUFwQyxDQUFuQjtBQUNBLE1BQUdNLElBQUksSUFBSUgsRUFBWCxFQUNFRSxPQUFPLENBQUNQLGFBQVIsQ0FBc0IsU0FBdEIsRUFBaUNFLEtBQWpDLEdBQXlDLEVBQUVNLElBQTNDO0FBQ0gsQ0FMRCxDLENBT0E7QUFFQTs7O0FBQ0FmLENBQUMsQ0FBQyxpQkFBRCxDQUFELENBQ0dnQixRQURILEcsQ0FHQTtBQUVBOztBQUNBckIsTUFBTSxDQUFDWSxhQUFQLENBQXFCLE1BQXJCLEVBQTZCVSxnQkFBN0IsQ0FBOEMsT0FBOUMsRUFBdURuQixnQkFBdkQsRSxDQUVBOztBQUNBZ0IsT0FBTyxDQUFDUCxhQUFSLENBQXNCLGdCQUF0QixFQUF3Q0MsVUFBeEMsQ0FBbURTLGdCQUFuRCxDQUFvRSxRQUFwRSxFQUE4RWQsb0JBQTlFLEUsQ0FFQTs7QUFDQVcsT0FBTyxDQUFDUCxhQUFSLENBQXNCLGdCQUF0QixFQUF3Q0MsVUFBeEMsQ0FBbURVLGFBQW5ELENBQWlFLElBQUlDLEtBQUosQ0FBVSxRQUFWLENBQWpFO0FBRUFMLE9BQU8sQ0FBQ1AsYUFBUixDQUFzQixTQUF0QixFQUFpQ1UsZ0JBQWpDLENBQWtELFFBQWxELEVBQTRETixZQUE1RDtBQUVBRyxPQUFPLENBQUNQLGFBQVIsQ0FBc0IsV0FBdEIsRUFBbUNVLGdCQUFuQyxDQUFvRCxRQUFwRCxFQUE4RE4sWUFBOUQsRSIsImZpbGUiOiJ0eXBlLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vbWlkLWxvbmctdGVybS9zdGF0aWMvamF2YXNjcmlwdHMvbWFuYWdlL3R5cGUuanNcIik7XG4iLCJjb25zdCBoZWFkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGVhZGVyJylcblxuLy8gdmFyaWFibGVzID4gZnVuY3Rpb25zXG5cbi8vIGFkZCBwcm9qZWN0IGJ1dHRvbiBjbGlja2VkXG5jb25zdCBhZGRCdXR0b25DbGlja2VkID0gKGV2ZW50KSA9PiB7XG4gICQoJyNhZGRGb3JtJykubW9kYWwoe1xuICAgIG9uQXBwcm92ZSA6IGZ1bmN0aW9uKCl7cmV0dXJuIGZhbHNlfSxcbiAgfSkubW9kYWwoJ3Nob3cnKVxufVxuXG4vLyBoYW5kbGUgZHJvcGRvd24gb24gY2hhbmdlXG5jb25zdCB5ZWFyRHJvcGRvd25PbkNoYW5nZSA9IChldmVudCkgPT4ge1xuICBjb25zdCBjYW1wdXNlc0Ryb3BEb3duID0gZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yKCcuY2FtcHVzLWRyb3Bkb3duJykuZmlyc3RDaGlsZFxuICBpZihldmVudC50YXJnZXQudmFsdWUgPT0gJzAnKXtcbiAgICAvLyBmaW5kIHRoZSBpbm5lckhUTUwgb2YgLm5vcm1hbFxuICAgIGNhbXB1c2VzRHJvcERvd24uaW5uZXJIVE1MID0gZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yKCcubm9ybWFsJykuaW5uZXJIVE1MXG4gIH1cbiAgZWxzZSBpZihldmVudC50YXJnZXQudmFsdWUgPT0gJzEnKXtcbiAgICAvLyBmaW5kIHRoZSBpbm5lckhUTUwgb2YgLm90aGVyc1xuICAgIGNhbXB1c2VzRHJvcERvd24uaW5uZXJIVE1MID0gZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yKCcub3RoZXJzJykuaW5uZXJIVE1MXG4gIH1cbn1cblxuY29uc3QgcmVzdHJpY3RZZWFyID0gKGV2ZW50KSA9PiB7XG4gIGxldCB0byA9IHBhcnNlSW50KGFkZEZvcm0ucXVlcnlTZWxlY3RvcignLnllYXJUbycpLnZhbHVlKVxuICBsZXQgZnJvbSA9IHBhcnNlSW50KGFkZEZvcm0ucXVlcnlTZWxlY3RvcignLnllYXJGcm9tJykudmFsdWUpXG4gIGlmKGZyb20gPj0gdG8pXG4gICAgYWRkRm9ybS5xdWVyeVNlbGVjdG9yKCcueWVhclRvJykudmFsdWUgPSArK2Zyb21cbn1cblxuLy8gaW5pdFxuXG4vL3JlZnJlc2ggZHJvcGR3b24gaW4gYWRkRm9ybVxuJCgnc2VsZWN0LmRyb3Bkb3duJylcbiAgLmRyb3Bkb3duKClcblxuLy8gYWRkIGV2ZW50IGxpc3RlbmVyXG5cbi8vIGFkZCBldmVudCBsaXN0ZW5lciB0byB0aGUgYWRkIGJ1dHRvblxuaGVhZGVyLnF1ZXJ5U2VsZWN0b3IoJy5hZGQnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFkZEJ1dHRvbkNsaWNrZWQpXG5cbi8vIGFkZCBldmVudCBsaXN0ZW5lciB0byB0aGUgZHJvcGRvd24gb2YgYWRkRm9ybVxuYWRkRm9ybS5xdWVyeVNlbGVjdG9yKCcudHlwZS1kcm9wZG93bicpLmZpcnN0Q2hpbGQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgeWVhckRyb3Bkb3duT25DaGFuZ2UpXG5cbi8vIHRyaWdnZXIgZHJvcGRvd24gb24gY2hhbmdlIHRvIHJlZnJlc2ggdGhlIHNlbGVjdGlvbiBvZiBzY2hvb2xcbmFkZEZvcm0ucXVlcnlTZWxlY3RvcignLnR5cGUtZHJvcGRvd24nKS5maXJzdENoaWxkLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdjaGFuZ2UnKSlcblxuYWRkRm9ybS5xdWVyeVNlbGVjdG9yKCcueWVhclRvJykuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgcmVzdHJpY3RZZWFyKVxuXG5hZGRGb3JtLnF1ZXJ5U2VsZWN0b3IoJy55ZWFyRnJvbScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHJlc3RyaWN0WWVhcikiXSwic291cmNlUm9vdCI6IiJ9