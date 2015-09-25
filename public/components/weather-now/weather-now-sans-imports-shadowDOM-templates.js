(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var currDoc = document.currentScript.ownerDocument,

//Maps to pleasant icons for weather status.
iconBase = '//uxrepo.com/static/icon-sets/meteo/svg/',
    weatherMap = {
    clear: iconBase + 'sun.svg',
    rain: iconBase + 'rain.svg',
    'scattered clouds': iconBase + 'cloud-sun.svg',
    'partly cloudy': iconBase + 'cloud-sun.svg',
    'mostly cloudy': iconBase + 'cloud-sun-inv.svg',
    'overcast': iconBase + 'clouds.svg',
    windy: iconBase + 'windy.svg'
},

//utilities to work quciker on nodeLists
qsa = function qsa(sel, root) {
    return [].slice.call(root.querySelectorAll(sel));
},
    textMapper = function textMapper(text) {
    return function (node) {
        return node.textContent = text;
    };
},
    srcMapper = function srcMapper(url) {
    return function (node) {
        return node.src = url;
    };
},

// updates the DOM with the information passed in.
render = function render(data, frag) {

    qsa('.location', frag).map(textMapper(data.display_location.full));

    qsa('.icon img', frag).map(srcMapper(weatherMap[data.weather.toLowerCase()] || data.image.url));

    qsa('.weather-description', frag).map(textMapper(data.weather));

    qsa('.wind', frag).map(textMapper(data.wind_string));

    //we set temp to the number of degrees in the preferred unit before
    //getting to render as we won't have that context within render
    qsa('.degs', frag).map(textMapper(data.temp));
    qsa('.unit', frag).map(textMapper(data.units));
},
    getWeather = function getWeather(location, units) {
    var loc = location.split(/,\s*/).map(function (item) {
        return item.replace(' ', '_');
    });
    return fetch('//api.wunderground.com/api/42db3c360babe4e5/conditions/q/' + loc[1] + '/' + loc[0] + '.json').then(function (resp) {
        return resp.json();
    }).then(function (data) {
        data = data.current_observation;

        if (!data) {
            data = {
                display_location: {
                    full: 'Could not find weather information for ' + location
                },
                temp_f: '?',
                temp_c: '?',
                weather: '',
                image: { url: '' },
                wind_string: ''
            };
        }

        data.temp = units === 'f' ? data.temp_f : data.temp_c;
        data.units = units.toUpperCase();

        return data;
    });
},
    templateStr = (function () {
    var t = document.createElement('not-a-template');
    t.innerHTML = '\n        <style>\n            figure {\n                display: flex;\n                font-family: sans-serif;\n                flex-flow: row wrap;\n                align-items: flex-start;\n                justify-content: space-between;\n            }\n            .icon, figcaption {\n                flex: 0 0 48%;\n            }\n            img {\n                max-width: 100%;\n            }\n            .temp {\n                font-weight: bold;\n                font-size: 2em;\n            }\n            .degs::after {\n                content: \'\\00B0\';\n            }\n            .wind::before {\n                content: \'Wind: \'\n            }\n        </style>\n        <section class="weather-block">\n            <h1 class="title">Weather for <span class="location">South Jordan, UT</span></h1>\n            <figure>\n                <div class="icon">\n                    <img src="//uxrepo.com/static/icon-sets/meteo/svg/rain.svg"/>\n                </div>\n                <figcaption>\n                    <p class="temp">\n                        <span class="degs">68</span>\n                        <span class="unit">F</span>\n                    </p>\n                    <p class="weather-description">Rainy</p>\n                    <p class="wind">From the NNW at 22.0 MPH Gusting to 28.0 MPH</p>\n                </figcaption>\n            </figure>\n        </section>\n        ';

    Object.defineProperty(t, 'content', {
        get: function get() {
            return [].concat(_toConsumableArray(t.children)).reduce(function (frag, child) {
                frag.appendChild(child);
                return frag;
            }, document.createDocumentFragment());
        }
    });

    return t;
})(),
    weatherProto = Object.create(HTMLElement.prototype, {
    location: {
        get: function get() {
            return this.getAttribute('location').toLowerCase();
        },
        set: function set(val) {
            this.setAttribute('location', val.toLowerCase());
        }
    },
    units: {
        get: function get() {
            return this.getAttribute('units').toLowerCase();
        },
        set: function set(val) {
            this.setAttribute('units', val.toLowerCase());
        }
    }
});

weatherProto.createdCallback = function () {
    var _this = this;

    var template = templateStr.content;
    // shadowRoot = this.createShadowRoot();

    getWeather(this.location, this.units).then(function (data) {

        //"render" the data into the template
        render(data, template);

        //attach the template fragment to the shadow root once rendered
        _this.appendChild(document.importNode(template, true));
    });
};

weatherProto.attributeChangedCallback = function (attr, prev, curr) {
    var _this2 = this;

    getWeather(this.location, this.units).then(function (data) {
        return render(data, _this2);
    });
};

var Weather = document.registerElement('weather-now', { prototype: weatherProto });

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvdnMtdm90ZS9wdWJsaWMvY29tcG9uZW50cy93ZWF0aGVyLW5vdy93ZWF0aGVyLW5vdy1zYW5zLWltcG9ydHMtc2hhZG93RE9NLXRlbXBsYXRlcy5lczYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0FDQUEsSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxhQUFhOzs7QUFHOUMsUUFBUSw2Q0FBNkM7SUFDckQsVUFBVSxHQUFHO0FBQ1QsU0FBSyxFQUFLLFFBQVEsWUFBUztBQUMzQixRQUFJLEVBQU0sUUFBUSxhQUFVO0FBQzVCLHNCQUFrQixFQUFLLFFBQVEsa0JBQWU7QUFDOUMsbUJBQWUsRUFBSyxRQUFRLGtCQUFlO0FBQzNDLG1CQUFlLEVBQUksUUFBUSxzQkFBbUI7QUFDOUMsY0FBVSxFQUFLLFFBQVEsZUFBWTtBQUNuQyxTQUFLLEVBQUssUUFBUSxjQUFXO0NBQ2hDOzs7QUFHRCxHQUFHLEdBQUcsU0FBTixHQUFHLENBQUksR0FBRyxFQUFFLElBQUk7V0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUM7Q0FBQTtJQUU5RCxVQUFVLEdBQUcsU0FBYixVQUFVLENBQUcsSUFBSTtXQUFJLFVBQUEsSUFBSTtlQUFJLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSTtLQUFBO0NBQUE7SUFFcEQsU0FBUyxHQUFHLFNBQVosU0FBUyxDQUFHLEdBQUc7V0FBSSxVQUFBLElBQUk7ZUFBSSxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUc7S0FBQTtDQUFBOzs7QUFHekMsTUFBTSxHQUFHLFNBQVQsTUFBTSxDQUFJLElBQUksRUFBRSxJQUFJLEVBQUs7O0FBRXJCLE9BQUcsQ0FBQyxXQUFXLEVBQUUsSUFBSSxD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SUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQ2pDLElBQUksQ0FBQyxVQUFBLElBQUk7ZUFBSSxNQUFNLENBQUMsSUFBSSxTQUFPO0tBQUEsQ0FBQyxDQUFDO0NBQ3hDLENBQUM7O0FBRUYsSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxhQUFhLEVBQUUsRUFBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJsZXQgY3VyckRvYyA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQub3duZXJEb2N1bWVudCxcblxuICAgIC8vTWFwcyB0byBwbGVhc2FudCBpY29ucyBmb3Igd2VhdGhlciBzdGF0dXMuXG4gICAgaWNvbkJhc2UgPSBgLy91eHJlcG8uY29tL3N0YXRpYy9pY29uLXNldHMvbWV0ZW8vc3ZnL2AsXG4gICAgd2VhdGhlck1hcCA9IHtcbiAgICAgICAgY2xlYXI6IGAke2ljb25CYXNlfXN1bi5zdmdgLFxuICAgICAgICByYWluOiAgYCR7aWNvbkJhc2V9cmFpbi5zdmdgLFxuICAgICAgICAnc2NhdHRlcmVkIGNsb3Vkcyc6IGAke2ljb25CYXNlfWNsb3VkLXN1bi5zdmdgLFxuICAgICAgICAncGFydGx5IGNsb3VkeSc6IGAke2ljb25CYXNlfWNsb3VkLXN1bi5zdmdgLFxuICAgICAgICAnbW9zdGx5IGNsb3VkeSc6YCR7aWNvbkJhc2V9Y2xvdWQtc3VuLWludi5zdmdgLFxuICAgICAgICAnb3ZlcmNhc3QnOiBgJHtpY29uQmFzZX1jbG91ZHMuc3ZnYCxcbiAgICAgICAgd2luZHk6IGAke2ljb25CYXNlfXdpbmR5LnN2Z2BcbiAgICB9LFxuXG4gICAgLy91dGlsaXRpZXMgdG8gd29yayBxdWNpa2VyIG9uIG5vZGVMaXN0c1xuICAgIHFzYSA9IChzZWwsIHJvb3QpID0+IFtdLnNsaWNlLmNhbGwocm9vdC5xdWVyeVNlbGVjdG9yQWxsKHNlbCkpLFxuXG4gICAgdGV4dE1hcHBlciA9IHRleHQgPT4gbm9kZSA9PiBub2RlLnRleHRDb250ZW50ID0gdGV4dCxcblxuICAgIHNyY01hcHBlciA9IHVybCA9PiBub2RlID0+IG5vZGUuc3JjID0gdXJsLFxuXG4gICAgLy8gdXBkYXRlcyB0aGUgRE9NIHdpdGggdGhlIGluZm9ybWF0aW9uIHBhc3NlZCBpbi5cbiAgICByZW5kZXIgPSAoZGF0YSwgZnJhZykgPT4ge1xuXG4gICAgICAgIHFzYSgnLmxvY2F0aW9uJywgZnJhZykubWFwKHRleHRNYXBwZXIoZGF0YS5kaXNwbGF5X2xvY2F0aW9uLmZ1bGwpKTtcblxuICAgICAgICBxc2EoJy5pY29uIGltZycsIGZyYWcpLm1hcChzcmNNYXBwZXIod2VhdGhlck1hcFtkYXRhLndlYXRoZXIudG9Mb3dlckNhc2UoKV0gfHwgZGF0YS5pbWFnZS51cmwpKTtcblxuICAgICAgICBxc2EoJy53ZWF0aGVyLWRlc2NyaXB0aW9uJywgZnJhZykubWFwKHRleHRNYXBwZXIoZGF0YS53ZWF0aGVyKSk7XG5cbiAgICAgICAgcXNhKCcud2luZCcsIGZyYWcpLm1hcCh0ZXh0TWFwcGVyKGRhdGEud2luZF9zdHJpbmcpKTtcblxuICAgICAgICAvL3dlIHNldCB0ZW1wIHRvIHRoZSBudW1iZXIgb2YgZGVncmVlcyBpbiB0aGUgcHJlZmVycmVkIHVuaXQgYmVmb3JlXG4gICAgICAgIC8vZ2V0dGluZyB0byByZW5kZXIgYXMgd2Ugd29uJ3QgaGF2ZSB0aGF0IGNvbnRleHQgd2l0aGluIHJlbmRlclxuICAgICAgICBxc2EoJy5kZWdzJywgZnJhZykubWFwKHRleHRNYXBwZXIoZGF0YS50ZW1wKSk7XG4gICAgICAgIHFzYSgnLnVuaXQnLCBmcmFnKS5tYXAodGV4dE1hcHBlcihkYXRhLnVuaXRzKSk7XG4gICAgfSxcblxuICAgIGdldFdlYXRoZXIgPSAobG9jYXRpb24sIHVuaXRzKSA9PiB7XG4gICAgICAgIHZhciBsb2MgPSBsb2NhdGlvbi5zcGxpdCgvLFxccyovKS5tYXAoIGl0ZW0gPT4gaXRlbS5yZXBsYWNlKCcgJywgJ18nKSk7XG4gICAgICAgIHJldHVybiBmZXRjaChgLy9hcGkud3VuZGVyZ3JvdW5kLmNvbS9hcGkvNDJkYjNjMzYwYmFiZTRlNS9jb25kaXRpb25zL3EvJHtsb2NbMV19LyR7bG9jWzBdfS5qc29uYCkudGhlbihyZXNwID0+IHJlc3AuanNvbigpKS50aGVuKCBkYXRhID0+IHtcbiAgICAgICAgICAgIGRhdGEgPSBkYXRhLmN1cnJlbnRfb2JzZXJ2YXRpb247XG5cbiAgICAgICAgICAgIGlmICggIWRhdGEgKSB7XG4gICAgICAgICAgICAgICAgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheV9sb2NhdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgZnVsbDogYENvdWxkIG5vdCBmaW5kIHdlYXRoZXIgaW5mb3JtYXRpb24gZm9yICR7bG9jYXRpb259YFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB0ZW1wX2Y6ICc/JyxcbiAgICAgICAgICAgICAgICAgICAgdGVtcF9jOiAnPycsXG4gICAgICAgICAgICAgICAgICAgIHdlYXRoZXI6ICcnLFxuICAgICAgICAgICAgICAgICAgICBpbWFnZTogeyB1cmw6ICcnIH0sXG4gICAgICAgICAgICAgICAgICAgIHdpbmRfc3RyaW5nOiAnJ1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRhdGEudGVtcCA9ICh1bml0cyA9PT0gJ2YnKSA/IGRhdGEudGVtcF9mIDogZGF0YS50ZW1wX2M7XG4gICAgICAgICAgICBkYXRhLnVuaXRzID0gdW5pdHMudG9VcHBlckNhc2UoKTtcblxuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICB0ZW1wbGF0ZVN0ciA9ICgoKSA9PiB7XG4gICAgICAgICAgIGxldCB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbm90LWEtdGVtcGxhdGUnKTtcbiAgICAgICAgdC5pbm5lckhUTUwgPSBgXG4gICAgICAgIDxzdHlsZT5cbiAgICAgICAgICAgIGZpZ3VyZSB7XG4gICAgICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgICAgICBmb250LWZhbWlseTogc2Fucy1zZXJpZjtcbiAgICAgICAgICAgICAgICBmbGV4LWZsb3c6IHJvdyB3cmFwO1xuICAgICAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xuICAgICAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC5pY29uLCBmaWdjYXB0aW9uIHtcbiAgICAgICAgICAgICAgICBmbGV4OiAwIDAgNDglO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaW1nIHtcbiAgICAgICAgICAgICAgICBtYXgtd2lkdGg6IDEwMCU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAudGVtcCB7XG4gICAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gICAgICAgICAgICAgICAgZm9udC1zaXplOiAyZW07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAuZGVnczo6YWZ0ZXIge1xuICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICdcXFxcMDBCMCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAud2luZDo6YmVmb3JlIHtcbiAgICAgICAgICAgICAgICBjb250ZW50OiAnV2luZDogJ1xuICAgICAgICAgICAgfVxuICAgICAgICA8L3N0eWxlPlxuICAgICAgICA8c2VjdGlvbiBjbGFzcz1cIndlYXRoZXItYmxvY2tcIj5cbiAgICAgICAgICAgIDxoMSBjbGFzcz1cInRpdGxlXCI+V2VhdGhlciBmb3IgPHNwYW4gY2xhc3M9XCJsb2NhdGlvblwiPlNvdXRoIEpvcmRhbiwgVVQ8L3NwYW4+PC9oMT5cbiAgICAgICAgICAgIDxmaWd1cmU+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImljb25cIj5cbiAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9XCIvL3V4cmVwby5jb20vc3RhdGljL2ljb24tc2V0cy9tZXRlby9zdmcvcmFpbi5zdmdcIi8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGZpZ2NhcHRpb24+XG4gICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwidGVtcFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkZWdzXCI+Njg8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInVuaXRcIj5GPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwid2VhdGhlci1kZXNjcmlwdGlvblwiPlJhaW55PC9wPlxuICAgICAgICAgICAgICAgICAgICA8cCBjbGFzcz1cIndpbmRcIj5Gcm9tIHRoZSBOTlcgYXQgMjIuMCBNUEggR3VzdGluZyB0byAyOC4wIE1QSDwvcD5cbiAgICAgICAgICAgICAgICA8L2ZpZ2NhcHRpb24+XG4gICAgICAgICAgICA8L2ZpZ3VyZT5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICBgO1xuXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LCAnY29udGVudCcsIHtcbiAgICAgICAgICAgIGdldCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gWy4uLnQuY2hpbGRyZW5dLnJlZHVjZSgoZnJhZywgY2hpbGQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZnJhZy5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmcmFnO1xuICAgICAgICAgICAgICAgIH0sIGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0O1xuICAgIH0pKCksXG5cbiAgICB3ZWF0aGVyUHJvdG8gPSBPYmplY3QuY3JlYXRlKEhUTUxFbGVtZW50LnByb3RvdHlwZSwge1xuICAgICAgICBsb2NhdGlvbjoge1xuICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoJ2xvY2F0aW9uJykudG9Mb3dlckNhc2UoKTsgfSxcbiAgICAgICAgICAgIHNldCh2YWwpIHsgdGhpcy5zZXRBdHRyaWJ1dGUoJ2xvY2F0aW9uJywgdmFsLnRvTG93ZXJDYXNlKCkpOyB9XG4gICAgICAgIH0sXG4gICAgICAgIHVuaXRzOiB7XG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZSgndW5pdHMnKS50b0xvd2VyQ2FzZSgpOyB9LFxuICAgICAgICAgICAgc2V0KHZhbCkgeyB0aGlzLnNldEF0dHJpYnV0ZSgndW5pdHMnLCB2YWwudG9Mb3dlckNhc2UoKSk7IH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG53ZWF0aGVyUHJvdG8uY3JlYXRlZENhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgIGxldCB0ZW1wbGF0ZSA9IHRlbXBsYXRlU3RyLmNvbnRlbnQ7XG4gICAgICAgIC8vIHNoYWRvd1Jvb3QgPSB0aGlzLmNyZWF0ZVNoYWRvd1Jvb3QoKTtcblxuICAgIGdldFdlYXRoZXIodGhpcy5sb2NhdGlvbiwgdGhpcy51bml0cykudGhlbiggZGF0YSA9PiB7XG5cbiAgICAgICAgLy9cInJlbmRlclwiIHRoZSBkYXRhIGludG8gdGhlIHRlbXBsYXRlXG4gICAgICAgIHJlbmRlcihkYXRhLCB0ZW1wbGF0ZSk7XG5cbiAgICAgICAgLy9hdHRhY2ggdGhlIHRlbXBsYXRlIGZyYWdtZW50IHRvIHRoZSBzaGFkb3cgcm9vdCBvbmNlIHJlbmRlcmVkXG4gICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZSwgdHJ1ZSkpO1xuICAgIH0pO1xufVxuXG53ZWF0aGVyUHJvdG8uYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrID0gZnVuY3Rpb24gKGF0dHIsIHByZXYsIGN1cnIpIHtcbiAgICBnZXRXZWF0aGVyKHRoaXMubG9jYXRpb24sIHRoaXMudW5pdHMpXG4gICAgICAgLnRoZW4oZGF0YSA9PiByZW5kZXIoZGF0YSwgdGhpcykpO1xufTtcblxubGV0IFdlYXRoZXIgPSBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ3dlYXRoZXItbm93Jywge3Byb3RvdHlwZTogd2VhdGhlclByb3RvIH0pO1xuIl19
