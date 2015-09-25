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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvdnMtdm90ZS9wdWJsaWMvY29tcG9uZW50cy93ZWF0aGVyLW5vdy93ZWF0aGVyLW5vdy1zYW5zLWltcG9ydHMuZXM2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxJQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLGFBQWE7OztBQUc5QyxRQUFRLDZDQUE2QztJQUNyRCxVQUFVLEdBQUc7QUFDVCxTQUFLLEVBQUssUUFBUSxZQUFTO0FBQzNCLFFBQUksRUFBTSxRQUFRLGFBQVU7QUFDNUIsbUJBQWUsRUFBSyxRQUFRLGtCQUFlO0FBQzNDLG1CQUFlLEVBQUksUUFBUSxzQkFBbUI7QUFDOUMsY0FBVSxFQUFLLFFBQVEsZUFBWTtBQUNuQyxTQUFLLEVBQUssUUFBUSxjQUFXO0NBQ2hDOzs7QUFHRCxHQUFHLEdBQUcsU0FBTixHQUFHLENBQUksR0FBRyxFQUFFLElBQUk7V0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUM7Q0FBQTtJQUU5RCxVQUFVLEdBQUcsU0FBYixVQUFVLENBQUcsSUFBSTtXQUFJLFVBQUEsSUFBSTtlQUFJLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSTtLQUFBO0NBQUE7SUFFcEQsU0FBUyxHQUFHLFNBQVosU0FBUyxDQUFHLEdBQUc7V0FBSSxVQUFBLElBQUk7ZUFBSSxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUc7S0FBQTtDQUFBOzs7QUFHekMsTUFBTSxHQUFHLFNBQVQsTUFBTSxDQUFJLElBQUksRUFBRSxJQUFJLEVBQUs7O0FBRXJCLE9BQUcsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7QUFFbkUsT0FBRyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDOztBQUVoRyxPQUFHLENBQUMsc0JBQXNCLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzs7QUFFaEUsT0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDOzs7O0FBSXJELE9BQUcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUM5QyxPQUFHLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Q0FDbEQ7SUFFRCxVQUFVLEdBQUcsU0FBYixVQUFVLENBQUksUUFBUSxFQUFFLEtBQUssRUFBSztBQUM5QixRQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBRSxVQUFBLElBQUk7ZUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7S0FBQSxDQUFDLENBQUM7QUFDdEUsV0FBTyxLQUFLLCtEQUE2RCxHQUFHLENBQUMsQ0FBQyxDQUFDLFNBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxXQUFRLENBQUMsSUFBSSxDQUFDLFVBQUEsSUFBSTtlQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7S0FBQSxDQUFDLENBQUMsSUFBSSxDQUFFLFVBQUEsSUFBSSxFQUFJO0FBQ3RJLFlBQUksR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUM7O0FBRWhDLFlBQUssQ0FBQyxJQUFJLEVBQUc7QUFDVCxnQkFBSSxHQUFHO0FBQ0gsZ0NBQWdCLEVBQUU7QUFDZCx3QkFBSSw4Q0FBNEMsUUFBUSxBQUFFO2lCQUM3RDtBQUNELHNCQUFNLEVBQUUsR0FBRztBQUNYLHNCQUFNLEVBQUUsR0FBRztBQUNYLHVCQUFPLEVBQUUsRUFBRTtBQUNYLHFCQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFO0FBQ2xCLDJCQUFXLEVBQUUsRUFBRTthQUNsQixDQUFDO1NBQ0w7O0FBRUQsWUFBSSxDQUFDLElBQUksR0FBRyxBQUFDLEtBQUssS0FBSyxHQUFHLEdBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQ3hELFlBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDOztBQUVqQyxlQUFPLElBQUksQ0FBQztLQUNmLENBQUMsQ0FBQztDQUNOO0lBRUQsV0FBVyxHQUFHLENBQUMsWUFBTTtBQUNqQixRQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzNDLEtBQUMsQ0FBQyxTQUFTLHE1Q0EwQ1YsQ0FBQztBQUNGLFdBQU8sQ0FBQyxDQUFDO0NBQ1osQ0FBQSxFQUFHO0lBRUosWUFBWSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRTtBQUNoRCxZQUFRLEVBQUU7QUFDTixXQUFHLEVBQUEsZUFBRztBQUFFLG1CQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7U0FBRTtBQUM3RCxXQUFHLEVBQUEsYUFBQyxHQUFHLEVBQUU7QUFBRSxnQkFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7U0FBRTtLQUNqRTtBQUNELFNBQUssRUFBRTtBQUNILFdBQUcsRUFBQSxlQUFHO0FBQUUsbUJBQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUFFO0FBQzFELFdBQUcsRUFBQSxhQUFDLEdBQUcsRUFBRTtBQUFFLGdCQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztTQUFFO0tBQzlEO0NBQ0osQ0FBQyxDQUFDOztBQUVQLFlBQVksQ0FBQyxlQUFlLEdBQUcsWUFBWTtBQUN2QyxRQUFJLFFBQVEsR0FBRyxXQUFXLENBQUMsT0FBTztRQUM5QixVQUFVLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7O0FBRXpDLGNBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUUsVUFBQSxJQUFJLEVBQUk7OztBQUdoRCxjQUFNLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDOzs7QUFHdkIsa0JBQVUsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztLQUMvRCxDQUFDLENBQUM7Q0FDTixDQUFBOztBQUVELFlBQVksQ0FBQyx3QkFBd0IsR0FBRyxVQUFVLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFOzs7QUFDaEUsY0FBVSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLElBQUk7ZUFBSSxNQUFNLENBQUMsSUFBSSxFQUFFLE1BQUssVUFBVSxDQUFDO0tBQUEsQ0FBQyxDQUFDO0NBQ3JGLENBQUM7O0FBRUYsSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxhQUFhLEVBQUUsRUFBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJsZXQgY3VyckRvYyA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQub3duZXJEb2N1bWVudCxcblxuICAgIC8vTWFwcyB0byBwbGVhc2FudCBpY29ucyBmb3Igd2VhdGhlciBzdGF0dXMuXG4gICAgaWNvbkJhc2UgPSBgLy91eHJlcG8uY29tL3N0YXRpYy9pY29uLXNldHMvbWV0ZW8vc3ZnL2AsXG4gICAgd2VhdGhlck1hcCA9IHtcbiAgICAgICAgY2xlYXI6IGAke2ljb25CYXNlfXN1bi5zdmdgLFxuICAgICAgICByYWluOiAgYCR7aWNvbkJhc2V9cmFpbi5zdmdgLFxuICAgICAgICAncGFydGx5IGNsb3VkeSc6IGAke2ljb25CYXNlfWNsb3VkLXN1bi5zdmdgLFxuICAgICAgICAnbW9zdGx5IGNsb3VkeSc6YCR7aWNvbkJhc2V9Y2xvdWQtc3VuLWludi5zdmdgLFxuICAgICAgICAnb3ZlcmNhc3QnOiBgJHtpY29uQmFzZX1jbG91ZHMuc3ZnYCxcbiAgICAgICAgd2luZHk6IGAke2ljb25CYXNlfXdpbmR5LnN2Z2BcbiAgICB9LFxuXG4gICAgLy91dGlsaXRpZXMgdG8gd29yayBxdWNpa2VyIG9uIG5vZGVMaXN0c1xuICAgIHFzYSA9IChzZWwsIHJvb3QpID0+IFtdLnNsaWNlLmNhbGwocm9vdC5xdWVyeVNlbGVjdG9yQWxsKHNlbCkpLFxuXG4gICAgdGV4dE1hcHBlciA9IHRleHQgPT4gbm9kZSA9PiBub2RlLnRleHRDb250ZW50ID0gdGV4dCxcblxuICAgIHNyY01hcHBlciA9IHVybCA9PiBub2RlID0+IG5vZGUuc3JjID0gdXJsLFxuXG4gICAgLy8gdXBkYXRlcyB0aGUgc2hhZG93IERPTSB3aXRoIHRoZSBpbmZvcm1hdGlvbiBwYXNzZWQgaW4uXG4gICAgcmVuZGVyID0gKGRhdGEsIGZyYWcpID0+IHtcblxuICAgICAgICBxc2EoJy5sb2NhdGlvbicsIGZyYWcpLm1hcCh0ZXh0TWFwcGVyKGRhdGEuZGlzcGxheV9sb2NhdGlvbi5mdWxsKSk7XG5cbiAgICAgICAgcXNhKCcuaWNvbiBpbWcnLCBmcmFnKS5tYXAoc3JjTWFwcGVyKHdlYXRoZXJNYXBbZGF0YS53ZWF0aGVyLnRvTG93ZXJDYXNlKCldIHx8IGRhdGEuaW1hZ2UudXJsKSk7XG5cbiAgICAgICAgcXNhKCcud2VhdGhlci1kZXNjcmlwdGlvbicsIGZyYWcpLm1hcCh0ZXh0TWFwcGVyKGRhdGEud2VhdGhlcikpO1xuXG4gICAgICAgIHFzYSgnLndpbmQnLCBmcmFnKS5tYXAodGV4dE1hcHBlcihkYXRhLndpbmRfc3RyaW5nKSk7XG5cbiAgICAgICAgLy93ZSBzZXQgdGVtcCB0byB0aGUgbnVtYmVyIG9mIGRlZ3JlZXMgaW4gdGhlIHByZWZlcnJlZCB1bml0IGJlZm9yZVxuICAgICAgICAvL2dldHRpbmcgdG8gcmVuZGVyIGFzIHdlIHdvbid0IGhhdmUgdGhhdCBjb250ZXh0IHdpdGhpbiByZW5kZXJcbiAgICAgICAgcXNhKCcuZGVncycsIGZyYWcpLm1hcCh0ZXh0TWFwcGVyKGRhdGEudGVtcCkpO1xuICAgICAgICBxc2EoJy51bml0JywgZnJhZykubWFwKHRleHRNYXBwZXIoZGF0YS51bml0cykpO1xuICAgIH0sXG5cbiAgICBnZXRXZWF0aGVyID0gKGxvY2F0aW9uLCB1bml0cykgPT4ge1xuICAgICAgICB2YXIgbG9jID0gbG9jYXRpb24uc3BsaXQoLyxcXHMqLykubWFwKCBpdGVtID0+IGl0ZW0ucmVwbGFjZSgnICcsICdfJykpO1xuICAgICAgICByZXR1cm4gZmV0Y2goYC8vYXBpLnd1bmRlcmdyb3VuZC5jb20vYXBpLzQyZGIzYzM2MGJhYmU0ZTUvY29uZGl0aW9ucy9xLyR7bG9jWzFdfS8ke2xvY1swXX0uanNvbmApLnRoZW4ocmVzcCA9PiByZXNwLmpzb24oKSkudGhlbiggZGF0YSA9PiB7XG4gICAgICAgICAgICBkYXRhID0gZGF0YS5jdXJyZW50X29ic2VydmF0aW9uO1xuXG4gICAgICAgICAgICBpZiAoICFkYXRhICkge1xuICAgICAgICAgICAgICAgIGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXlfbG9jYXRpb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGw6IGBDb3VsZCBub3QgZmluZCB3ZWF0aGVyIGluZm9ybWF0aW9uIGZvciAke2xvY2F0aW9ufWBcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgdGVtcF9mOiAnPycsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBfYzogJz8nLFxuICAgICAgICAgICAgICAgICAgICB3ZWF0aGVyOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2U6IHsgdXJsOiAnJyB9LFxuICAgICAgICAgICAgICAgICAgICB3aW5kX3N0cmluZzogJydcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkYXRhLnRlbXAgPSAodW5pdHMgPT09ICdmJykgPyBkYXRhLnRlbXBfZiA6IGRhdGEudGVtcF9jO1xuICAgICAgICAgICAgZGF0YS51bml0cyA9IHVuaXRzLnRvVXBwZXJDYXNlKCk7XG5cbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgdGVtcGxhdGVTdHIgPSAoKCkgPT4ge1xuICAgICAgICBsZXQgdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gICAgICAgIHQuaW5uZXJIVE1MID0gYFxuICAgICAgICA8c3R5bGU+XG4gICAgICAgICAgICBmaWd1cmUge1xuICAgICAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICAgICAgZm9udC1mYW1pbHk6IHNhbnMtc2VyaWY7XG4gICAgICAgICAgICAgICAgZmxleC1mbG93OiByb3cgd3JhcDtcbiAgICAgICAgICAgICAgICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcbiAgICAgICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAuaWNvbiwgZmlnY2FwdGlvbiB7XG4gICAgICAgICAgICAgICAgZmxleDogMCAwIDQ4JTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGltZyB7XG4gICAgICAgICAgICAgICAgbWF4LXdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLnRlbXAge1xuICAgICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xuICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMmVtO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLmRlZ3M6OmFmdGVyIHtcbiAgICAgICAgICAgICAgICBjb250ZW50OiAnXFxcXDAwQjAnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLndpbmQ6OmJlZm9yZSB7XG4gICAgICAgICAgICAgICAgY29udGVudDogJ1dpbmQ6ICdcbiAgICAgICAgICAgIH1cbiAgICAgICAgPC9zdHlsZT5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3M9XCJ3ZWF0aGVyLWJsb2NrXCI+XG4gICAgICAgICAgICA8aDEgY2xhc3M9XCJ0aXRsZVwiPldlYXRoZXIgZm9yIDxzcGFuIGNsYXNzPVwibG9jYXRpb25cIj5Tb3V0aCBKb3JkYW4sIFVUPC9zcGFuPjwvaDE+XG4gICAgICAgICAgICA8ZmlndXJlPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpY29uXCI+XG4gICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiLy91eHJlcG8uY29tL3N0YXRpYy9pY29uLXNldHMvbWV0ZW8vc3ZnL3JhaW4uc3ZnXCIvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxmaWdjYXB0aW9uPlxuICAgICAgICAgICAgICAgICAgICA8cCBjbGFzcz1cInRlbXBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZGVnc1wiPjY4PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ1bml0XCI+Rjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgICAgICA8cCBjbGFzcz1cIndlYXRoZXItZGVzY3JpcHRpb25cIj5SYWlueTwvcD5cbiAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJ3aW5kXCI+RnJvbSB0aGUgTk5XIGF0IDIyLjAgTVBIIEd1c3RpbmcgdG8gMjguMCBNUEg8L3A+XG4gICAgICAgICAgICAgICAgPC9maWdjYXB0aW9uPlxuICAgICAgICAgICAgPC9maWd1cmU+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgYDtcbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfSkoKSxcblxuICAgIHdlYXRoZXJQcm90byA9IE9iamVjdC5jcmVhdGUoSFRNTEVsZW1lbnQucHJvdG90eXBlLCB7XG4gICAgICAgIGxvY2F0aW9uOiB7XG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZSgnbG9jYXRpb24nKS50b0xvd2VyQ2FzZSgpOyB9LFxuICAgICAgICAgICAgc2V0KHZhbCkgeyB0aGlzLnNldEF0dHJpYnV0ZSgnbG9jYXRpb24nLCB2YWwudG9Mb3dlckNhc2UoKSk7IH1cbiAgICAgICAgfSxcbiAgICAgICAgdW5pdHM6IHtcbiAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKCd1bml0cycpLnRvTG93ZXJDYXNlKCk7IH0sXG4gICAgICAgICAgICBzZXQodmFsKSB7IHRoaXMuc2V0QXR0cmlidXRlKCd1bml0cycsIHZhbC50b0xvd2VyQ2FzZSgpKTsgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbndlYXRoZXJQcm90by5jcmVhdGVkQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IHRlbXBsYXRlID0gdGVtcGxhdGVTdHIuY29udGVudCxcbiAgICAgICAgc2hhZG93Um9vdCA9IHRoaXMuY3JlYXRlU2hhZG93Um9vdCgpO1xuXG4gICAgZ2V0V2VhdGhlcih0aGlzLmxvY2F0aW9uLCB0aGlzLnVuaXRzKS50aGVuKCBkYXRhID0+IHtcblxuICAgICAgICAvL1wicmVuZGVyXCIgdGhlIGRhdGEgaW50byB0aGUgdGVtcGxhdGVcbiAgICAgICAgcmVuZGVyKGRhdGEsIHRlbXBsYXRlKTtcblxuICAgICAgICAvL2F0dGFjaCB0aGUgdGVtcGxhdGUgZnJhZ21lbnQgdG8gdGhlIHNoYWRvdyByb290IG9uY2UgcmVuZGVyZWRcbiAgICAgICAgc2hhZG93Um9vdC5hcHBlbmRDaGlsZChkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLCB0cnVlKSk7XG4gICAgfSk7XG59XG5cbndlYXRoZXJQcm90by5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sgPSBmdW5jdGlvbiAoYXR0ciwgcHJldiwgY3Vycikge1xuICAgIGdldFdlYXRoZXIodGhpcy5sb2NhdGlvbiwgdGhpcy51bml0cykudGhlbihkYXRhID0+IHJlbmRlcihkYXRhLCB0aGlzLnNoYWRvd1Jvb3QpKTtcbn07XG5cbmxldCBXZWF0aGVyID0gZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCd3ZWF0aGVyLW5vdycsIHtwcm90b3R5cGU6IHdlYXRoZXJQcm90byB9KTtcbiJdfQ==
