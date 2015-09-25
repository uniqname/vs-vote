(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports["default"] = function (data) {
    return "\n<style>\n@keyframes grow-out {\n  from {\n    opacity: 1;\n    transform: translate(50%, 50%) scale(.5);\n  }\n\n  to {\n    opacity: 0;\n    transform: translate(50%, 50%) scale(10);\n    z-index: -1;\n  }\n}\n\n:host {\n    position: relative;\n    width: 100%;\n}\n\n[class*=\"vs-vote\"] {\n    box-sizing: border-box;\n}\n\n.vs-vote__stage {\n    display: flex;\n    flex-flow: row wrap;\n    justify-content: space-between;\n}\n\n[class|=\"vs-vote__contender\"] {\n    flex: 0 0 48%;\n    display: flex;\n    flex-flow: column nowrap;\n    justify-content: space-between;\n}\n\n[class|=\"vs-vote__vs\"] {\n    font-style: italic;\n    animation: grow-out 1s forwards;\n    position: fixed;\n    top: 50%;\n    left: 50%;\n    transform: translate(-50%, -50%);\n}\n\n[class|=\"vs-vote__image\"] {\n    width: 100%;\n    object-fit: cover;\n}\n\n[class|=\"vs-vote__figure\"] {\n    margin: 0;\n    padding: 0;\n}\n\n[class|=\"vs-vote__vote\"] {\n    color: rebeccapurple;\n    cursor: pointer;\n    border: .25rem solid currentcolor;\n    border-radius: .25rem;\n    background-color: hsla(270, 50%, 40%, .2);\n    font-size: 2em;\n    font-family: sans-serif;\n    font-style: italic;\n}\n</style>\n<p class=\"vs-vote__vs\">fight!</p>\n<h1 class=\"vs-vote__title\">" + data.title + "</h1>\n<div class=\"vs-vote__stage\">\n    <div class=\"vs-vote__contender--contender-a\">\n        <img class=\"vs-vote__image--contender-a\" src=\"/vs/" + encodeURIComponent(data.contenderA) + "\" alt=\"" + data.contenderA + "\" />\n        <slot name=\"contender-a\"></slot>\n        <button class=\"vs-vote__vote--contender-a\">+ 0</button>\n    </div>\n    <div class=\"vs-vote__contender--contender-b\">\n        <img class=\"vs-vote__image--contender-b\" src=\"/vs/" + encodeURIComponent(data.contenderB) + "\" alt=\"" + data.contenderB + "\" />\n        <slot name=\"contender-b\"></slot>\n        <button class=\"vs-vote__vote--contender-b\">+ 0</button>\n    </div>\n</div>\n";
};

;
module.exports = exports["default"];

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports["default"] = function (contenderA, contenderB) {
    var headers = new Headers({ "Content-Type": "application/json" }),
        id = undefined;

    if (!contenderB) {
        id = contenderA;
        contenderA = undefined;
    }

    return fetch("/api/vote?" + (id ? "id=" + id : '') + (contenderA ? "contenderA=" + contenderA + "&contenderB=" + contenderB : '')).then(function (resp) {
        return resp.json();
    });
};

module.exports = exports["default"];

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

exports['default'] = function () {
    var id = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
    var contender = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

    var headers = new Headers({ "Content-Type": "application/json" });

    return fetch("/api/vote", {
        method: "PATCH",
        headers: headers,
        body: JSON.stringify({
            id: id,
            contenderA: {
                votes: contender === 'contenderA' ? '+' : ''
            },
            contenderB: {
                votes: contender === 'contenderB' ? '+' : ''
            }
        })
    }).then(function (resp) {
        return resp.json();
    });
};

;
module.exports = exports['default'];

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

exports['default'] = function (id) {
    return fetch('/api/vote', {
        method: 'patch',
        body: JSON.stringify({
            id: id,
            contenderA: {
                value: 0
            },
            contenderB: {
                value: 0
            }
        })
    });
};

;
module.exports = exports['default'];

},{}],5:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _modulesGetVotesJs = require('./modules/get-votes.js');

var _modulesGetVotesJs2 = _interopRequireDefault(_modulesGetVotesJs);

var _modulesGetTemplateJs = require('./modules/get-template.js');

var _modulesGetTemplateJs2 = _interopRequireDefault(_modulesGetTemplateJs);

