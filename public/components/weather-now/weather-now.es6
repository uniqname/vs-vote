let currDoc = document.currentScript.ownerDocument,

    //Maps to pleasant icons for weather status.
    iconBase = `//uxrepo.com/static/icon-sets/meteo/svg/`,
    weatherMap = {
        clear: `${iconBase}sun.svg`,
        rain:  `${iconBase}rain.svg`,
        'partly cloudy': `${iconBase}cloud-sun.svg`,
        'mostly cloudy':`${iconBase}cloud-sun-inv.svg`,
        'overcast': `${iconBase}clouds.svg`,
        windy: `${iconBase}windy.svg`
    },

    //utilities to work quciker on nodeLists
    qsa = (sel, root) => [].slice.call(root.querySelectorAll(sel)),

    textMapper = text => node => node.textContent = text,

    srcMapper = url => node => node.src = url,

    // updates the shadow DOM with the information passed in.
    render = (data, frag) => {

        qsa('.location', frag).map(textMapper(data.display_location.full));

        qsa('.icon img', frag).map(srcMapper(weatherMap[data.weather.toLowerCase()] || data.image.url));

        qsa('.weather-description', frag).map(textMapper(data.weather));

        qsa('.wind', frag).map(textMapper(data.wind_string));

        //we set temp to the number of degrees in the preferred unit before
        //getting to render as we won't have that context within render
        qsa('.degs', frag).map(textMapper(data.temp));
        qsa('.unit', frag).map(textMapper(data.units));
    },

    getWeather = (location, units) => {
        var loc = location.split(/,\s*/).map( item => item.replace(' ', '_'));
        return fetch(`//api.wunderground.com/api/42db3c360babe4e5/conditions/q/${loc[1]}/${loc[0]}.json`).then(resp => resp.json()).then( data => {
            data = data.current_observation;

            if ( !data ) {
                data = {
                    display_location: {
                        full: `Could not find weather information for ${location}`
                    },
                    temp_f: '?',
                    temp_c: '?',
                    weather: '',
                    image: { url: '' },
                    wind_string: ''
                };
            }

            data.temp = (units === 'f') ? data.temp_f : data.temp_c;
            data.units = units.toUpperCase();

            return data;
        });
    },

    weatherProto = Object.create(HTMLElement.prototype, {
        location: {
            get() { return this.getAttribute('location').toLowerCase(); },
            set(val) { this.setAttribute('location', val.toLowerCase()); }
        },
        units: {
            get() { return this.getAttribute('units').toLowerCase(); },
            set(val) { this.setAttribute('units', val.toLowerCase()); }
        }
    });

weatherProto.createdCallback = function () {
    let template = currDoc.querySelector('#weather-now').content,
        shadowRoot = this.createShadowRoot();

    getWeather(this.location, this.units).then( data => {

        //"render" the data into the template
        render(data, template);

        //attach the template fragment to the shadow root once rendered
        shadowRoot.appendChild(document.importNode(template, true));
    });
}

weatherProto.attributeChangedCallback = function (attr, prev, curr) {
    getWeather(this.location, this.units).then(data => render(data, this.shadowRoot));
};

let Weather = document.registerElement('weather-now', {prototype: weatherProto });
