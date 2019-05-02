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
/******/ 	return __webpack_require__(__webpack_require__.s = "./short-term/static/javascripts/manage/year.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./short-term/static/javascripts/manage/year.js":
/*!******************************************************!*\
  !*** ./short-term/static/javascripts/manage/year.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var header = document.getElementById('header');
var addForm = document.getElementById('addForm');
var pageManagement = document.getElementById('page-management'); //handle the delete pop up form

var Delete =
/*#__PURE__*/
function () {
  function Delete() {
    _classCallCheck(this, Delete);

    this.deleteForm = document.getElementById('delete');
  }

  _createClass(Delete, null, [{
    key: "showDeleteConfirm",
    value: function showDeleteConfirm(that) {
      return function (event) {
        event.preventDefault();
        $('#delete').modal({
          onApprove: function onApprove() {
            return true;
          }
        }).modal('show');
        var campusNode = event.target;
        if (that.lastDeleteEvent) that.deleteForm.querySelector('.positive').removeEventListener('click', that.lastDeleteEvent);
        that.lastDeleteEvent = Delete.deleteContent(that, campusNode);
        that.deleteForm.querySelector('.positive').addEventListener('click', that.lastDeleteEvent);
      };
    } // handle delete event

  }, {
    key: "deleteContent",
    value: function deleteContent(that, campusNode) {
      return function () {
        var path = campusNode.value;
        fetch("".concat(path), {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(function (res) {
          return res.text();
        }).then(function (res) {
          if (res == 'OK') {
            // window.location.assign(`/man/${user_id}`)
            var box = campusNode.parentNode.parentNode.parentNode.parentNode;
            var container = box.parentNode;
            box.remove();

            if (container.childElementCount - 1 == 0) {
              container.remove();
            }
          } else throw new Error('刪除失敗');
        })["catch"](function (err) {
          throw err;
        });
      };
    }
  }]);

  return Delete;
}(); // variables > functions
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
}; // init


var del = new Delete(); //refresh dropdwon in addForm

$('select.dropdown').dropdown();
$('.pointing.dropdown').dropdown(); // add event listener
// add event listener to the add button

header.querySelector('.add').addEventListener('click', addButtonClicked); // add enent listener to the dropdown of addForm

addForm.querySelector('.type-dropdown').firstChild.addEventListener('change', yearDropdownOnChange); // trigger dropdown on change to refresh the selection of school

addForm.querySelector('.type-dropdown').firstChild.dispatchEvent(new Event('change'));
pageManagement.querySelectorAll('.deleteBtn').forEach(function (node) {
  console.log(node);
  node.addEventListener('click', Delete.showDeleteConfirm(del));
});

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc2hvcnQtdGVybS9zdGF0aWMvamF2YXNjcmlwdHMvbWFuYWdlL3llYXIuanMiXSwibmFtZXMiOlsiaGVhZGVyIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsImFkZEZvcm0iLCJwYWdlTWFuYWdlbWVudCIsIkRlbGV0ZSIsImRlbGV0ZUZvcm0iLCJ0aGF0IiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsIiQiLCJtb2RhbCIsIm9uQXBwcm92ZSIsImNhbXB1c05vZGUiLCJ0YXJnZXQiLCJsYXN0RGVsZXRlRXZlbnQiLCJxdWVyeVNlbGVjdG9yIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImRlbGV0ZUNvbnRlbnQiLCJhZGRFdmVudExpc3RlbmVyIiwicGF0aCIsInZhbHVlIiwiZmV0Y2giLCJtZXRob2QiLCJoZWFkZXJzIiwidGhlbiIsInJlcyIsInRleHQiLCJib3giLCJwYXJlbnROb2RlIiwiY29udGFpbmVyIiwicmVtb3ZlIiwiY2hpbGRFbGVtZW50Q291bnQiLCJFcnJvciIsImVyciIsImFkZEJ1dHRvbkNsaWNrZWQiLCJ5ZWFyRHJvcGRvd25PbkNoYW5nZSIsImNhbXB1c2VzRHJvcERvd24iLCJmaXJzdENoaWxkIiwiaW5uZXJIVE1MIiwiZGVsIiwiZHJvcGRvd24iLCJkaXNwYXRjaEV2ZW50IiwiRXZlbnQiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZm9yRWFjaCIsIm5vZGUiLCJjb25zb2xlIiwibG9nIiwic2hvd0RlbGV0ZUNvbmZpcm0iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFD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QTs7QUFDQXpDLE1BQU0sQ0FBQ2dCLGFBQVAsQ0FBcUIsTUFBckIsRUFBNkJHLGdCQUE3QixDQUE4QyxPQUE5QyxFQUF1RGdCLGdCQUF2RCxFLENBRUE7O0FBQ0FoQyxPQUFPLENBQUNhLGFBQVIsQ0FBc0IsZ0JBQXRCLEVBQXdDc0IsVUFBeEMsQ0FBbURuQixnQkFBbkQsQ0FBb0UsUUFBcEUsRUFBOEVpQixvQkFBOUUsRSxDQUVBOztBQUNBakMsT0FBTyxDQUFDYSxhQUFSLENBQXNCLGdCQUF0QixFQUF3Q3NCLFVBQXhDLENBQW1ESSxhQUFuRCxDQUFpRSxJQUFJQyxLQUFKLENBQVUsUUFBVixDQUFqRTtBQUdBdkMsY0FBYyxDQUFDd0MsZ0JBQWYsQ0FBZ0MsWUFBaEMsRUFBOENDLE9BQTlDLENBQXNELFVBQUNDLElBQUQsRUFBVTtBQUM5REMsU0FBTyxDQUFDQyxHQUFSLENBQVlGLElBQVo7QUFDQUEsTUFBSSxDQUFDM0IsZ0JBQUwsQ0FBc0IsT0FBdEIsRUFBK0JkLE1BQU0sQ0FBQzRDLGlCQUFQLENBQXlCVCxHQUF6QixDQUEvQjtBQUNELENBSEQsRSIsImZpbGUiOiJ5ZWFyLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc2hvcnQtdGVybS9zdGF0aWMvamF2YXNjcmlwdHMvbWFuYWdlL3llYXIuanNcIik7XG4iLCJjb25zdCBoZWFkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGVhZGVyJylcbmNvbnN0IGFkZEZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWRkRm9ybScpXG5jb25zdCBwYWdlTWFuYWdlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlLW1hbmFnZW1lbnQnKVxuXG5cbi8vaGFuZGxlIHRoZSBkZWxldGUgcG9wIHVwIGZvcm1cbmNsYXNzIERlbGV0ZSB7XG4gIGNvbnN0cnVjdG9yKCl7XG4gICAgdGhpcy5kZWxldGVGb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RlbGV0ZScpXG4gIH1cbiAgc3RhdGljIHNob3dEZWxldGVDb25maXJtKHRoYXQpe1xuICAgIHJldHVybiAoZXZlbnQpID0+e1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgJCgnI2RlbGV0ZScpLm1vZGFsKHtcbiAgICAgICAgb25BcHByb3ZlIDogZnVuY3Rpb24oKXsgcmV0dXJuIHRydWV9LFxuICAgICAgfSkubW9kYWwoJ3Nob3cnKVxuICAgICAgY29uc3QgY2FtcHVzTm9kZSA9IGV2ZW50LnRhcmdldFxuICAgICAgaWYodGhhdC5sYXN0RGVsZXRlRXZlbnQpXG4gICAgICAgIHRoYXQuZGVsZXRlRm9ybS5xdWVyeVNlbGVjdG9yKCcucG9zaXRpdmUnKS5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoYXQubGFzdERlbGV0ZUV2ZW50KVxuICAgICAgdGhhdC5sYXN0RGVsZXRlRXZlbnQgPSBEZWxldGUuZGVsZXRlQ29udGVudCh0aGF0LCBjYW1wdXNOb2RlKVxuICAgICAgdGhhdC5kZWxldGVGb3JtLnF1ZXJ5U2VsZWN0b3IoJy5wb3NpdGl2ZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhhdC5sYXN0RGVsZXRlRXZlbnQpXG4gICAgfVxuICB9XG4gIC8vIGhhbmRsZSBkZWxldGUgZXZlbnRcbiAgc3RhdGljIGRlbGV0ZUNvbnRlbnQodGhhdCwgY2FtcHVzTm9kZSl7XG4gICAgcmV0dXJuICgpID0+e1xuICAgICAgbGV0IHBhdGggPSBjYW1wdXNOb2RlLnZhbHVlXG4gICAgICBmZXRjaChgJHtwYXRofWAsIHtcbiAgICAgICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgICAgICAudGhlbihyZXMgPT4gcmVzLnRleHQoKSlcbiAgICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICBpZihyZXMgPT0gJ09LJyl7XG4gICAgICAgICAgICAvLyB3aW5kb3cubG9jYXRpb24uYXNzaWduKGAvbWFuLyR7dXNlcl9pZH1gKVxuICAgICAgICAgICAgbGV0IGJveCA9IGNhbXB1c05vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZVxuICAgICAgICAgICAgbGV0IGNvbnRhaW5lciA9IGJveC5wYXJlbnROb2RlXG4gICAgICAgICAgICBib3gucmVtb3ZlKClcbiAgICAgICAgICAgIGlmKGNvbnRhaW5lci5jaGlsZEVsZW1lbnRDb3VudCAtIDEgPT0gMCl7XG4gICAgICAgICAgICAgIGNvbnRhaW5lci5yZW1vdmUoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ+WIqumZpOWkseaVlycpXG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgIHRocm93IGVyclxuICAgICAgICB9KVxuICAgIH1cbiAgfVxufVxuXG5cbi8vIHZhcmlhYmxlcyA+IGZ1bmN0aW9uc1xuXG4vLyBhZGQgcHJvamVjdCBidXR0b24gY2xpY2tlZFxuY29uc3QgYWRkQnV0dG9uQ2xpY2tlZCA9IChldmVudCkgPT4ge1xuICAkKCcjYWRkRm9ybScpLm1vZGFsKHtcbiAgICBvbkFwcHJvdmUgOiBmdW5jdGlvbigpe3JldHVybiBmYWxzZX0sXG4gIH0pLm1vZGFsKCdzaG93Jylcbn1cblxuLy8gaGFuZGxlIGRyb3Bkb3duIG9uIGNoYW5nZVxuY29uc3QgeWVhckRyb3Bkb3duT25DaGFuZ2UgPSAoZXZlbnQpID0+IHtcbiAgY29uc3QgY2FtcHVzZXNEcm9wRG93biA9IGV2ZW50LnRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUucXVlcnlTZWxlY3RvcignLmNhbXB1cy1kcm9wZG93bicpLmZpcnN0Q2hpbGRcbiAgaWYoZXZlbnQudGFyZ2V0LnZhbHVlID09ICcwJyl7XG4gICAgLy8gZmluZCB0aGUgaW5uZXJIVE1MIG9mIC5ub3JtYWxcbiAgICBjYW1wdXNlc0Ryb3BEb3duLmlubmVySFRNTCA9IGV2ZW50LnRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUucXVlcnlTZWxlY3RvcignLm5vcm1hbCcpLmlubmVySFRNTFxuICB9XG4gIGVsc2UgaWYoZXZlbnQudGFyZ2V0LnZhbHVlID09ICcxJyl7XG4gICAgLy8gZmluZCB0aGUgaW5uZXJIVE1MIG9mIC5vdGhlcnNcbiAgICBjYW1wdXNlc0Ryb3BEb3duLmlubmVySFRNTCA9IGV2ZW50LnRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUucXVlcnlTZWxlY3RvcignLm90aGVycycpLmlubmVySFRNTFxuICB9XG59XG5cbi8vIGluaXRcbmxldCBkZWwgPSBuZXcgRGVsZXRlKClcblxuLy9yZWZyZXNoIGRyb3Bkd29uIGluIGFkZEZvcm1cbiQoJ3NlbGVjdC5kcm9wZG93bicpXG4gIC5kcm9wZG93bigpXG5cbiQoJy5wb2ludGluZy5kcm9wZG93bicpXG4gIC5kcm9wZG93bigpXG5cbi8vIGFkZCBldmVudCBsaXN0ZW5lclxuXG4vLyBhZGQgZXZlbnQgbGlzdGVuZXIgdG8gdGhlIGFkZCBidXR0b25cbmhlYWRlci5xdWVyeVNlbGVjdG9yKCcuYWRkJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhZGRCdXR0b25DbGlja2VkKVxuXG4vLyBhZGQgZW5lbnQgbGlzdGVuZXIgdG8gdGhlIGRyb3Bkb3duIG9mIGFkZEZvcm1cbmFkZEZvcm0ucXVlcnlTZWxlY3RvcignLnR5cGUtZHJvcGRvd24nKS5maXJzdENoaWxkLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHllYXJEcm9wZG93bk9uQ2hhbmdlKVxuXG4vLyB0cmlnZ2VyIGRyb3Bkb3duIG9uIGNoYW5nZSB0byByZWZyZXNoIHRoZSBzZWxlY3Rpb24gb2Ygc2Nob29sXG5hZGRGb3JtLnF1ZXJ5U2VsZWN0b3IoJy50eXBlLWRyb3Bkb3duJykuZmlyc3RDaGlsZC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnY2hhbmdlJykpXG5cblxucGFnZU1hbmFnZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmRlbGV0ZUJ0bicpLmZvckVhY2goKG5vZGUpID0+IHtcbiAgY29uc29sZS5sb2cobm9kZSlcbiAgbm9kZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIERlbGV0ZS5zaG93RGVsZXRlQ29uZmlybShkZWwpKVxufSlcbiJdLCJzb3VyY2VSb290IjoiIn0=