(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var currDoc = document.currentScript.ownerDocument,

//Maps to pleasant icons for weather status.
iconBase = '//uxrepo.com/static/icon-sets/meteo/svg/',
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvdnMtdm90ZS9wdWJsaWMvY29tcG9uZW50cy93ZWF0aGVyLW5vdy93ZWF0aGVyLW5vdy1zYW5zLWltcG9ydHMtc2hhZG93RE9NLmVzNiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxhQUFhOzs7QUFHOUMsUUFBUSw2Q0FBNkM7SUFDckQsVUFBVSxHQUFHO0FBQ1QsU0FBSyxFQUFLLFFBQVEsWUFBUztBQUMzQixRQUFJLEVBQU0sUUFBUSxhQUFVO0FBQzVCLG1CQUFlLEVBQUssUUFBUSxrQkFBZTtBQUMzQyxtQkFBZSxFQUFJLFFBQVEsc0JBQW1CO0FBQzlDLGNBQVUsRUFBSyxRQUFRLGVBQVk7QUFDbkMsU0FBSyxFQUFLLFFBQVEsY0FBVztDQUNoQzs7O0FBR0QsR0FBRyxHQUFHLFNBQU4sR0FBRyxDQUFJLEdBQUcsRUFBRSxJQUFJO1dBQUssRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0NBQUE7SUFFOUQsVUFBVSxHQUFHLFNBQWIsVUFBVSxDQUFHLElBQUk7V0FBSSxVQUFBLElBQUk7ZUFBSSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUk7S0FBQTtDQUFBO0lBRXBELFNBQVMsR0FBRyxTQUFaLFNBQVMsQ0FBRyxHQUFHO1dBQUksVUFBQSxJQUFJO2VBQUksSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHO0tBQUE7Q0FBQTs7O0FBR3pDLE1BQU0sR0FBRyxTQUFULE1BQU0sQ0FBSSxJQUFJLEVBQUUsSUFBSSxFQUFLOztBQUVyQixPQUFHLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGdC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SCxXQUFHLEVBQUEsZUFBRztBQUFFLG1CQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7U0FBRTtBQUMxRCxXQUFHLEVBQUEsYUFBQyxHQUFHLEVBQUU7QUFBRSxnQkFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7U0FBRTtLQUM5RDtDQUNKLENBQUMsQ0FBQzs7QUFFUCxZQUFZLENBQUMsZUFBZSxHQUFHLFlBQVk7OztBQUN2QyxRQUFJLFFBQVEsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDOztBQUVuQyxjQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFFLFVBQUEsSUFBSSxFQUFJOzs7QUFHaEQsY0FBTSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQzs7O0FBR3ZCLGNBQUssV0FBVyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7S0FDekQsQ0FBQyxDQUFDO0NBQ04sQ0FBQTs7QUFFRCxZQUFZLENBQUMsd0JBQXdCLEdBQUcsVUFBVSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTs7O0FBQ2hFLGNBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxJQUFJO2VBQUksTUFBTSxDQUFDLElBQUksU0FBTztLQUFBLENBQUMsQ0FBQztDQUMxRSxDQUFDOztBQUVGLElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFLEVBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibGV0IGN1cnJEb2MgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0Lm93bmVyRG9jdW1lbnQsXG5cbiAgICAvL01hcHMgdG8gcGxlYXNhbnQgaWNvbnMgZm9yIHdlYXRoZXIgc3RhdHVzLlxuICAgIGljb25CYXNlID0gYC8vdXhyZXBvLmNvbS9zdGF0aWMvaWNvbi1zZXRzL21ldGVvL3N2Zy9gLFxuICAgIHdlYXRoZXJNYXAgPSB7XG4gICAgICAgIGNsZWFyOiBgJHtpY29uQmFzZX1zdW4uc3ZnYCxcbiAgICAgICAgcmFpbjogIGAke2ljb25CYXNlfXJhaW4uc3ZnYCxcbiAgICAgICAgJ3BhcnRseSBjbG91ZHknOiBgJHtpY29uQmFzZX1jbG91ZC1zdW4uc3ZnYCxcbiAgICAgICAgJ21vc3RseSBjbG91ZHknOmAke2ljb25CYXNlfWNsb3VkLXN1bi1pbnYuc3ZnYCxcbiAgICAgICAgJ292ZXJjYXN0JzogYCR7aWNvbkJhc2V9Y2xvdWRzLnN2Z2AsXG4gICAgICAgIHdpbmR5OiBgJHtpY29uQmFzZX13aW5keS5zdmdgXG4gICAgfSxcblxuICAgIC8vdXRpbGl0aWVzIHRvIHdvcmsgcXVjaWtlciBvbiBub2RlTGlzdHNcbiAgICBxc2EgPSAoc2VsLCByb290KSA9PiBbXS5zbGljZS5jYWxsKHJvb3QucXVlcnlTZWxlY3RvckFsbChzZWwpKSxcblxuICAgIHRleHRNYXBwZXIgPSB0ZXh0ID0+IG5vZGUgPT4gbm9kZS50ZXh0Q29udGVudCA9IHRleHQsXG5cbiAgICBzcmNNYXBwZXIgPSB1cmwgPT4gbm9kZSA9PiBub2RlLnNyYyA9IHVybCxcblxuICAgIC8vIHVwZGF0ZXMgdGhlIERPTSB3aXRoIHRoZSBpbmZvcm1hdGlvbiBwYXNzZWQgaW4uXG4gICAgcmVuZGVyID0gKGRhdGEsIGZyYWcpID0+IHtcblxuICAgICAgICBxc2EoJy5sb2NhdGlvbicsIGZyYWcpLm1hcCh0ZXh0TWFwcGVyKGRhdGEuZGlzcGxheV9sb2NhdGlvbi5mdWxsKSk7XG5cbiAgICAgICAgcXNhKCcuaWNvbiBpbWcnLCBmcmFnKS5tYXAoc3JjTWFwcGVyKHdlYXRoZXJNYXBbZGF0YS53ZWF0aGVyLnRvTG93ZXJDYXNlKCldIHx8IGRhdGEuaW1hZ2UudXJsKSk7XG5cbiAgICAgICAgcXNhKCcud2VhdGhlci1kZXNjcmlwdGlvbicsIGZyYWcpLm1hcCh0ZXh0TWFwcGVyKGRhdGEud2VhdGhlcikpO1xuXG4gICAgICAgIHFzYSgnLndpbmQnLCBmcmFnKS5tYXAodGV4dE1hcHBlcihkYXRhLndpbmRfc3RyaW5nKSk7XG5cbiAgICAgICAgLy93ZSBzZXQgdGVtcCB0byB0aGUgbnVtYmVyIG9mIGRlZ3JlZXMgaW4gdGhlIHByZWZlcnJlZCB1bml0IGJlZm9yZVxuICAgICAgICAvL2dldHRpbmcgdG8gcmVuZGVyIGFzIHdlIHdvbid0IGhhdmUgdGhhdCBjb250ZXh0IHdpdGhpbiByZW5kZXJcbiAgICAgICAgcXNhKCcuZGVncycsIGZyYWcpLm1hcCh0ZXh0TWFwcGVyKGRhdGEudGVtcCkpO1xuICAgICAgICBxc2EoJy51bml0JywgZnJhZykubWFwKHRleHRNYXBwZXIoZGF0YS51bml0cykpO1xuICAgIH0sXG5cbiAgICBnZXRXZWF0aGVyID0gKGxvY2F0aW9uLCB1bml0cykgPT4ge1xuICAgICAgICB2YXIgbG9jID0gbG9jYXRpb24uc3BsaXQoLyxcXHMqLykubWFwKCBpdGVtID0+IGl0ZW0ucmVwbGFjZSgnICcsICdfJykpO1xuICAgICAgICByZXR1cm4gZmV0Y2goYC8vYXBpLnd1bmRlcmdyb3VuZC5jb20vYXBpLzQyZGIzYzM2MGJhYmU0ZTUvY29uZGl0aW9ucy9xLyR7bG9jWzFdfS8ke2xvY1swXX0uanNvbmApLnRoZW4ocmVzcCA9PiByZXNwLmpzb24oKSkudGhlbiggZGF0YSA9PiB7XG4gICAgICAgICAgICBkYXRhID0gZGF0YS5jdXJyZW50X29ic2VydmF0aW9uO1xuXG4gICAgICAgICAgICBpZiAoICFkYXRhICkge1xuICAgICAgICAgICAgICAgIGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXlfbG9jYXRpb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGw6IGBDb3VsZCBub3QgZmluZCB3ZWF0aGVyIGluZm9ybWF0aW9uIGZvciAke2xvY2F0aW9ufWBcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgdGVtcF9mOiAnPycsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBfYzogJz8nLFxuICAgICAgICAgICAgICAgICAgICB3ZWF0aGVyOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2U6IHsgdXJsOiAnJyB9LFxuICAgICAgICAgICAgICAgICAgICB3aW5kX3N0cmluZzogJydcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkYXRhLnRlbXAgPSAodW5pdHMgPT09ICdmJykgPyBkYXRhLnRlbXBfZiA6IGRhdGEudGVtcF9jO1xuICAgICAgICAgICAgZGF0YS51bml0cyA9IHVuaXRzLnRvVXBwZXJDYXNlKCk7XG5cbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgdGVtcGxhdGVTdHIgPSAoKCkgPT4ge1xuICAgICAgICBsZXQgdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gICAgICAgIHQuaW5uZXJIVE1MID0gYFxuICAgICAgICA8c3R5bGU+XG4gICAgICAgICAgICBmaWd1cmUge1xuICAgICAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICAgICAgZm9udC1mYW1pbHk6IHNhbnMtc2VyaWY7XG4gICAgICAgICAgICAgICAgZmxleC1mbG93OiByb3cgd3JhcDtcbiAgICAgICAgICAgICAgICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcbiAgICAgICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAuaWNvbiwgZmlnY2FwdGlvbiB7XG4gICAgICAgICAgICAgICAgZmxleDogMCAwIDQ4JTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGltZyB7XG4gICAgICAgICAgICAgICAgbWF4LXdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLnRlbXAge1xuICAgICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xuICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMmVtO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLmRlZ3M6OmFmdGVyIHtcbiAgICAgICAgICAgICAgICBjb250ZW50OiAnXFxcXDAwQjAnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLndpbmQ6OmJlZm9yZSB7XG4gICAgICAgICAgICAgICAgY29udGVudDogJ1dpbmQ6ICdcbiAgICAgICAgICAgIH1cbiAgICAgICAgPC9zdHlsZT5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3M9XCJ3ZWF0aGVyLWJsb2NrXCI+XG4gICAgICAgICAgICA8aDEgY2xhc3M9XCJ0aXRsZVwiPldlYXRoZXIgZm9yIDxzcGFuIGNsYXNzPVwibG9jYXRpb25cIj5Tb3V0aCBKb3JkYW4sIFVUPC9zcGFuPjwvaDE+XG4gICAgICAgICAgICA8ZmlndXJlPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpY29uXCI+XG4gICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiLy91eHJlcG8uY29tL3N0YXRpYy9pY29uLXNldHMvbWV0ZW8vc3ZnL3JhaW4uc3ZnXCIvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxmaWdjYXB0aW9uPlxuICAgICAgICAgICAgICAgICAgICA8cCBjbGFzcz1cInRlbXBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZGVnc1wiPjY4PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ1bml0XCI+Rjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgICAgICA8cCBjbGFzcz1cIndlYXRoZXItZGVzY3JpcHRpb25cIj5SYWlueTwvcD5cbiAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJ3aW5kXCI+RnJvbSB0aGUgTk5XIGF0IDIyLjAgTVBIIEd1c3RpbmcgdG8gMjguMCBNUEg8L3A+XG4gICAgICAgICAgICAgICAgPC9maWdjYXB0aW9uPlxuICAgICAgICAgICAgPC9maWd1cmU+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgYDtcbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfSkoKSxcblxuICAgIHdlYXRoZXJQcm90byA9IE9iamVjdC5jcmVhdGUoSFRNTEVsZW1lbnQucHJvdG90eXBlLCB7XG4gICAgICAgIGxvY2F0aW9uOiB7XG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZSgnbG9jYXRpb24nKS50b0xvd2VyQ2FzZSgpOyB9LFxuICAgICAgICAgICAgc2V0KHZhbCkgeyB0aGlzLnNldEF0dHJpYnV0ZSgnbG9jYXRpb24nLCB2YWwudG9Mb3dlckNhc2UoKSk7IH1cbiAgICAgICAgfSxcbiAgICAgICAgdW5pdHM6IHtcbiAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKCd1bml0cycpLnRvTG93ZXJDYXNlKCk7IH0sXG4gICAgICAgICAgICBzZXQodmFsKSB7IHRoaXMuc2V0QXR0cmlidXRlKCd1bml0cycsIHZhbC50b0xvd2VyQ2FzZSgpKTsgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbndlYXRoZXJQcm90by5jcmVhdGVkQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IHRlbXBsYXRlID0gdGVtcGxhdGVTdHIuY29udGVudDtcblxuICAgIGdldFdlYXRoZXIodGhpcy5sb2NhdGlvbiwgdGhpcy51bml0cykudGhlbiggZGF0YSA9PiB7XG5cbiAgICAgICAgLy9cInJlbmRlclwiIHRoZSBkYXRhIGludG8gdGhlIHRlbXBsYXRlXG4gICAgICAgIHJlbmRlcihkYXRhLCB0ZW1wbGF0ZSk7XG5cbiAgICAgICAgLy9hdHRhY2ggdGhlIHRlbXBsYXRlIGZyYWdtZW50IHRvIHRoZSBzaGFkb3cgcm9vdCBvbmNlIHJlbmRlcmVkXG4gICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZSwgdHJ1ZSkpO1xuICAgIH0pO1xufVxuXG53ZWF0aGVyUHJvdG8uYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrID0gZnVuY3Rpb24gKGF0dHIsIHByZXYsIGN1cnIpIHtcbiAgICBnZXRXZWF0aGVyKHRoaXMubG9jYXRpb24sIHRoaXMudW5pdHMpLnRoZW4oZGF0YSA9PiByZW5kZXIoZGF0YSwgdGhpcykpO1xufTtcblxubGV0IFdlYXRoZXIgPSBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ3dlYXRoZXItbm93Jywge3Byb3RvdHlwZTogd2VhdGhlclByb3RvIH0pO1xuIl19
