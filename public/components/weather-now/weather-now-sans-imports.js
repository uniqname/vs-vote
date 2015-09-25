(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var currDoc = document.currentScript.ownerDocument,

//Maps to pleasant icons for weather status.
iconBase = '/img/',
    weatherMap = {
    clear: iconBase + 'sun.svg',
    rain: iconBase + 'rain.svg',
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

// updates the shadow DOM with the information passed in.
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
    var t = document.createElement('template');
    t.innerHTML = '\n        <style>\n            figure {\n                display: flex;\n                font-family: sans-serif;\n                flex-flow: row wrap;\n                align-items: flex-start;\n                justify-content: space-between;\n            }\n            .icon, figcaption {\n                flex: 0 0 48%;\n            }\n            img {\n                max-width: 100%;\n            }\n            .temp {\n                font-weight: bold;\n                font-size: 2em;\n            }\n            .degs::after {\n                content: \'\\00B0\';\n            }\n            .wind::before {\n                content: \'Wind: \'\n            }\n        </style>\n        <section class="weather-block">\n            <h1 class="title">Weather for <span class="location">South Jordan, UT</span></h1>\n            <figure>\n                <div class="icon">\n                    <img src="//uxrepo.com/static/icon-sets/meteo/svg/rain.svg"/>\n                </div>\n                <figcaption>\n                    <p class="temp">\n                        <span class="degs">68</span>\n                        <span class="unit">F</span>\n                    </p>\n                    <p class="weather-description">Rainy</p>\n                    <p class="wind">From the NNW at 22.0 MPH Gusting to 28.0 MPH</p>\n                </figcaption>\n            </figure>\n        </section>\n        ';
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
    var template = templateStr.content,
        shadowRoot = this.createShadowRoot();

    getWeather(this.location, this.units).then(function (data) {

        //"render" the data into the template
        render(data, template);

        //attach the template fragment to the shadow root once rendered
        shadowRoot.appendChild(document.importNode(template, true));
    });
};

weatherProto.attributeChangedCallback = function (attr, prev, curr) {
    var _this = this;

    getWeather(this.location, this.units).then(function (data) {
        return render(data, _this.shadowRoot);
    });
};

var Weather = document.registerElement('weather-now', { prototype: weatherProto });

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvdnMtdm90ZS9wdWJsaWMvY29tcG9uZW50cy93ZWF0aGVyLW5vdy93ZWF0aGVyLW5vdy1zYW5zLWltcG9ydHMuZXM2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxJQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLGFBQWE7OztBQUc5QyxRQUFRLFVBQVU7SUFDbEIsVUFBVSxHQUFHO0FBQ1QsU0FBSyxFQUFLLFFBQVEsWUFBUztBQUMzQixRQUFJLEVBQU0sUUFBUSxhQUFVO0FBQzVCLG1CQUFlLEVBQUssUUFBUSxrQkFBZTtBQUMzQyxtQkFBZSxFQUFJLFFBQVEsc0JBQW1CO0FBQzlDLGNBQVUsRUFBSyxRQUFRLGVBQVk7QUFDbkMsU0FBSyxFQUFLLFFBQVEsY0FBVztDQUNoQzs7O0FBR0QsR0FBRyxHQUFHLFNBQU4sR0FBRyxDQUFJLEdBQUcsRUFBRSxJQUFJO1dBQUssRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0NBQUE7SUFFOUQsVUFBVSxHQUFHLFNBQWIsVUFBVSxDQUFHLElBQUk7V0FBSSxVQUFBLElBQUk7ZUFBSSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUk7S0FBQTtDQUFBO0lBRXBELFNBQVMsR0FBRyxTQUFaLFNBQVMsQ0FBRyxHQUFHO1dBQUksVUFBQSxJQUFJO2VBQUksSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHO0tBQUE7Q0FBQTs7O0FBR3pDLE1BQU0sR0FBRyxTQUFULE1BQU0sQ0FBSSxJQUFJLEVBQUUsSUFBSSxFQUFLOztBQUVyQixPQUFHLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElB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dGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibGV0IGN1cnJEb2MgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0Lm93bmVyRG9jdW1lbnQsXG5cbiAgICAvL01hcHMgdG8gcGxlYXNhbnQgaWNvbnMgZm9yIHdlYXRoZXIgc3RhdHVzLlxuICAgIGljb25CYXNlID0gYC9pbWcvYCxcbiAgICB3ZWF0aGVyTWFwID0ge1xuICAgICAgICBjbGVhcjogYCR7aWNvbkJhc2V9c3VuLnN2Z2AsXG4gICAgICAgIHJhaW46ICBgJHtpY29uQmFzZX1yYWluLnN2Z2AsXG4gICAgICAgICdwYXJ0bHkgY2xvdWR5JzogYCR7aWNvbkJhc2V9Y2xvdWQtc3VuLnN2Z2AsXG4gICAgICAgICdtb3N0bHkgY2xvdWR5JzpgJHtpY29uQmFzZX1jbG91ZC1zdW4taW52LnN2Z2AsXG4gICAgICAgICdvdmVyY2FzdCc6IGAke2ljb25CYXNlfWNsb3Vkcy5zdmdgLFxuICAgICAgICB3aW5keTogYCR7aWNvbkJhc2V9d2luZHkuc3ZnYFxuICAgIH0sXG5cbiAgICAvL3V0aWxpdGllcyB0byB3b3JrIHF1Y2lrZXIgb24gbm9kZUxpc3RzXG4gICAgcXNhID0gKHNlbCwgcm9vdCkgPT4gW10uc2xpY2UuY2FsbChyb290LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsKSksXG5cbiAgICB0ZXh0TWFwcGVyID0gdGV4dCA9PiBub2RlID0+IG5vZGUudGV4dENvbnRlbnQgPSB0ZXh0LFxuXG4gICAgc3JjTWFwcGVyID0gdXJsID0+IG5vZGUgPT4gbm9kZS5zcmMgPSB1cmwsXG5cbiAgICAvLyB1cGRhdGVzIHRoZSBzaGFkb3cgRE9NIHdpdGggdGhlIGluZm9ybWF0aW9uIHBhc3NlZCBpbi5cbiAgICByZW5kZXIgPSAoZGF0YSwgZnJhZykgPT4ge1xuXG4gICAgICAgIHFzYSgnLmxvY2F0aW9uJywgZnJhZykubWFwKHRleHRNYXBwZXIoZGF0YS5kaXNwbGF5X2xvY2F0aW9uLmZ1bGwpKTtcblxuICAgICAgICBxc2EoJy5pY29uIGltZycsIGZyYWcpLm1hcChzcmNNYXBwZXIod2VhdGhlck1hcFtkYXRhLndlYXRoZXIudG9Mb3dlckNhc2UoKV0gfHwgZGF0YS5pbWFnZS51cmwpKTtcblxuICAgICAgICBxc2EoJy53ZWF0aGVyLWRlc2NyaXB0aW9uJywgZnJhZykubWFwKHRleHRNYXBwZXIoZGF0YS53ZWF0aGVyKSk7XG5cbiAgICAgICAgcXNhKCcud2luZCcsIGZyYWcpLm1hcCh0ZXh0TWFwcGVyKGRhdGEud2luZF9zdHJpbmcpKTtcblxuICAgICAgICAvL3dlIHNldCB0ZW1wIHRvIHRoZSBudW1iZXIgb2YgZGVncmVlcyBpbiB0aGUgcHJlZmVycmVkIHVuaXQgYmVmb3JlXG4gICAgICAgIC8vZ2V0dGluZyB0byByZW5kZXIgYXMgd2Ugd29uJ3QgaGF2ZSB0aGF0IGNvbnRleHQgd2l0aGluIHJlbmRlclxuICAgICAgICBxc2EoJy5kZWdzJywgZnJhZykubWFwKHRleHRNYXBwZXIoZGF0YS50ZW1wKSk7XG4gICAgICAgIHFzYSgnLnVuaXQnLCBmcmFnKS5tYXAodGV4dE1hcHBlcihkYXRhLnVuaXRzKSk7XG4gICAgfSxcblxuICAgIGdldFdlYXRoZXIgPSAobG9jYXRpb24sIHVuaXRzKSA9PiB7XG4gICAgICAgIHZhciBsb2MgPSBsb2NhdGlvbi5zcGxpdCgvLFxccyovKS5tYXAoIGl0ZW0gPT4gaXRlbS5yZXBsYWNlKCcgJywgJ18nKSk7XG4gICAgICAgIHJldHVybiBmZXRjaChgLy9hcGkud3VuZGVyZ3JvdW5kLmNvbS9hcGkvNDJkYjNjMzYwYmFiZTRlNS9jb25kaXRpb25zL3EvJHtsb2NbMV19LyR7bG9jWzBdfS5qc29uYCkudGhlbihyZXNwID0+IHJlc3AuanNvbigpKS50aGVuKCBkYXRhID0+IHtcbiAgICAgICAgICAgIGRhdGEgPSBkYXRhLmN1cnJlbnRfb2JzZXJ2YXRpb247XG5cbiAgICAgICAgICAgIGlmICggIWRhdGEgKSB7XG4gICAgICAgICAgICAgICAgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheV9sb2NhdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgZnVsbDogYENvdWxkIG5vdCBmaW5kIHdlYXRoZXIgaW5mb3JtYXRpb24gZm9yICR7bG9jYXRpb259YFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB0ZW1wX2Y6ICc/JyxcbiAgICAgICAgICAgICAgICAgICAgdGVtcF9jOiAnPycsXG4gICAgICAgICAgICAgICAgICAgIHdlYXRoZXI6ICcnLFxuICAgICAgICAgICAgICAgICAgICBpbWFnZTogeyB1cmw6ICcnIH0sXG4gICAgICAgICAgICAgICAgICAgIHdpbmRfc3RyaW5nOiAnJ1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRhdGEudGVtcCA9ICh1bml0cyA9PT0gJ2YnKSA/IGRhdGEudGVtcF9mIDogZGF0YS50ZW1wX2M7XG4gICAgICAgICAgICBkYXRhLnVuaXRzID0gdW5pdHMudG9VcHBlckNhc2UoKTtcblxuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICB0ZW1wbGF0ZVN0ciA9ICgoKSA9PiB7XG4gICAgICAgIGxldCB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgICAgICAgdC5pbm5lckhUTUwgPSBgXG4gICAgICAgIDxzdHlsZT5cbiAgICAgICAgICAgIGZpZ3VyZSB7XG4gICAgICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgICAgICBmb250LWZhbWlseTogc2Fucy1zZXJpZjtcbiAgICAgICAgICAgICAgICBmbGV4LWZsb3c6IHJvdyB3cmFwO1xuICAgICAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xuICAgICAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC5pY29uLCBmaWdjYXB0aW9uIHtcbiAgICAgICAgICAgICAgICBmbGV4OiAwIDAgNDglO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaW1nIHtcbiAgICAgICAgICAgICAgICBtYXgtd2lkdGg6IDEwMCU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAudGVtcCB7XG4gICAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gICAgICAgICAgICAgICAgZm9udC1zaXplOiAyZW07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAuZGVnczo6YWZ0ZXIge1xuICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICdcXFxcMDBCMCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAud2luZDo6YmVmb3JlIHtcbiAgICAgICAgICAgICAgICBjb250ZW50OiAnV2luZDogJ1xuICAgICAgICAgICAgfVxuICAgICAgICA8L3N0eWxlPlxuICAgICAgICA8c2VjdGlvbiBjbGFzcz1cIndlYXRoZXItYmxvY2tcIj5cbiAgICAgICAgICAgIDxoMSBjbGFzcz1cInRpdGxlXCI+V2VhdGhlciBmb3IgPHNwYW4gY2xhc3M9XCJsb2NhdGlvblwiPlNvdXRoIEpvcmRhbiwgVVQ8L3NwYW4+PC9oMT5cbiAgICAgICAgICAgIDxmaWd1cmU+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImljb25cIj5cbiAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9XCIvL3V4cmVwby5jb20vc3RhdGljL2ljb24tc2V0cy9tZXRlby9zdmcvcmFpbi5zdmdcIi8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGZpZ2NhcHRpb24+XG4gICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwidGVtcFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkZWdzXCI+Njg8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInVuaXRcIj5GPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwid2VhdGhlci1kZXNjcmlwdGlvblwiPlJhaW55PC9wPlxuICAgICAgICAgICAgICAgICAgICA8cCBjbGFzcz1cIndpbmRcIj5Gcm9tIHRoZSBOTlcgYXQgMjIuMCBNUEggR3VzdGluZyB0byAyOC4wIE1QSDwvcD5cbiAgICAgICAgICAgICAgICA8L2ZpZ2NhcHRpb24+XG4gICAgICAgICAgICA8L2ZpZ3VyZT5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICBgO1xuICAgICAgICByZXR1cm4gdDtcbiAgICB9KSgpLFxuXG4gICAgd2VhdGhlclByb3RvID0gT2JqZWN0LmNyZWF0ZShIVE1MRWxlbWVudC5wcm90b3R5cGUsIHtcbiAgICAgICAgbG9jYXRpb246IHtcbiAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKCdsb2NhdGlvbicpLnRvTG93ZXJDYXNlKCk7IH0sXG4gICAgICAgICAgICBzZXQodmFsKSB7IHRoaXMuc2V0QXR0cmlidXRlKCdsb2NhdGlvbicsIHZhbC50b0xvd2VyQ2FzZSgpKTsgfVxuICAgICAgICB9LFxuICAgICAgICB1bml0czoge1xuICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoJ3VuaXRzJykudG9Mb3dlckNhc2UoKTsgfSxcbiAgICAgICAgICAgIHNldCh2YWwpIHsgdGhpcy5zZXRBdHRyaWJ1dGUoJ3VuaXRzJywgdmFsLnRvTG93ZXJDYXNlKCkpOyB9XG4gICAgICAgIH1cbiAgICB9KTtcblxud2VhdGhlclByb3RvLmNyZWF0ZWRDYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgdGVtcGxhdGUgPSB0ZW1wbGF0ZVN0ci5jb250ZW50LFxuICAgICAgICBzaGFkb3dSb290ID0gdGhpcy5jcmVhdGVTaGFkb3dSb290KCk7XG5cbiAgICBnZXRXZWF0aGVyKHRoaXMubG9jYXRpb24sIHRoaXMudW5pdHMpLnRoZW4oIGRhdGEgPT4ge1xuXG4gICAgICAgIC8vXCJyZW5kZXJcIiB0aGUgZGF0YSBpbnRvIHRoZSB0ZW1wbGF0ZVxuICAgICAgICByZW5kZXIoZGF0YSwgdGVtcGxhdGUpO1xuXG4gICAgICAgIC8vYXR0YWNoIHRoZSB0ZW1wbGF0ZSBmcmFnbWVudCB0byB0aGUgc2hhZG93IHJvb3Qgb25jZSByZW5kZXJlZFxuICAgICAgICBzaGFkb3dSb290LmFwcGVuZENoaWxkKGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUsIHRydWUpKTtcbiAgICB9KTtcbn1cblxud2VhdGhlclByb3RvLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayA9IGZ1bmN0aW9uIChhdHRyLCBwcmV2LCBjdXJyKSB7XG4gICAgZ2V0V2VhdGhlcih0aGlzLmxvY2F0aW9uLCB0aGlzLnVuaXRzKS50aGVuKGRhdGEgPT4gcmVuZGVyKGRhdGEsIHRoaXMuc2hhZG93Um9vdCkpO1xufTtcblxubGV0IFdlYXRoZXIgPSBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ3dlYXRoZXItbm93Jywge3Byb3RvdHlwZTogd2VhdGhlclByb3RvIH0pO1xuIl19