var _modulesRegisterVoteJs = require('./modules/register-vote.js');

var _modulesRegisterVoteJs2 = _interopRequireDefault(_modulesRegisterVoteJs);

var _modulesResetVotesJs = require('./modules/reset-votes.js');

var _modulesResetVotesJs2 = _interopRequireDefault(_modulesResetVotesJs);

var doc = document.currentScript.ownerDocument,
    qsa = function qsa(selector, root) {
    return [].concat(_toConsumableArray((root || document).querySelectorAll(selector)));
},
    whichContender = function whichContender(el) {
    return el.getAttribute('class').match('contender-a') ? 'contenderA' : 'contenderB';
},
    vsProto = Object.create(HTMLElement.prototype, {
    contenderA: {
        get: function get() {
            return this.getAttribute('contender-a');
        },
        set: function set(val) {
            this.setAttribute('contender-a', val);
        }
    },

    contenderB: {
        get: function get() {
            return this.getAttribute('contender-b');
        },
        set: function set(val) {
            this.setAttribute('contender-b', val);
        }
    },

    title: {
        get: function get() {
            return this.getAttribute('contender-a') + ' vs ' + this.getAttribute('contender-b');
        }
    },

    template: {
        get: function get() {
            var t = qsa('template#vs-vote', doc)[0];

            if (!t) {
                t = document.createElement('template');
                t.innerHTML = (0, _modulesGetTemplateJs2['default'])(this);
            }

            return document.importNode(t.content, true);
        }
    },

    shadowProxy: {
        get: function get() {
            return 'shadowRoot' in this ? this.shadowRoot || this.createShadowRoot() : this;
        }
    }
});

vsProto.render = function (data) {
    var vsVote = this;
    if ('shadowRoot' in this) {
        if (!this.shadowProxy.childElementCount) {
            this.shadowProxy.appendChild(this.template);
        }
        this._renderWithShadowRoot(data);
    } else {
        this._renderWithInnerHTML();
    }
    qsa('[class*=vs-vote__vote]', this.shadowProxy).map(function (btn) {
        return btn.addEventListener('click', function (evt) {
            (0, _modulesRegisterVoteJs2['default'])(vsVote.id, whichContender(evt.target)).then(function (val) {
                Object.keys(val).filter(function (key) {
                    return key !== 'id';
                }).map(function (key) {
                    vsVote.shadowProxy.querySelector('[class*="vs-vote__vote--' + (key === 'contenderA' ? 'contender-a' : 'contender-b') + '"]').textContent = '+ ' + val[key].votes;
                });
            });
        });
    });
};

vsProto._renderWithShadowRoot = function (data) {
    var _this = this;

    var imgDataMap = function imgDataMap(img) {
        var contender = whichContender(img);
        img.src = '/vs/' + encodeURIComponent(_this[contender]);
        img.alt = '' + _this[contender];
    };

    qsa('[class|="vs-vote__image"]', this.shadowRoot).map(imgDataMap);

    qsa('[class|="vs-vote__vote"]', this.shadowRoot).map(function (btn) {
        var contender = whichContender(btn);
        btn.textContent = '+ ' + data[contender].votes;
    });

    qsa('.vs-vote__title', this.shadowRoot).map(function (title) {
        return title.textContent = _this.title;
    });
};

vsProto._renderWithInnerHTML = function () {
    var _this2 = this;

    var templFrag = this.template;

    //emulate slotting
    qsa('slot', templFrag).sort(function (a, b) {
        return a.getAttribute('name') > b.getAttribute('name');
    }).map(function (slot) {
        var name = slot.getAttribute('name') || '*';
        return qsa('[slot="' + name + '"]', _this2).map(function (node) {
            return slot.appendChild(node);
        });
    });
    this.innerHTML = '';
    this.appendChild(templFrag);
};

vsProto.createdCallback = function () {
    var vsVote = this;
    (0, _modulesGetVotesJs2['default'])(vsVote.contenderA, vsVote.contenderB).then(function (votes) {
        vsVote.dataset.id = votes.id;
        vsVote.render.bind(vsVote)(votes);
    });
};

vsProto.attributeChangedCallback = function (attr, prev, curr) {
    if (attr.toLowerCase() === 'contender-a' || attr.toLowerCase() === 'contender-b') {
        var vsVote = this;
        (0, _modulesGetVotesJs2['default'])(vsVote.contenderA, vsVote.contenderB).then(function (votes) {
            vsVote.dataset.id = votes.id;
            vsVote.render.bind(vsVote)(votes);
        });
    }
};

