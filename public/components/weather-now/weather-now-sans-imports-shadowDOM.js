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
    var _this = this;

    var template = templateStr.content;

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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvdnMtdm90ZS9wdWJsaWMvY29tcG9uZW50cy93ZWF0aGVyLW5vdy93ZWF0aGVyLW5vdy1zYW5zLWltcG9ydHMtc2hhZG93RE9NLmVzNiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxhQUFhOzs7QUFHOUMsUUFBUSxVQUFVO0lBQ2xCLFVBQVUsR0FBRztBQUNULFNBQUssRUFBSyxRQUFRLFlBQVM7QUFDM0IsUUFBSSxFQUFNLFFBQVEsYUFBVTtBQUM1QixtQkFBZSxFQUFLLFFBQVEsa0JBQWU7QUFDM0MsbUJBQWUsRUFBSSxRQUFRLHNCQUFtQjtBQUM5QyxjQUFVLEVBQUssUUFBUSxlQUFZO0FBQ25DLFNBQUssRUFBSyxRQUFRLGNBQVc7Q0FDaEM7OztBQUdELEdBQUcsR0FBRyxTQUFOLEdBQUcsQ0FBSSxHQUFHLEVBQUUsSUFBSTtXQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztDQUFBO0lBRTlELFVBQVUsR0FBRyxTQUFiLFVBQVUsQ0FBRyxJQUFJO1dBQUksVUFBQSxJQUFJO2VBQUksSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJO0tBQUE7Q0FBQTtJQUVwRCxTQUFTLEdBQUcsU0FBWixTQUFTLENBQUcsR0FBRztXQUFJLFVBQUEsSUFBSTtlQUFJLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRztLQUFBO0NBQUE7OztBQUd6QyxNQUFNLEdBQUcsU0FBVCxNQUFNLENBQUksSUFBSSxFQUFFLElBQUksRUFBSzs7QUFFckIsT0FBRyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxnQkFB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V0FBRyxFQUFBLGVBQUc7QUFBRSxtQkFBTyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQUU7QUFDMUQsV0FBRyxFQUFBLGFBQUMsR0FBRyxFQUFFO0FBQUUsZ0JBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO1NBQUU7S0FDOUQ7Q0FDSixDQUFDLENBQUM7O0FBRVAsWUFBWSxDQUFDLGVBQWUsR0FBRyxZQUFZOzs7QUFDdkMsUUFBSSxRQUFRLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQzs7QUFFbkMsY0FBVSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBRSxVQUFBLElBQUksRUFBSTs7O0FBR2hELGNBQU0sQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7OztBQUd2QixjQUFLLFdBQVcsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0tBQ3pELENBQUMsQ0FBQztDQUNOLENBQUE7O0FBRUQsWUFBWSxDQUFDLHdCQUF3QixHQUFHLFVBQVUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUU7OztBQUNoRSxjQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsSUFBSTtlQUFJLE1BQU0sQ0FBQyxJQUFJLFNBQU87S0FBQSxDQUFDLENBQUM7Q0FDMUUsQ0FBQzs7QUFFRixJQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxFQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImxldCBjdXJyRG9jID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5vd25lckRvY3VtZW50LFxuXG4gICAgLy9NYXBzIHRvIHBsZWFzYW50IGljb25zIGZvciB3ZWF0aGVyIHN0YXR1cy5cbiAgICBpY29uQmFzZSA9IGAvaW1nL2AsXG4gICAgd2VhdGhlck1hcCA9IHtcbiAgICAgICAgY2xlYXI6IGAke2ljb25CYXNlfXN1bi5zdmdgLFxuICAgICAgICByYWluOiAgYCR7aWNvbkJhc2V9cmFpbi5zdmdgLFxuICAgICAgICAncGFydGx5IGNsb3VkeSc6IGAke2ljb25CYXNlfWNsb3VkLXN1bi5zdmdgLFxuICAgICAgICAnbW9zdGx5IGNsb3VkeSc6YCR7aWNvbkJhc2V9Y2xvdWQtc3VuLWludi5zdmdgLFxuICAgICAgICAnb3ZlcmNhc3QnOiBgJHtpY29uQmFzZX1jbG91ZHMuc3ZnYCxcbiAgICAgICAgd2luZHk6IGAke2ljb25CYXNlfXdpbmR5LnN2Z2BcbiAgICB9LFxuXG4gICAgLy91dGlsaXRpZXMgdG8gd29yayBxdWNpa2VyIG9uIG5vZGVMaXN0c1xuICAgIHFzYSA9IChzZWwsIHJvb3QpID0+IFtdLnNsaWNlLmNhbGwocm9vdC5xdWVyeVNlbGVjdG9yQWxsKHNlbCkpLFxuXG4gICAgdGV4dE1hcHBlciA9IHRleHQgPT4gbm9kZSA9PiBub2RlLnRleHRDb250ZW50ID0gdGV4dCxcblxuICAgIHNyY01hcHBlciA9IHVybCA9PiBub2RlID0+IG5vZGUuc3JjID0gdXJsLFxuXG4gICAgLy8gdXBkYXRlcyB0aGUgRE9NIHdpdGggdGhlIGluZm9ybWF0aW9uIHBhc3NlZCBpbi5cbiAgICByZW5kZXIgPSAoZGF0YSwgZnJhZykgPT4ge1xuXG4gICAgICAgIHFzYSgnLmxvY2F0aW9uJywgZnJhZykubWFwKHRleHRNYXBwZXIoZGF0YS5kaXNwbGF5X2xvY2F0aW9uLmZ1bGwpKTtcblxuICAgICAgICBxc2EoJy5pY29uIGltZycsIGZyYWcpLm1hcChzcmNNYXBwZXIod2VhdGhlck1hcFtkYXRhLndlYXRoZXIudG9Mb3dlckNhc2UoKV0gfHwgZGF0YS5pbWFnZS51cmwpKTtcblxuICAgICAgICBxc2EoJy53ZWF0aGVyLWRlc2NyaXB0aW9uJywgZnJhZykubWFwKHRleHRNYXBwZXIoZGF0YS53ZWF0aGVyKSk7XG5cbiAgICAgICAgcXNhKCcud2luZCcsIGZyYWcpLm1hcCh0ZXh0TWFwcGVyKGRhdGEud2luZF9zdHJpbmcpKTtcblxuICAgICAgICAvL3dlIHNldCB0ZW1wIHRvIHRoZSBudW1iZXIgb2YgZGVncmVlcyBpbiB0aGUgcHJlZmVycmVkIHVuaXQgYmVmb3JlXG4gICAgICAgIC8vZ2V0dGluZyB0byByZW5kZXIgYXMgd2Ugd29uJ3QgaGF2ZSB0aGF0IGNvbnRleHQgd2l0aGluIHJlbmRlclxuICAgICAgICBxc2EoJy5kZWdzJywgZnJhZykubWFwKHRleHRNYXBwZXIoZGF0YS50ZW1wKSk7XG4gICAgICAgIHFzYSgnLnVuaXQnLCBmcmFnKS5tYXAodGV4dE1hcHBlcihkYXRhLnVuaXRzKSk7XG4gICAgfSxcblxuICAgIGdldFdlYXRoZXIgPSAobG9jYXRpb24sIHVuaXRzKSA9PiB7XG4gICAgICAgIHZhciBsb2MgPSBsb2NhdGlvbi5zcGxpdCgvLFxccyovKS5tYXAoIGl0ZW0gPT4gaXRlbS5yZXBsYWNlKCcgJywgJ18nKSk7XG4gICAgICAgIHJldHVybiBmZXRjaChgLy9hcGkud3VuZGVyZ3JvdW5kLmNvbS9hcGkvNDJkYjNjMzYwYmFiZTRlNS9jb25kaXRpb25zL3EvJHtsb2NbMV19LyR7bG9jWzBdfS5qc29uYCkudGhlbihyZXNwID0+IHJlc3AuanNvbigpKS50aGVuKCBkYXRhID0+IHtcbiAgICAgICAgICAgIGRhdGEgPSBkYXRhLmN1cnJlbnRfb2JzZXJ2YXRpb247XG5cbiAgICAgICAgICAgIGlmICggIWRhdGEgKSB7XG4gICAgICAgICAgICAgICAgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheV9sb2NhdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgZnVsbDogYENvdWxkIG5vdCBmaW5kIHdlYXRoZXIgaW5mb3JtYXRpb24gZm9yICR7bG9jYXRpb259YFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB0ZW1wX2Y6ICc/JyxcbiAgICAgICAgICAgICAgICAgICAgdGVtcF9jOiAnPycsXG4gICAgICAgICAgICAgICAgICAgIHdlYXRoZXI6ICcnLFxuICAgICAgICAgICAgICAgICAgICBpbWFnZTogeyB1cmw6ICcnIH0sXG4gICAgICAgICAgICAgICAgICAgIHdpbmRfc3RyaW5nOiAnJ1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRhdGEudGVtcCA9ICh1bml0cyA9PT0gJ2YnKSA/IGRhdGEudGVtcF9mIDogZGF0YS50ZW1wX2M7XG4gICAgICAgICAgICBkYXRhLnVuaXRzID0gdW5pdHMudG9VcHBlckNhc2UoKTtcblxuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICB0ZW1wbGF0ZVN0ciA9ICgoKSA9PiB7XG4gICAgICAgIGxldCB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgICAgICAgdC5pbm5lckhUTUwgPSBgXG4gICAgICAgIDxzdHlsZT5cbiAgICAgICAgICAgIGZpZ3VyZSB7XG4gICAgICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgICAgICBmb250LWZhbWlseTogc2Fucy1zZXJpZjtcbiAgICAgICAgICAgICAgICBmbGV4LWZsb3c6IHJvdyB3cmFwO1xuICAgICAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xuICAgICAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC5pY29uLCBmaWdjYXB0aW9uIHtcbiAgICAgICAgICAgICAgICBmbGV4OiAwIDAgNDglO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaW1nIHtcbiAgICAgICAgICAgICAgICBtYXgtd2lkdGg6IDEwMCU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAudGVtcCB7XG4gICAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gICAgICAgICAgICAgICAgZm9udC1zaXplOiAyZW07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAuZGVnczo6YWZ0ZXIge1xuICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICdcXFxcMDBCMCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAud2luZDo6YmVmb3JlIHtcbiAgICAgICAgICAgICAgICBjb250ZW50OiAnV2luZDogJ1xuICAgICAgICAgICAgfVxuICAgICAgICA8L3N0eWxlPlxuICAgICAgICA8c2VjdGlvbiBjbGFzcz1cIndlYXRoZXItYmxvY2tcIj5cbiAgICAgICAgICAgIDxoMSBjbGFzcz1cInRpdGxlXCI+V2VhdGhlciBmb3IgPHNwYW4gY2xhc3M9XCJsb2NhdGlvblwiPlNvdXRoIEpvcmRhbiwgVVQ8L3NwYW4+PC9oMT5cbiAgICAgICAgICAgIDxmaWd1cmU+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImljb25cIj5cbiAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9XCIvL3V4cmVwby5jb20vc3RhdGljL2ljb24tc2V0cy9tZXRlby9zdmcvcmFpbi5zdmdcIi8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGZpZ2NhcHRpb24+XG4gICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwidGVtcFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkZWdzXCI+Njg8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInVuaXRcIj5GPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwid2VhdGhlci1kZXNjcmlwdGlvblwiPlJhaW55PC9wPlxuICAgICAgICAgICAgICAgICAgICA8cCBjbGFzcz1cIndpbmRcIj5Gcm9tIHRoZSBOTlcgYXQgMjIuMCBNUEggR3VzdGluZyB0byAyOC4wIE1QSDwvcD5cbiAgICAgICAgICAgICAgICA8L2ZpZ2NhcHRpb24+XG4gICAgICAgICAgICA8L2ZpZ3VyZT5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICBgO1xuICAgICAgICByZXR1cm4gdDtcbiAgICB9KSgpLFxuXG4gICAgd2VhdGhlclByb3RvID0gT2JqZWN0LmNyZWF0ZShIVE1MRWxlbWVudC5wcm90b3R5cGUsIHtcbiAgICAgICAgbG9jYXRpb246IHtcbiAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKCdsb2NhdGlvbicpLnRvTG93ZXJDYXNlKCk7IH0sXG4gICAgICAgICAgICBzZXQodmFsKSB7IHRoaXMuc2V0QXR0cmlidXRlKCdsb2NhdGlvbicsIHZhbC50b0xvd2VyQ2FzZSgpKTsgfVxuICAgICAgICB9LFxuICAgICAgICB1bml0czoge1xuICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoJ3VuaXRzJykudG9Mb3dlckNhc2UoKTsgfSxcbiAgICAgICAgICAgIHNldCh2YWwpIHsgdGhpcy5zZXRBdHRyaWJ1dGUoJ3VuaXRzJywgdmFsLnRvTG93ZXJDYXNlKCkpOyB9XG4gICAgICAgIH1cbiAgICB9KTtcblxud2VhdGhlclByb3RvLmNyZWF0ZWRDYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgdGVtcGxhdGUgPSB0ZW1wbGF0ZVN0ci5jb250ZW50O1xuXG4gICAgZ2V0V2VhdGhlcih0aGlzLmxvY2F0aW9uLCB0aGlzLnVuaXRzKS50aGVuKCBkYXRhID0+IHtcblxuICAgICAgICAvL1wicmVuZGVyXCIgdGhlIGRhdGEgaW50byB0aGUgdGVtcGxhdGVcbiAgICAgICAgcmVuZGVyKGRhdGEsIHRlbXBsYXRlKTtcblxuICAgICAgICAvL2F0dGFjaCB0aGUgdGVtcGxhdGUgZnJhZ21lbnQgdG8gdGhlIHNoYWRvdyByb290IG9uY2UgcmVuZGVyZWRcbiAgICAgICAgdGhpcy5hcHBlbmRDaGlsZChkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLCB0cnVlKSk7XG4gICAgfSk7XG59XG5cbndlYXRoZXJQcm90by5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sgPSBmdW5jdGlvbiAoYXR0ciwgcHJldiwgY3Vycikge1xuICAgIGdldFdlYXRoZXIodGhpcy5sb2NhdGlvbiwgdGhpcy51bml0cykudGhlbihkYXRhID0+IHJlbmRlcihkYXRhLCB0aGlzKSk7XG59O1xuXG5sZXQgV2VhdGhlciA9IGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnd2VhdGhlci1ub3cnLCB7cHJvdG90eXBlOiB3ZWF0aGVyUHJvdG8gfSk7XG4iXX0=
