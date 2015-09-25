(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var currDoc = document.currentScript.ownerDocument,

//Maps to pleasant icons for weather status.
iconBase = '/img/',
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
    t.innerHTML = '\n        <style>\n            figure {\n                display: flex;\n                font-family: sans-serif;\n                flex-flow: row wrap;\n                align-items: flex-start;\n                justify-content: space-between;\n            }\n            .icon, figcaption {\n                flex: 0 0 48%;\n            }\n            img {\n                max-width: 100%;\n            }\n            .temp {\n                font-weight: bold;\n                font-size: 2em;\n            }\n            .degs::after {\n                content: \'\\00B0\';\n            }\n            .wind::before {\n                content: \'Wind: \'\n            }\n        </style>\n        <section class="weather-block">\n            <h1 class="title">Weather for <span class="location">South Jordan, UT</span></h1>\n            <figure>\n                <div class="icon">\n                    <img src="/img/rain.svg"/>\n                </div>\n                <figcaption>\n                    <p class="temp">\n                        <span class="degs">68</span>\n                        <span class="unit">F</span>\n                    </p>\n                    <p class="weather-description">Rainy</p>\n                    <p class="wind">From the NNW at 22.0 MPH Gusting to 28.0 MPH</p>\n                </figcaption>\n            </figure>\n        </section>\n        ';

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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvdnMtdm90ZS9wdWJsaWMvY29tcG9uZW50cy93ZWF0aGVyLW5vdy93ZWF0aGVyLW5vdy1zYW5zLWltcG9ydHMtc2hhZG93RE9NLXRlbXBsYXRlcy5lczYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0FDQUEsSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxhQUFhOzs7QUFHOUMsUUFBUSxVQUFVO0lBQ2xCLFVBQVUsR0FBRztBQUNULFNBQUssRUFBSyxRQUFRLFlBQVM7QUFDM0IsUUFBSSxFQUFNLFFBQVEsYUFBVTtBQUM1QixzQkFBa0IsRUFBSyxRQUFRLGtCQUFlO0FBQzlDLG1CQUFlLEVBQUssUUFBUSxrQkFBZTtBQUMzQyxtQkFBZSxFQUFJLFFBQVEsc0JBQW1CO0FBQzlDLGNBQVUsRUFBSyxRQUFRLGVBQVk7QUFDbkMsU0FBSyxFQUFLLFFBQVEsY0FBVztDQUNoQzs7O0FBR0QsR0FBRyxHQUFHLFNBQU4sR0FBRyxDQUFJLEdBQUcsRUFBRSxJQUFJO1dBQUssRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0NBQUE7SUFFOUQsVUFBVSxHQUFHLFNBQWIsVUFBVSxDQUFHLElBQUk7V0FBSSxVQUFBLElBQUk7ZUFBSSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUk7S0FBQTtDQUFBO0lBRXBELFNBQVMsR0FBRyxTQUFaLFNBQVMsQ0FBRyxHQUFHO1dBQUksVUFBQSxJQUFJO2VBQUksSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHO0tBQUE7Q0FBQTs7O0FBR3pDLE1BQU0sR0FBRyxTQUFULE1BQU0sQ0FBSSxJQUFJLEVBQUUsSUFBSSxFQUFLOztBQUVyQixPQUFHLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7O0FBRW5FLE9BQUcsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzs7QUFFaEcsT0FBRyxDQUFDLHNCQUFzQixFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7O0FBRWhFLE9BQUcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQzs7OztBQUlyRCxPQUFHLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDOUMsT0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0NBQ2xEO0lBRUQsVUFBVSxHQUFHLFNBQWIsVUFBVSxDQUFJLFFBQVEsRUFBRSxLQUFLLEVBQUs7QUFDOUIsUUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUUsVUFBQSxJQUFJO2VBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO0tBQUEsQ0FBQyxDQUFDO0FBQ3RFLFdBQU8sS0FBSywrREFBNkQsR0FBRyxDQUFDLENBQUMsQ0FBQyxTQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsV0FBUSxDQUFDLElBQUksQ0FBQyxVQUFBLElBQUk7ZUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO0tBQUEsQ0FBQyxDQUFDLElBQUksQ0FBRSxVQUFBLElBQUksRUFBSTtBQUN0SSxZQUFJLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDOztBQUVoQyxZQUFLLENBQUMsSUFBSSxFQUFHO0FBQ1QsZ0JBQUksR0FBRztBQUNILGdDQUFnQixFQUFFO0FBQ2Qsd0JBQUksOENBQTRDLFFBQVEsQUFBRTtpQkFDN0Q7QUFDRCxzQkFBTSxFQUFFLEdBQUc7QUFDWCxzQkFBTSxFQUFFLEdBQUc7QUFDWCx1QkFBTyxFQUFFLEVBQUU7QUFDWCxxQkFBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRTtBQUNsQiwyQkFBVyxFQUFFLEVBQUU7YUFDbEIsQ0FBQztTQUNMOztBQUVELFlBQUksQ0FBQyxJQUFJLEdBQUcsQUFBQyxLQUFLLEtBQUssR0FBRyxHQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUN4RCxZQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQzs7QUFFakMsZUFBTyxJQUFJLENBQUM7S0FDZixDQUFDLENBQUM7Q0FDTjtJQUVELFdBQVcsR0FBRyxDQUFDLFlBQU07QUFDZCxRQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDcEQsS0FBQyxDQUFDLFNBQVMsazNDQTBDVixDQUFDOztBQUVGLFVBQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLFNBQVMsRUFBRTtBQUNoQyxXQUFHLEVBQUEsZUFBRztBQUNGLG1CQUFPLDZCQUFJLENBQUMsQ0FBQyxRQUFRLEdBQUUsTUFBTSxDQUFDLFVBQUMsSUFBSSxFQUFFLEtBQUssRUFBSztBQUMzQyxvQkFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN4Qix1QkFBTyxJQUFJLENBQUM7YUFDZixFQUFFLFFBQVEsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDLENBQUM7U0FDekM7S0FDSixDQUFDLENBQUM7O0FBRUgsV0FBTyxDQUFDLENBQUM7Q0FDWixDQUFBLEVBQUc7SUFFSixZQUFZLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFO0FBQ2hELFlBQVEsRUFBRTtBQUNOLFdBQUcsRUFBQSxlQUFHO0FBQUUsbUJBQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUFFO0FBQzdELFdBQUcsRUFBQSxhQUFDLEdBQUcsRUFBRTtBQUFFLGdCQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztTQUFFO0tBQ2pFO0FBQ0QsU0FBSyxFQUFFO0FBQ0gsV0FBRyxFQUFBLGVBQUc7QUFBRSxtQkFBTyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQUU7QUFDMUQsV0FBRyxFQUFBLGFBQUMsR0FBRyxFQUFFO0FBQUUsZ0JBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO1NBQUU7S0FDOUQ7Q0FDSixDQUFDLENBQUM7O0FBRVAsWUFBWSxDQUFDLGVBQWUsR0FBRyxZQUFZOzs7QUFDcEMsUUFBSSxRQUFRLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQzs7O0FBR3RDLGNBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUUsVUFBQSxJQUFJLEVBQUk7OztBQUdoRCxjQUFNLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDOzs7QUFHdkIsY0FBSyxXQUFXLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztLQUN6RCxDQUFDLENBQUM7Q0FDTixDQUFBOztBQUVELFlBQVksQ0FBQyx3QkFBd0IsR0FBRyxVQUFVLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFOzs7QUFDaEUsY0FBVSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUNqQyxJQUFJLENBQUMsVUFBQSxJQUFJO2VBQUksTUFBTSxDQUFDLElBQUksU0FBTztLQUFBLENBQUMsQ0FBQztDQUN4QyxDQUFDOztBQUVGLElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFLEVBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibGV0IGN1cnJEb2MgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0Lm93bmVyRG9jdW1lbnQsXG5cbiAgICAvL01hcHMgdG8gcGxlYXNhbnQgaWNvbnMgZm9yIHdlYXRoZXIgc3RhdHVzLlxuICAgIGljb25CYXNlID0gYC9pbWcvYCxcbiAgICB3ZWF0aGVyTWFwID0ge1xuICAgICAgICBjbGVhcjogYCR7aWNvbkJhc2V9c3VuLnN2Z2AsXG4gICAgICAgIHJhaW46ICBgJHtpY29uQmFzZX1yYWluLnN2Z2AsXG4gICAgICAgICdzY2F0dGVyZWQgY2xvdWRzJzogYCR7aWNvbkJhc2V9Y2xvdWQtc3VuLnN2Z2AsXG4gICAgICAgICdwYXJ0bHkgY2xvdWR5JzogYCR7aWNvbkJhc2V9Y2xvdWQtc3VuLnN2Z2AsXG4gICAgICAgICdtb3N0bHkgY2xvdWR5JzpgJHtpY29uQmFzZX1jbG91ZC1zdW4taW52LnN2Z2AsXG4gICAgICAgICdvdmVyY2FzdCc6IGAke2ljb25CYXNlfWNsb3Vkcy5zdmdgLFxuICAgICAgICB3aW5keTogYCR7aWNvbkJhc2V9d2luZHkuc3ZnYFxuICAgIH0sXG5cbiAgICAvL3V0aWxpdGllcyB0byB3b3JrIHF1Y2lrZXIgb24gbm9kZUxpc3RzXG4gICAgcXNhID0gKHNlbCwgcm9vdCkgPT4gW10uc2xpY2UuY2FsbChyb290LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsKSksXG5cbiAgICB0ZXh0TWFwcGVyID0gdGV4dCA9PiBub2RlID0+IG5vZGUudGV4dENvbnRlbnQgPSB0ZXh0LFxuXG4gICAgc3JjTWFwcGVyID0gdXJsID0+IG5vZGUgPT4gbm9kZS5zcmMgPSB1cmwsXG5cbiAgICAvLyB1cGRhdGVzIHRoZSBET00gd2l0aCB0aGUgaW5mb3JtYXRpb24gcGFzc2VkIGluLlxuICAgIHJlbmRlciA9IChkYXRhLCBmcmFnKSA9PiB7XG5cbiAgICAgICAgcXNhKCcubG9jYXRpb24nLCBmcmFnKS5tYXAodGV4dE1hcHBlcihkYXRhLmRpc3BsYXlfbG9jYXRpb24uZnVsbCkpO1xuXG4gICAgICAgIHFzYSgnLmljb24gaW1nJywgZnJhZykubWFwKHNyY01hcHBlcih3ZWF0aGVyTWFwW2RhdGEud2VhdGhlci50b0xvd2VyQ2FzZSgpXSB8fCBkYXRhLmltYWdlLnVybCkpO1xuXG4gICAgICAgIHFzYSgnLndlYXRoZXItZGVzY3JpcHRpb24nLCBmcmFnKS5tYXAodGV4dE1hcHBlcihkYXRhLndlYXRoZXIpKTtcblxuICAgICAgICBxc2EoJy53aW5kJywgZnJhZykubWFwKHRleHRNYXBwZXIoZGF0YS53aW5kX3N0cmluZykpO1xuXG4gICAgICAgIC8vd2Ugc2V0IHRlbXAgdG8gdGhlIG51bWJlciBvZiBkZWdyZWVzIGluIHRoZSBwcmVmZXJyZWQgdW5pdCBiZWZvcmVcbiAgICAgICAgLy9nZXR0aW5nIHRvIHJlbmRlciBhcyB3ZSB3b24ndCBoYXZlIHRoYXQgY29udGV4dCB3aXRoaW4gcmVuZGVyXG4gICAgICAgIHFzYSgnLmRlZ3MnLCBmcmFnKS5tYXAodGV4dE1hcHBlcihkYXRhLnRlbXApKTtcbiAgICAgICAgcXNhKCcudW5pdCcsIGZyYWcpLm1hcCh0ZXh0TWFwcGVyKGRhdGEudW5pdHMpKTtcbiAgICB9LFxuXG4gICAgZ2V0V2VhdGhlciA9IChsb2NhdGlvbiwgdW5pdHMpID0+IHtcbiAgICAgICAgdmFyIGxvYyA9IGxvY2F0aW9uLnNwbGl0KC8sXFxzKi8pLm1hcCggaXRlbSA9PiBpdGVtLnJlcGxhY2UoJyAnLCAnXycpKTtcbiAgICAgICAgcmV0dXJuIGZldGNoKGAvL2FwaS53dW5kZXJncm91bmQuY29tL2FwaS80MmRiM2MzNjBiYWJlNGU1L2NvbmRpdGlvbnMvcS8ke2xvY1sxXX0vJHtsb2NbMF19Lmpzb25gKS50aGVuKHJlc3AgPT4gcmVzcC5qc29uKCkpLnRoZW4oIGRhdGEgPT4ge1xuICAgICAgICAgICAgZGF0YSA9IGRhdGEuY3VycmVudF9vYnNlcnZhdGlvbjtcblxuICAgICAgICAgICAgaWYgKCAhZGF0YSApIHtcbiAgICAgICAgICAgICAgICBkYXRhID0ge1xuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5X2xvY2F0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmdWxsOiBgQ291bGQgbm90IGZpbmQgd2VhdGhlciBpbmZvcm1hdGlvbiBmb3IgJHtsb2NhdGlvbn1gXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHRlbXBfZjogJz8nLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wX2M6ICc/JyxcbiAgICAgICAgICAgICAgICAgICAgd2VhdGhlcjogJycsXG4gICAgICAgICAgICAgICAgICAgIGltYWdlOiB7IHVybDogJycgfSxcbiAgICAgICAgICAgICAgICAgICAgd2luZF9zdHJpbmc6ICcnXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZGF0YS50ZW1wID0gKHVuaXRzID09PSAnZicpID8gZGF0YS50ZW1wX2YgOiBkYXRhLnRlbXBfYztcbiAgICAgICAgICAgIGRhdGEudW5pdHMgPSB1bml0cy50b1VwcGVyQ2FzZSgpO1xuXG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHRlbXBsYXRlU3RyID0gKCgpID0+IHtcbiAgICAgICAgICAgbGV0IHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdub3QtYS10ZW1wbGF0ZScpO1xuICAgICAgICB0LmlubmVySFRNTCA9IGBcbiAgICAgICAgPHN0eWxlPlxuICAgICAgICAgICAgZmlndXJlIHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgICAgIGZvbnQtZmFtaWx5OiBzYW5zLXNlcmlmO1xuICAgICAgICAgICAgICAgIGZsZXgtZmxvdzogcm93IHdyYXA7XG4gICAgICAgICAgICAgICAgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7XG4gICAgICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLmljb24sIGZpZ2NhcHRpb24ge1xuICAgICAgICAgICAgICAgIGZsZXg6IDAgMCA0OCU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpbWcge1xuICAgICAgICAgICAgICAgIG1heC13aWR0aDogMTAwJTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC50ZW1wIHtcbiAgICAgICAgICAgICAgICBmb250LXdlaWdodDogYm9sZDtcbiAgICAgICAgICAgICAgICBmb250LXNpemU6IDJlbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC5kZWdzOjphZnRlciB7XG4gICAgICAgICAgICAgICAgY29udGVudDogJ1xcXFwwMEIwJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC53aW5kOjpiZWZvcmUge1xuICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICdXaW5kOiAnXG4gICAgICAgICAgICB9XG4gICAgICAgIDwvc3R5bGU+XG4gICAgICAgIDxzZWN0aW9uIGNsYXNzPVwid2VhdGhlci1ibG9ja1wiPlxuICAgICAgICAgICAgPGgxIGNsYXNzPVwidGl0bGVcIj5XZWF0aGVyIGZvciA8c3BhbiBjbGFzcz1cImxvY2F0aW9uXCI+U291dGggSm9yZGFuLCBVVDwvc3Bhbj48L2gxPlxuICAgICAgICAgICAgPGZpZ3VyZT5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaWNvblwiPlxuICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz1cIi9pbWcvcmFpbi5zdmdcIi8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGZpZ2NhcHRpb24+XG4gICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwidGVtcFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkZWdzXCI+Njg8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInVuaXRcIj5GPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwid2VhdGhlci1kZXNjcmlwdGlvblwiPlJhaW55PC9wPlxuICAgICAgICAgICAgICAgICAgICA8cCBjbGFzcz1cIndpbmRcIj5Gcm9tIHRoZSBOTlcgYXQgMjIuMCBNUEggR3VzdGluZyB0byAyOC4wIE1QSDwvcD5cbiAgICAgICAgICAgICAgICA8L2ZpZ2NhcHRpb24+XG4gICAgICAgICAgICA8L2ZpZ3VyZT5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICBgO1xuXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LCAnY29udGVudCcsIHtcbiAgICAgICAgICAgIGdldCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gWy4uLnQuY2hpbGRyZW5dLnJlZHVjZSgoZnJhZywgY2hpbGQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZnJhZy5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmcmFnO1xuICAgICAgICAgICAgICAgIH0sIGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0O1xuICAgIH0pKCksXG5cbiAgICB3ZWF0aGVyUHJvdG8gPSBPYmplY3QuY3JlYXRlKEhUTUxFbGVtZW50LnByb3RvdHlwZSwge1xuICAgICAgICBsb2NhdGlvbjoge1xuICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoJ2xvY2F0aW9uJykudG9Mb3dlckNhc2UoKTsgfSxcbiAgICAgICAgICAgIHNldCh2YWwpIHsgdGhpcy5zZXRBdHRyaWJ1dGUoJ2xvY2F0aW9uJywgdmFsLnRvTG93ZXJDYXNlKCkpOyB9XG4gICAgICAgIH0sXG4gICAgICAgIHVuaXRzOiB7XG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZSgndW5pdHMnKS50b0xvd2VyQ2FzZSgpOyB9LFxuICAgICAgICAgICAgc2V0KHZhbCkgeyB0aGlzLnNldEF0dHJpYnV0ZSgndW5pdHMnLCB2YWwudG9Mb3dlckNhc2UoKSk7IH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG53ZWF0aGVyUHJvdG8uY3JlYXRlZENhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgIGxldCB0ZW1wbGF0ZSA9IHRlbXBsYXRlU3RyLmNvbnRlbnQ7XG4gICAgICAgIC8vIHNoYWRvd1Jvb3QgPSB0aGlzLmNyZWF0ZVNoYWRvd1Jvb3QoKTtcblxuICAgIGdldFdlYXRoZXIodGhpcy5sb2NhdGlvbiwgdGhpcy51bml0cykudGhlbiggZGF0YSA9PiB7XG5cbiAgICAgICAgLy9cInJlbmRlclwiIHRoZSBkYXRhIGludG8gdGhlIHRlbXBsYXRlXG4gICAgICAgIHJlbmRlcihkYXRhLCB0ZW1wbGF0ZSk7XG5cbiAgICAgICAgLy9hdHRhY2ggdGhlIHRlbXBsYXRlIGZyYWdtZW50IHRvIHRoZSBzaGFkb3cgcm9vdCBvbmNlIHJlbmRlcmVkXG4gICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZSwgdHJ1ZSkpO1xuICAgIH0pO1xufVxuXG53ZWF0aGVyUHJvdG8uYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrID0gZnVuY3Rpb24gKGF0dHIsIHByZXYsIGN1cnIpIHtcbiAgICBnZXRXZWF0aGVyKHRoaXMubG9jYXRpb24sIHRoaXMudW5pdHMpXG4gICAgICAgLnRoZW4oZGF0YSA9PiByZW5kZXIoZGF0YSwgdGhpcykpO1xufTtcblxubGV0IFdlYXRoZXIgPSBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ3dlYXRoZXItbm93Jywge3Byb3RvdHlwZTogd2VhdGhlclByb3RvIH0pO1xuIl19
