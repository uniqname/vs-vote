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
    var template = currDoc.querySelector('#weather-now').content,
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvdnMtdm90ZS9wdWJsaWMvY29tcG9uZW50cy93ZWF0aGVyLW5vdy93ZWF0aGVyLW5vdy5lczYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsYUFBYTs7O0FBRzlDLFFBQVEsVUFBVTtJQUNsQixVQUFVLEdBQUc7QUFDVCxTQUFLLEVBQUssUUFBUSxZQUFTO0FBQzNCLFFBQUksRUFBTSxRQUFRLGFBQVU7QUFDNUIsbUJBQWUsRUFBSyxRQUFRLGtCQUFlO0FBQzNDLG1CQUFlLEVBQUksUUFBUSxzQkFBbUI7QUFDOUMsY0FBVSxFQUFLLFFBQVEsZUFBWTtBQUNuQyxTQUFLLEVBQUssUUFBUSxjQUFXO0NBQ2hDOzs7QUFHRCxHQUFHLEdBQUcsU0FBTixHQUFHLENBQUksR0FBRyxFQUFFLElBQUk7V0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUM7Q0FBQTtJQUU5RCxVQUFVLEdBQUcsU0FBYixVQUFVLENBQUcsSUFBSTtXQUFJLFVBQUEsSUFBSTtlQUFJLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSTtLQUFBO0NBQUE7SUFFcEQsU0FBUyxHQUFHLFNBQVosU0FBUyxDQUFHLEdBQUc7V0FBSSxVQUFBLElBQUk7ZUFBSSxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUc7S0FBQTtDQUFBOzs7QUFHekMsTUFBTSxHQUFHLFNBQVQsTUFBTSxDQUFJLElBQUksRUFBRSxJQUFJLEVBQUs7O0FBRXJCLE9BQUcsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMs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Q0FBQztTQUFFO0tBQzlEO0NBQ0osQ0FBQyxDQUFDOztBQUVQLFlBQVksQ0FBQyxlQUFlLEdBQUcsWUFBWTtBQUN2QyxRQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDLE9BQU87UUFDeEQsVUFBVSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDOztBQUV6QyxjQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFFLFVBQUEsSUFBSSxFQUFJOzs7QUFHaEQsY0FBTSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQzs7O0FBR3ZCLGtCQUFVLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7S0FDL0QsQ0FBQyxDQUFDO0NBQ04sQ0FBQTs7QUFFRCxZQUFZLENBQUMsd0JBQXdCLEdBQUcsVUFBVSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTs7O0FBQ2hFLGNBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxJQUFJO2VBQUksTUFBTSxDQUFDLElBQUksRUFBRSxNQUFLLFVBQVUsQ0FBQztLQUFBLENBQUMsQ0FBQztDQUNyRixDQUFDOztBQUVGLElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFLEVBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibGV0IGN1cnJEb2MgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0Lm93bmVyRG9jdW1lbnQsXG5cbiAgICAvL01hcHMgdG8gcGxlYXNhbnQgaWNvbnMgZm9yIHdlYXRoZXIgc3RhdHVzLlxuICAgIGljb25CYXNlID0gYC9pbWcvYCxcbiAgICB3ZWF0aGVyTWFwID0ge1xuICAgICAgICBjbGVhcjogYCR7aWNvbkJhc2V9c3VuLnN2Z2AsXG4gICAgICAgIHJhaW46ICBgJHtpY29uQmFzZX1yYWluLnN2Z2AsXG4gICAgICAgICdwYXJ0bHkgY2xvdWR5JzogYCR7aWNvbkJhc2V9Y2xvdWQtc3VuLnN2Z2AsXG4gICAgICAgICdtb3N0bHkgY2xvdWR5JzpgJHtpY29uQmFzZX1jbG91ZC1zdW4taW52LnN2Z2AsXG4gICAgICAgICdvdmVyY2FzdCc6IGAke2ljb25CYXNlfWNsb3Vkcy5zdmdgLFxuICAgICAgICB3aW5keTogYCR7aWNvbkJhc2V9d2luZHkuc3ZnYFxuICAgIH0sXG5cbiAgICAvL3V0aWxpdGllcyB0byB3b3JrIHF1Y2lrZXIgb24gbm9kZUxpc3RzXG4gICAgcXNhID0gKHNlbCwgcm9vdCkgPT4gW10uc2xpY2UuY2FsbChyb290LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsKSksXG5cbiAgICB0ZXh0TWFwcGVyID0gdGV4dCA9PiBub2RlID0+IG5vZGUudGV4dENvbnRlbnQgPSB0ZXh0LFxuXG4gICAgc3JjTWFwcGVyID0gdXJsID0+IG5vZGUgPT4gbm9kZS5zcmMgPSB1cmwsXG5cbiAgICAvLyB1cGRhdGVzIHRoZSBzaGFkb3cgRE9NIHdpdGggdGhlIGluZm9ybWF0aW9uIHBhc3NlZCBpbi5cbiAgICByZW5kZXIgPSAoZGF0YSwgZnJhZykgPT4ge1xuXG4gICAgICAgIHFzYSgnLmxvY2F0aW9uJywgZnJhZykubWFwKHRleHRNYXBwZXIoZGF0YS5kaXNwbGF5X2xvY2F0aW9uLmZ1bGwpKTtcblxuICAgICAgICBxc2EoJy5pY29uIGltZycsIGZyYWcpLm1hcChzcmNNYXBwZXIod2VhdGhlck1hcFtkYXRhLndlYXRoZXIudG9Mb3dlckNhc2UoKV0gfHwgZGF0YS5pbWFnZS51cmwpKTtcblxuICAgICAgICBxc2EoJy53ZWF0aGVyLWRlc2NyaXB0aW9uJywgZnJhZykubWFwKHRleHRNYXBwZXIoZGF0YS53ZWF0aGVyKSk7XG5cbiAgICAgICAgcXNhKCcud2luZCcsIGZyYWcpLm1hcCh0ZXh0TWFwcGVyKGRhdGEud2luZF9zdHJpbmcpKTtcblxuICAgICAgICAvL3dlIHNldCB0ZW1wIHRvIHRoZSBudW1iZXIgb2YgZGVncmVlcyBpbiB0aGUgcHJlZmVycmVkIHVuaXQgYmVmb3JlXG4gICAgICAgIC8vZ2V0dGluZyB0byByZW5kZXIgYXMgd2Ugd29uJ3QgaGF2ZSB0aGF0IGNvbnRleHQgd2l0aGluIHJlbmRlclxuICAgICAgICBxc2EoJy5kZWdzJywgZnJhZykubWFwKHRleHRNYXBwZXIoZGF0YS50ZW1wKSk7XG4gICAgICAgIHFzYSgnLnVuaXQnLCBmcmFnKS5tYXAodGV4dE1hcHBlcihkYXRhLnVuaXRzKSk7XG4gICAgfSxcblxuICAgIGdldFdlYXRoZXIgPSAobG9jYXRpb24sIHVuaXRzKSA9PiB7XG4gICAgICAgIHZhciBsb2MgPSBsb2NhdGlvbi5zcGxpdCgvLFxccyovKS5tYXAoIGl0ZW0gPT4gaXRlbS5yZXBsYWNlKCcgJywgJ18nKSk7XG4gICAgICAgIHJldHVybiBmZXRjaChgLy9hcGkud3VuZGVyZ3JvdW5kLmNvbS9hcGkvNDJkYjNjMzYwYmFiZTRlNS9jb25kaXRpb25zL3EvJHtsb2NbMV19LyR7bG9jWzBdfS5qc29uYCkudGhlbihyZXNwID0+IHJlc3AuanNvbigpKS50aGVuKCBkYXRhID0+IHtcbiAgICAgICAgICAgIGRhdGEgPSBkYXRhLmN1cnJlbnRfb2JzZXJ2YXRpb247XG5cbiAgICAgICAgICAgIGlmICggIWRhdGEgKSB7XG4gICAgICAgICAgICAgICAgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheV9sb2NhdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgZnVsbDogYENvdWxkIG5vdCBmaW5kIHdlYXRoZXIgaW5mb3JtYXRpb24gZm9yICR7bG9jYXRpb259YFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB0ZW1wX2Y6ICc/JyxcbiAgICAgICAgICAgICAgICAgICAgdGVtcF9jOiAnPycsXG4gICAgICAgICAgICAgICAgICAgIHdlYXRoZXI6ICcnLFxuICAgICAgICAgICAgICAgICAgICBpbWFnZTogeyB1cmw6ICcnIH0sXG4gICAgICAgICAgICAgICAgICAgIHdpbmRfc3RyaW5nOiAnJ1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRhdGEudGVtcCA9ICh1bml0cyA9PT0gJ2YnKSA/IGRhdGEudGVtcF9mIDogZGF0YS50ZW1wX2M7XG4gICAgICAgICAgICBkYXRhLnVuaXRzID0gdW5pdHMudG9VcHBlckNhc2UoKTtcblxuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICB3ZWF0aGVyUHJvdG8gPSBPYmplY3QuY3JlYXRlKEhUTUxFbGVtZW50LnByb3RvdHlwZSwge1xuICAgICAgICBsb2NhdGlvbjoge1xuICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoJ2xvY2F0aW9uJykudG9Mb3dlckNhc2UoKTsgfSxcbiAgICAgICAgICAgIHNldCh2YWwpIHsgdGhpcy5zZXRBdHRyaWJ1dGUoJ2xvY2F0aW9uJywgdmFsLnRvTG93ZXJDYXNlKCkpOyB9XG4gICAgICAgIH0sXG4gICAgICAgIHVuaXRzOiB7XG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZSgndW5pdHMnKS50b0xvd2VyQ2FzZSgpOyB9LFxuICAgICAgICAgICAgc2V0KHZhbCkgeyB0aGlzLnNldEF0dHJpYnV0ZSgndW5pdHMnLCB2YWwudG9Mb3dlckNhc2UoKSk7IH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG53ZWF0aGVyUHJvdG8uY3JlYXRlZENhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xuICAgIGxldCB0ZW1wbGF0ZSA9IGN1cnJEb2MucXVlcnlTZWxlY3RvcignI3dlYXRoZXItbm93JykuY29udGVudCxcbiAgICAgICAgc2hhZG93Um9vdCA9IHRoaXMuY3JlYXRlU2hhZG93Um9vdCgpO1xuXG4gICAgZ2V0V2VhdGhlcih0aGlzLmxvY2F0aW9uLCB0aGlzLnVuaXRzKS50aGVuKCBkYXRhID0+IHtcblxuICAgICAgICAvL1wicmVuZGVyXCIgdGhlIGRhdGEgaW50byB0aGUgdGVtcGxhdGVcbiAgICAgICAgcmVuZGVyKGRhdGEsIHRlbXBsYXRlKTtcblxuICAgICAgICAvL2F0dGFjaCB0aGUgdGVtcGxhdGUgZnJhZ21lbnQgdG8gdGhlIHNoYWRvdyByb290IG9uY2UgcmVuZGVyZWRcbiAgICAgICAgc2hhZG93Um9vdC5hcHBlbmRDaGlsZChkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLCB0cnVlKSk7XG4gICAgfSk7XG59XG5cbndlYXRoZXJQcm90by5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sgPSBmdW5jdGlvbiAoYXR0ciwgcHJldiwgY3Vycikge1xuICAgIGdldFdlYXRoZXIodGhpcy5sb2NhdGlvbiwgdGhpcy51bml0cykudGhlbihkYXRhID0+IHJlbmRlcihkYXRhLCB0aGlzLnNoYWRvd1Jvb3QpKTtcbn07XG5cbmxldCBXZWF0aGVyID0gZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCd3ZWF0aGVyLW5vdycsIHtwcm90b3R5cGU6IHdlYXRoZXJQcm90byB9KTtcbiJdfQ==