var Vs = document.registerElement('vs-vote', { prototype: vsProto });

},{"./modules/get-template.js":1,"./modules/get-votes.js":2,"./modules/register-vote.js":3,"./modules/reset-votes.js":4}]},{},[5])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvdnMtdm90ZS9wdWJsaWMvY29tcG9uZW50cy92cy12b3RlL21vZHVsZXMvZ2V0LXRlbXBsYXRlLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL3ZzLXZvdGUvcHVibGljL2NvbXBvbmVudHMvdnMtdm90ZS9tb2R1bGVzL2dldC12b3Rlcy5qcyIsIi9Vc2Vycy9jb3J5YnJvd24vY29kZS92cy12b3RlL3B1YmxpYy9jb21wb25lbnRzL3ZzLXZvdGUvbW9kdWxlcy9yZWdpc3Rlci12b3RlLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL3ZzLXZvdGUvcHVibGljL2NvbXBvbmVudHMvdnMtdm90ZS9tb2R1bGVzL3Jlc2V0LXZvdGVzLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL3ZzLXZvdGUvcHVibGljL2NvbXBvbmVudHMvdnMtdm90ZS92cy12b3RlLmVzNiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztxQkNBZSxVQUFTLElBQUksRUFBRTtBQUMxQix1d0NBb0V5QixJQUFJLENBQUMsS0FBSyxpS0FHcUIsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxpQkFBVSxJQUFJLENBQUMsVUFBVSw0UEFLNUQsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxpQkFBVSxJQUFJLENBQUMsVUFBVSxnSkFLdkg7Q0FDQTs7QUFBQSxDQUFDOzs7Ozs7Ozs7O3FCQ25GYSxVQUFVLFVBQVUsRUFBRSxVQUFVLEVBQUU7QUFDN0MsUUFBSSxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsRUFBQyxjQUFjLEVBQUUsa0JBQWtCLEVBQUMsQ0FBQztRQUMzRCxFQUFFLFlBQUEsQ0FBQzs7QUFFUCxRQUFJLENBQUMsVUFBVSxFQUFFO0FBQ2IsVUFBRSxHQUFHLFVBQVUsQ0FBQztBQUNoQixr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LFlBQVk7QUFDbEMsUUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLHdDQUFTLE1BQU0sQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUN6QyxJQUFJLENBQUUsVUFBVSxLQUFLLEVBQUU7QUFDcEIsY0FBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQztBQUM3QixjQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQTtLQUNwQyxDQUFDLENBQUM7Q0FDVixDQUFDOztBQUVGLE9BQU8sQ0FBQyx3QkFBd0IsR0FBRyxVQUFVLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFO0FBQzNELFFBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxLQUFLLGFBQWEsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLEtBQUssYUFBYSxFQUFFO0FBQzlFLFlBQUksTUFBTSxHQUFHLElBQUksQ0FBQztBQUNsQiw0Q0FBUyxNQUFNLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FDekMsSUFBSSxDQUFFLFVBQVUsS0FBSyxFQUFFO0FBQ3BCLGtCQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDO0FBQzdCLGtCQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQTtTQUNwQyxDQUFDLENBQUM7S0FDVjtDQUNKLENBQUE7O0FBRUQsSUFBSSxFQUFFLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxTQUFTLEVBQUUsRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihkYXRhKSB7XG4gICAgcmV0dXJuIGBcbjxzdHlsZT5cbkBrZXlmcmFtZXMgZ3Jvdy1vdXQge1xuICBmcm9tIHtcbiAgICBvcGFjaXR5OiAxO1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKDUwJSwgNTAlKSBzY2FsZSguNSk7XG4gIH1cblxuICB0byB7XG4gICAgb3BhY2l0eTogMDtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSg1MCUsIDUwJSkgc2NhbGUoMTApO1xuICAgIHotaW5kZXg6IC0xO1xuICB9XG59XG5cbjpob3N0IHtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgd2lkdGg6IDEwMCU7XG59XG5cbltjbGFzcyo9XCJ2cy12b3RlXCJdIHtcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xufVxuXG4udnMtdm90ZV9fc3RhZ2Uge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1mbG93OiByb3cgd3JhcDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG59XG5cbltjbGFzc3w9XCJ2cy12b3RlX19jb250ZW5kZXJcIl0ge1xuICAgIGZsZXg6IDAgMCA0OCU7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWZsb3c6IGNvbHVtbiBub3dyYXA7XG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xufVxuXG5bY2xhc3N8PVwidnMtdm90ZV9fdnNcIl0ge1xuICAgIGZvbnQtc3R5bGU6IGl0YWxpYztcbiAgICBhbmltYXRpb246IGdyb3ctb3V0IDFzIGZvcndhcmRzO1xuICAgIHBvc2l0aW9uOiBmaXhlZDtcbiAgICB0b3A6IDUwJTtcbiAgICBsZWZ0OiA1MCU7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XG59XG5cbltjbGFzc3w9XCJ2cy12b3RlX19pbWFnZVwiXSB7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgb2JqZWN0LWZpdDogY292ZXI7XG59XG5cbltjbGFzc3w9XCJ2cy12b3RlX19maWd1cmVcIl0ge1xuICAgIG1hcmdpbjogMDtcbiAgICBwYWRkaW5nOiAwO1xufVxuXG5bY2xhc3N8PVwidnMtdm90ZV9fdm90ZVwiXSB7XG4gICAgY29sb3I6IHJlYmVjY2FwdXJwbGU7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIGJvcmRlcjogLjI1cmVtIHNvbGlkIGN1cnJlbnRjb2xvcjtcbiAgICBib3JkZXItcmFkaXVzOiAuMjVyZW07XG4gICAgYmFja2dyb3VuZC1jb2xvcjogaHNsYSgyNzAsIDUwJSwgNDAlLCAuMik7XG4gICAgZm9udC1zaXplOiAyZW07XG4gICAgZm9udC1mYW1pbHk6IHNhbnMtc2VyaWY7XG4gICAgZm9udC1zdHlsZTogaXRhbGljO1xufVxuPC9zdHlsZT5cbjxwIGNsYXNzPVwidnMtdm90ZV9fdnNcIj5maWdodCE8L3A+XG48aDEgY2xhc3M9XCJ2cy12b3RlX190aXRsZVwiPiR7ZGF0YS50aXRsZX08L2gxPlxuPGRpdiBjbGFzcz1cInZzLXZvdGVfX3N0YWdlXCI+XG4gICAgPGRpdiBjbGFzcz1cInZzLXZvdGVfX2NvbnRlbmRlci0tY29udGVuZGVyLWFcIj5cbiAgICAgICAgPGltZyBjbGFzcz1cInZzLXZvdGVfX2ltYWdlLS1jb250ZW5kZXItYVwiIHNyYz1cIi92cy8ke2VuY29kZVVSSUNvbXBvbmVudChkYXRhLmNvbnRlbmRlckEpfVwiIGFsdD1cIiR7ZGF0YS5jb250ZW5kZXJBfVwiIC8+XG4gICAgICAgIDxzbG90IG5hbWU9XCJjb250ZW5kZXItYVwiPjwvc2xvdD5cbiAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInZzLXZvdGVfX3ZvdGUtLWNvbnRlbmRlci1hXCI+KyAwPC9idXR0b24+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInZzLXZvdGVfX2NvbnRlbmRlci0tY29udGVuZGVyLWJcIj5cbiAgICAgICAgPGltZyBjbGFzcz1cInZzLXZvdGVfX2ltYWdlLS1jb250ZW5kZXItYlwiIHNyYz1cIi92cy8ke2VuY29kZVVSSUNvbXBvbmVudChkYXRhLmNvbnRlbmRlckIpfVwiIGFsdD1cIiR7ZGF0YS5jb250ZW5kZXJCfVwiIC8+XG4gICAgICAgIDxzbG90IG5hbWU9XCJjb250ZW5kZXItYlwiPjwvc2xvdD5cbiAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInZzLXZvdGVfX3ZvdGUtLWNvbnRlbmRlci1iXCI+KyAwPC9idXR0b24+XG4gICAgPC9kaXY+XG48L2Rpdj5cbmBcbn07XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoY29udGVuZGVyQSwgY29udGVuZGVyQikge1xuICAgIGxldCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoe1wiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwifSksXG4gICAgICAgIGlkO1xuXG4gICAgaWYgKCFjb250ZW5kZXJCKSB7XG4gICAgICAgIGlkID0gY29udGVuZGVyQTtcbiAgICAgICAgY29udGVuZGVyQSA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZXR1cm4gZmV0Y2goYC9hcGkvdm90ZT8ke2lkID8gYGlkPSR7aWR9YCA6ICcnfSR7IGNvbnRlbmRlckEgPyBgY29udGVuZGVyQT0ke2NvbnRlbmRlckF9JmNvbnRlbmRlckI9JHtjb250ZW5kZXJCfWAgOiAnJ31gKVxuICAgICAgICAudGhlbiggcmVzcCA9PiByZXNwLmpzb24oKSk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoaWQ9JycsIGNvbnRlbmRlcj0nJykge1xuICAgIGxldCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9KTtcblxuICAgIHJldHVybiBmZXRjaChcIi9hcGkvdm90ZVwiLCB7XG4gICAgICAgIG1ldGhvZDogXCJQQVRDSFwiLFxuICAgICAgICBoZWFkZXJzOiBoZWFkZXJzLFxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICBpZDogaWQsXG4gICAgICAgICAgICBjb250ZW5kZXJBOiB7XG4gICAgICAgICAgICAgICAgdm90ZXM6IGNvbnRlbmRlciA9PT0gJ2NvbnRlbmRlckEnID8gJysnIDogJydcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb250ZW5kZXJCOiB7XG4gICAgICAgICAgICAgICAgdm90ZXM6IGNvbnRlbmRlciA9PT0gJ2NvbnRlbmRlckInID8gJysnIDogJydcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9KS50aGVuKCByZXNwID0+IHJlc3AuanNvbigpKVxufTtcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChpZCkge1xuICAgIHJldHVybiBmZXRjaCgnL2FwaS92b3RlJywge1xuICAgICAgICBtZXRob2Q6ICdwYXRjaCcsXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIGlkLFxuICAgICAgICAgICAgY29udGVuZGVyQToge1xuICAgICAgICAgICAgICAgIHZhbHVlOiAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29udGVuZGVyQjoge1xuICAgICAgICAgICAgICAgIHZhbHVlOiAwXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSk7XG59O1xuIiwiaW1wb3J0IGdldFZvdGVzIGZyb20gJy4vbW9kdWxlcy9nZXQtdm90ZXMuanMnO1xuaW1wb3J0IGdldFRlbXBsYXRlIGZyb20gJy4vbW9kdWxlcy9nZXQtdGVtcGxhdGUuanMnO1xuaW1wb3J0IHJlZ2lzdGVyVm90ZSBmcm9tICcuL21vZHVsZXMvcmVnaXN0ZXItdm90ZS5qcyc7XG5pbXBvcnQgcmVzZXRWb3RlcyBmcm9tICcuL21vZHVsZXMvcmVzZXQtdm90ZXMuanMnO1xuXG5jb25zdCBkb2MgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0Lm93bmVyRG9jdW1lbnQsXG4gICAgcXNhID0gKHNlbGVjdG9yLCByb290KSA9PiB7XG4gICAgICAgIHJldHVybiBbLi4uKHJvb3QgfHwgZG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpXTtcbiAgICB9LFxuICAgIHdoaWNoQ29udGVuZGVyID0gZWwgPT4ge1xuICAgICAgICByZXR1cm4gZWwuZ2V0QXR0cmlidXRlKCdjbGFzcycpLm1hdGNoKCdjb250ZW5kZXItYScpID8gJ2NvbnRlbmRlckEnIDogJ2NvbnRlbmRlckInO1xuXG4gICAgfSxcbiAgICB2c1Byb3RvID0gT2JqZWN0LmNyZWF0ZShIVE1MRWxlbWVudC5wcm90b3R5cGUsIHtcbiAgICAgICAgY29udGVuZGVyQToge1xuICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoJ2NvbnRlbmRlci1hJyk7IH0sXG4gICAgICAgICAgICBzZXQodmFsKSB7IHRoaXMuc2V0QXR0cmlidXRlKCdjb250ZW5kZXItYScsIHZhbCk7IH1cbiAgICAgICAgfSxcblxuICAgICAgICBjb250ZW5kZXJCOiB7XG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZSgnY29udGVuZGVyLWInKTsgfSxcbiAgICAgICAgICAgIHNldCh2YWwpIHsgdGhpcy5zZXRBdHRyaWJ1dGUoJ2NvbnRlbmRlci1iJywgdmFsKTsgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHRpdGxlOiB7XG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiBgJHt0aGlzLmdldEF0dHJpYnV0ZSgnY29udGVuZGVyLWEnKX0gdnMgJHt0aGlzLmdldEF0dHJpYnV0ZSgnY29udGVuZGVyLWInKX1gfVxuICAgICAgICB9LFxuXG4gICAgICAgIHRlbXBsYXRlOiB7XG4gICAgICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHQgPSBxc2EoJ3RlbXBsYXRlI3ZzLXZvdGUnLCBkb2MpWzBdO1xuXG4gICAgICAgICAgICAgICAgaWYgKCF0KSB7XG4gICAgICAgICAgICAgICAgICB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgICAgICAgICAgICAgICAgIHQuaW5uZXJIVE1MID0gZ2V0VGVtcGxhdGUodGhpcyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmltcG9ydE5vZGUodC5jb250ZW50LCB0cnVlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHNoYWRvd1Byb3h5OiB7XG4gICAgICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICgnc2hhZG93Um9vdCcgaW4gdGhpcykgPyAodGhpcy5zaGFkb3dSb290IHx8IHRoaXMuY3JlYXRlU2hhZG93Um9vdCgpKSA6IHRoaXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxudnNQcm90by5yZW5kZXIgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIGxldCB2c1ZvdGUgPSB0aGlzO1xuICAgIGlmICgnc2hhZG93Um9vdCcgaW4gdGhpcykge1xuICAgICAgICBpZiAoIXRoaXMuc2hhZG93UHJveHkuY2hpbGRFbGVtZW50Q291bnQpIHtcbiAgICAgICAgICAgIHRoaXMuc2hhZG93UHJveHkuYXBwZW5kQ2hpbGQodGhpcy50ZW1wbGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcmVuZGVyV2l0aFNoYWRvd1Jvb3QoZGF0YSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fcmVuZGVyV2l0aElubmVySFRNTCgpO1xuICAgIH1cbiAgICBxc2EoJ1tjbGFzcyo9dnMtdm90ZV9fdm90ZV0nLCB0aGlzLnNoYWRvd1Byb3h5KVxuICAgICAgICAubWFwKCBidG4gPT4gYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgcmVnaXN0ZXJWb3RlKHZzVm90ZS5pZCwgd2hpY2hDb250ZW5kZXIoZXZ0LnRhcmdldCkpLnRoZW4odmFsID0+IHtcbiAgICAgICAgICAgICAgT2JqZWN0LmtleXModmFsKS5maWx0ZXIoa2V5ID0+IGtleSAhPT0gJ2lkJylcbiAgICAgICAgICAgICAgICAgIC5tYXAoa2V5ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICB2c1ZvdGUuc2hhZG93UHJveHkucXVlcnlTZWxlY3RvcihgW2NsYXNzKj1cInZzLXZvdGVfX3ZvdGUtLSR7a2V5ID09PSAnY29udGVuZGVyQScgPyAnY29udGVuZGVyLWEnIDogJ2NvbnRlbmRlci1iJyB9XCJdYCkudGV4dENvbnRlbnQgPSBgKyAke3ZhbFtrZXldLnZvdGVzfWA7XG4gICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pKTtcbn07XG5cbnZzUHJvdG8uX3JlbmRlcldpdGhTaGFkb3dSb290ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBsZXQgaW1nRGF0YU1hcCA9IGltZyA9PiB7XG4gICAgICAgIHZhciBjb250ZW5kZXIgPSB3aGljaENvbnRlbmRlcihpbWcpO1xuICAgICAgICBpbWcuc3JjID0gYC92cy8ke2VuY29kZVVSSUNvbXBvbmVudCh0aGlzW2NvbnRlbmRlcl0pfWA7XG4gICAgICAgIGltZy5hbHQgPSBgJHt0aGlzW2NvbnRlbmRlcl19YDtcbiAgICB9XG5cbiAgICBxc2EoJ1tjbGFzc3w9XCJ2cy12b3RlX19pbWFnZVwiXScsIHRoaXMuc2hhZG93Um9vdCkubWFwKGltZ0RhdGFNYXApO1xuXG4gICAgcXNhKCdbY2xhc3N8PVwidnMtdm90ZV9fdm90ZVwiXScsIHRoaXMuc2hhZG93Um9vdCkubWFwKGJ0biA9PiB7XG4gICAgICAgIHZhciBjb250ZW5kZXIgPSB3aGljaENvbnRlbmRlcihidG4pO1xuICAgICAgICAgICAgYnRuLnRleHRDb250ZW50ID0gYCsgJHtkYXRhW2NvbnRlbmRlcl0udm90ZXN9YFxuICAgIH0pO1xuXG4gICAgcXNhKCcudnMtdm90ZV9fdGl0bGUnLCB0aGlzLnNoYWRvd1Jvb3QpLm1hcCh0aXRsZSA9PiB0aXRsZS50ZXh0Q29udGVudCA9IHRoaXMudGl0bGUpO1xufTtcblxudnNQcm90by5fcmVuZGVyV2l0aElubmVySFRNTCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGVtcGxGcmFnID0gdGhpcy50ZW1wbGF0ZTtcblxuICAgIC8vZW11bGF0ZSBzbG90dGluZ1xuICAgIHFzYSgnc2xvdCcsIHRlbXBsRnJhZylcbiAgICAgICAgLnNvcnQoKGEsYikgPT4gYS5nZXRBdHRyaWJ1dGUoJ25hbWUnKSA+IGIuZ2V0QXR0cmlidXRlKCduYW1lJykgKVxuICAgICAgICAubWFwKCBzbG90ICA9PiB7XG4gICAgICAgICAgICB2YXIgbmFtZSA9IHNsb3QuZ2V0QXR0cmlidXRlKCduYW1lJykgfHwgJyonO1xuICAgICAgICAgICAgcmV0dXJuIHFzYShgW3Nsb3Q9XCIke25hbWV9XCJdYCwgdGhpcylcbiAgICAgICAgLm1hcCggbm9kZSA9PiBzbG90LmFwcGVuZENoaWxkKG5vZGUpKVxuICAgIH0pO1xuICAgIHRoaXMuaW5uZXJIVE1MID0gJyc7XG4gICAgdGhpcy5hcHBlbmRDaGlsZCh0ZW1wbEZyYWcpO1xufTtcblxudnNQcm90by5jcmVhdGVkQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHZzVm90ZSA9IHRoaXM7XG4gICAgZ2V0Vm90ZXModnNWb3RlLmNvbnRlbmRlckEsIHZzVm90ZS5jb250ZW5kZXJCKVxuICAgICAgICAudGhlbiggZnVuY3Rpb24gKHZvdGVzKSB7XG4gICAgICAgICAgICB2c1ZvdGUuZGF0YXNldC5pZCA9IHZvdGVzLmlkO1xuICAgICAgICAgICAgdnNWb3RlLnJlbmRlci5iaW5kKHZzVm90ZSkodm90ZXMpXG4gICAgICAgIH0pO1xufTtcblxudnNQcm90by5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sgPSBmdW5jdGlvbiAoYXR0ciwgcHJldiwgY3Vycikge1xuICAgIGlmIChhdHRyLnRvTG93ZXJDYXNlKCkgPT09ICdjb250ZW5kZXItYScgfHwgYXR0ci50b0xvd2VyQ2FzZSgpID09PSAnY29udGVuZGVyLWInKSB7XG4gICAgICAgIHZhciB2c1ZvdGUgPSB0aGlzO1xuICAgICAgICBnZXRWb3Rlcyh2c1ZvdGUuY29udGVuZGVyQSwgdnNWb3RlLmNvbnRlbmRlckIpXG4gICAgICAgICAgICAudGhlbiggZnVuY3Rpb24gKHZvdGVzKSB7XG4gICAgICAgICAgICAgICAgdnNWb3RlLmRhdGFzZXQuaWQgPSB2b3Rlcy5pZDtcbiAgICAgICAgICAgICAgICB2c1ZvdGUucmVuZGVyLmJpbmQodnNWb3RlKSh2b3RlcylcbiAgICAgICAgICAgIH0pO1xuICAgIH1cbn1cblxudmFyIFZzID0gZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCd2cy12b3RlJywgeyBwcm90b3R5cGU6IHZzUHJvdG8gfSk7XG4iXX0=
