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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvdnMtdm90ZS9wdWJsaWMvY29tcG9uZW50cy93ZWF0aGVyLW5vdy93ZWF0aGVyLW5vdy5lczYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsYUFBYTs7O0FBRzlDLFFBQVEsNkNBQTZDO0lBQ3JELFVBQVUsR0FBRztBQUNULFNBQUssRUFBSyxRQUFRLFlBQVM7QUFDM0IsUUFBSSxFQUFNLFFBQVEsYUFBVTtBQUM1QixtQkFBZSxFQUFLLFFBQVEsa0JBQWU7QUFDM0MsbUJBQWUsRUFBSSxRQUFRLHNCQUFtQjtBQUM5QyxjQUFVLEVBQUssUUFBUSxlQUFZO0FBQ25DLFNBQUssRUFBSyxRQUFRLGNBQVc7Q0FDaEM7OztBQUdELEdBQUcsR0FBRyxTQUFOLEdBQUcsQ0FBSSxHQUFHLEVBQUUsSUFBSTtXQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztDQUFBO0lBRTlELFVBQVUsR0FBRyxTQUFiLFVBQVUsQ0FBRyxJQUFJO1dBQUksVUFBQSxJQUFJO2VBQUksSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJO0tBQUE7Q0FBQTtJQUVwRCxTQUFTLEdBQUcsU0FBWixTQUFTLENBQUcsR0FBRztXQUFJLFVBQUEsSUFBSTtlQUFJLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRztLQUFBO0NBQUE7OztBQUd6QyxNQUFNLEdBQUcsU0FBVCxNQUFNLENBQUksSUFBSSxFQUFFLElBQUksRUFBSzs7QUFFckIsT0FBRyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FB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QyxDQUFDO1NBQUU7S0FDOUQ7Q0FDSixDQUFDLENBQUM7O0FBRVAsWUFBWSxDQUFDLGVBQWUsR0FBRyxZQUFZO0FBQ3ZDLFFBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUMsT0FBTztRQUN4RCxVQUFVLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7O0FBRXpDLGNBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUUsVUFBQSxJQUFJLEVBQUk7OztBQUdoRCxjQUFNLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDOzs7QUFHdkIsa0JBQVUsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztLQUMvRCxDQUFDLENBQUM7Q0FDTixDQUFBOztBQUVELFlBQVksQ0FBQyx3QkFBd0IsR0FBRyxVQUFVLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFOzs7QUFDaEUsY0FBVSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLElBQUk7ZUFBSSxNQUFNLENBQUMsSUFBSSxFQUFFLE1BQUssVUFBVSxDQUFDO0tBQUEsQ0FBQyxDQUFDO0NBQ3JGLENBQUM7O0FBRUYsSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxhQUFhLEVBQUUsRUFBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJsZXQgY3VyckRvYyA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQub3duZXJEb2N1bWVudCxcblxuICAgIC8vTWFwcyB0byBwbGVhc2FudCBpY29ucyBmb3Igd2VhdGhlciBzdGF0dXMuXG4gICAgaWNvbkJhc2UgPSBgLy91eHJlcG8uY29tL3N0YXRpYy9pY29uLXNldHMvbWV0ZW8vc3ZnL2AsXG4gICAgd2VhdGhlck1hcCA9IHtcbiAgICAgICAgY2xlYXI6IGAke2ljb25CYXNlfXN1bi5zdmdgLFxuICAgICAgICByYWluOiAgYCR7aWNvbkJhc2V9cmFpbi5zdmdgLFxuICAgICAgICAncGFydGx5IGNsb3VkeSc6IGAke2ljb25CYXNlfWNsb3VkLXN1bi5zdmdgLFxuICAgICAgICAnbW9zdGx5IGNsb3VkeSc6YCR7aWNvbkJhc2V9Y2xvdWQtc3VuLWludi5zdmdgLFxuICAgICAgICAnb3ZlcmNhc3QnOiBgJHtpY29uQmFzZX1jbG91ZHMuc3ZnYCxcbiAgICAgICAgd2luZHk6IGAke2ljb25CYXNlfXdpbmR5LnN2Z2BcbiAgICB9LFxuXG4gICAgLy91dGlsaXRpZXMgdG8gd29yayBxdWNpa2VyIG9uIG5vZGVMaXN0c1xuICAgIHFzYSA9IChzZWwsIHJvb3QpID0+IFtdLnNsaWNlLmNhbGwocm9vdC5xdWVyeVNlbGVjdG9yQWxsKHNlbCkpLFxuXG4gICAgdGV4dE1hcHBlciA9IHRleHQgPT4gbm9kZSA9PiBub2RlLnRleHRDb250ZW50ID0gdGV4dCxcblxuICAgIHNyY01hcHBlciA9IHVybCA9PiBub2RlID0+IG5vZGUuc3JjID0gdXJsLFxuXG4gICAgLy8gdXBkYXRlcyB0aGUgc2hhZG93IERPTSB3aXRoIHRoZSBpbmZvcm1hdGlvbiBwYXNzZWQgaW4uXG4gICAgcmVuZGVyID0gKGRhdGEsIGZyYWcpID0+IHtcblxuICAgICAgICBxc2EoJy5sb2NhdGlvbicsIGZyYWcpLm1hcCh0ZXh0TWFwcGVyKGRhdGEuZGlzcGxheV9sb2NhdGlvbi5mdWxsKSk7XG5cbiAgICAgICAgcXNhKCcuaWNvbiBpbWcnLCBmcmFnKS5tYXAoc3JjTWFwcGVyKHdlYXRoZXJNYXBbZGF0YS53ZWF0aGVyLnRvTG93ZXJDYXNlKCldIHx8IGRhdGEuaW1hZ2UudXJsKSk7XG5cbiAgICAgICAgcXNhKCcud2VhdGhlci1kZXNjcmlwdGlvbicsIGZyYWcpLm1hcCh0ZXh0TWFwcGVyKGRhdGEud2VhdGhlcikpO1xuXG4gICAgICAgIHFzYSgnLndpbmQnLCBmcmFnKS5tYXAodGV4dE1hcHBlcihkYXRhLndpbmRfc3RyaW5nKSk7XG5cbiAgICAgICAgLy93ZSBzZXQgdGVtcCB0byB0aGUgbnVtYmVyIG9mIGRlZ3JlZXMgaW4gdGhlIHByZWZlcnJlZCB1bml0IGJlZm9yZVxuICAgICAgICAvL2dldHRpbmcgdG8gcmVuZGVyIGFzIHdlIHdvbid0IGhhdmUgdGhhdCBjb250ZXh0IHdpdGhpbiByZW5kZXJcbiAgICAgICAgcXNhKCcuZGVncycsIGZyYWcpLm1hcCh0ZXh0TWFwcGVyKGRhdGEudGVtcCkpO1xuICAgICAgICBxc2EoJy51bml0JywgZnJhZykubWFwKHRleHRNYXBwZXIoZGF0YS51bml0cykpO1xuICAgIH0sXG5cbiAgICBnZXRXZWF0aGVyID0gKGxvY2F0aW9uLCB1bml0cykgPT4ge1xuICAgICAgICB2YXIgbG9jID0gbG9jYXRpb24uc3BsaXQoLyxcXHMqLykubWFwKCBpdGVtID0+IGl0ZW0ucmVwbGFjZSgnICcsICdfJykpO1xuICAgICAgICByZXR1cm4gZmV0Y2goYC8vYXBpLnd1bmRlcmdyb3VuZC5jb20vYXBpLzQyZGIzYzM2MGJhYmU0ZTUvY29uZGl0aW9ucy9xLyR7bG9jWzFdfS8ke2xvY1swXX0uanNvbmApLnRoZW4ocmVzcCA9PiByZXNwLmpzb24oKSkudGhlbiggZGF0YSA9PiB7XG4gICAgICAgICAgICBkYXRhID0gZGF0YS5jdXJyZW50X29ic2VydmF0aW9uO1xuXG4gICAgICAgICAgICBpZiAoICFkYXRhICkge1xuICAgICAgICAgICAgICAgIGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXlfbG9jYXRpb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGw6IGBDb3VsZCBub3QgZmluZCB3ZWF0aGVyIGluZm9ybWF0aW9uIGZvciAke2xvY2F0aW9ufWBcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgdGVtcF9mOiAnPycsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBfYzogJz8nLFxuICAgICAgICAgICAgICAgICAgICB3ZWF0aGVyOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2U6IHsgdXJsOiAnJyB9LFxuICAgICAgICAgICAgICAgICAgICB3aW5kX3N0cmluZzogJydcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkYXRhLnRlbXAgPSAodW5pdHMgPT09ICdmJykgPyBkYXRhLnRlbXBfZiA6IGRhdGEudGVtcF9jO1xuICAgICAgICAgICAgZGF0YS51bml0cyA9IHVuaXRzLnRvVXBwZXJDYXNlKCk7XG5cbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgd2VhdGhlclByb3RvID0gT2JqZWN0LmNyZWF0ZShIVE1MRWxlbWVudC5wcm90b3R5cGUsIHtcbiAgICAgICAgbG9jYXRpb246IHtcbiAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKCdsb2NhdGlvbicpLnRvTG93ZXJDYXNlKCk7IH0sXG4gICAgICAgICAgICBzZXQodmFsKSB7IHRoaXMuc2V0QXR0cmlidXRlKCdsb2NhdGlvbicsIHZhbC50b0xvd2VyQ2FzZSgpKTsgfVxuICAgICAgICB9LFxuICAgICAgICB1bml0czoge1xuICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoJ3VuaXRzJykudG9Mb3dlckNhc2UoKTsgfSxcbiAgICAgICAgICAgIHNldCh2YWwpIHsgdGhpcy5zZXRBdHRyaWJ1dGUoJ3VuaXRzJywgdmFsLnRvTG93ZXJDYXNlKCkpOyB9XG4gICAgICAgIH1cbiAgICB9KTtcblxud2VhdGhlclByb3RvLmNyZWF0ZWRDYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgdGVtcGxhdGUgPSBjdXJyRG9jLnF1ZXJ5U2VsZWN0b3IoJyN3ZWF0aGVyLW5vdycpLmNvbnRlbnQsXG4gICAgICAgIHNoYWRvd1Jvb3QgPSB0aGlzLmNyZWF0ZVNoYWRvd1Jvb3QoKTtcblxuICAgIGdldFdlYXRoZXIodGhpcy5sb2NhdGlvbiwgdGhpcy51bml0cykudGhlbiggZGF0YSA9PiB7XG5cbiAgICAgICAgLy9cInJlbmRlclwiIHRoZSBkYXRhIGludG8gdGhlIHRlbXBsYXRlXG4gICAgICAgIHJlbmRlcihkYXRhLCB0ZW1wbGF0ZSk7XG5cbiAgICAgICAgLy9hdHRhY2ggdGhlIHRlbXBsYXRlIGZyYWdtZW50IHRvIHRoZSBzaGFkb3cgcm9vdCBvbmNlIHJlbmRlcmVkXG4gICAgICAgIHNoYWRvd1Jvb3QuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZSwgdHJ1ZSkpO1xuICAgIH0pO1xufVxuXG53ZWF0aGVyUHJvdG8uYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrID0gZnVuY3Rpb24gKGF0dHIsIHByZXYsIGN1cnIpIHtcbiAgICBnZXRXZWF0aGVyKHRoaXMubG9jYXRpb24sIHRoaXMudW5pdHMpLnRoZW4oZGF0YSA9PiByZW5kZXIoZGF0YSwgdGhpcy5zaGFkb3dSb290KSk7XG59O1xuXG5sZXQgV2VhdGhlciA9IGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnd2VhdGhlci1ub3cnLCB7cHJvdG90eXBlOiB3ZWF0aGVyUHJvdG8gfSk7XG4iXX0=
