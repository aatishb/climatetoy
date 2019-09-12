// Defines a Vue <p5> Component

Vue.component('p5', {

  template: '<div></div>',

  props: ['src','data'],

  methods: {
    // loadScript from https://stackoverflow.com/a/950146
    // loads the p5 javscript code from a file
    loadScript: function (url, callback)
    {
      // Adding the script tag to the head as suggested before
      var head = document.head;
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = url;

      // Then bind the event to the callback function.
      // There are several events for cross browser compatibility.
      script.onreadystatechange = callback;
      script.onload = callback;

      // Fire the loading
      head.appendChild(script);
    },

    loadSketch: function() {
      this.myp5 = new p5(sketch(this));
    }
  },

  data: function() {
    return {
      myp5: {}
    }
  },

  mounted() {
    this.loadScript(this.src, this.loadSketch);
  },

  watch: {
    data: {
      handler: function(val, oldVal) {
        if(this.myp5.dataChanged) {
          this.myp5.dataChanged(val, oldVal);
        }
      },
      deep: true
    }
  }

})

Vue.component('graph', {

  props: {

    planets: {
      default: () => ([]),
      type: Array
    },

    maxtemp: {
      default: 750,
      type: Number
    },

    e: {
      default: 1,
      type: Number
    },

    solarflux: {
      default: 0,
      type: Number
    },

  },

  template: '<div ref="graph" class="graph"></div>',

  data:  function() {
    return {

      sigma: 5.67 * Math.pow(10, -8),

      layout:  {

        title: {
            text:'Planetary Heat Curve',
          },

        xaxis: {
          title: {
            text: 'Average Temperature of Planet (K)'
          },
          //range: [0, this.maxtemp]
        },

        yaxis: {
          title: {
            text: 'Outgoing Heat Flow (W/m²)'
          },
          //range: [0, this.maxheat]
        },

        hovermode: 'closest',

      }

    }
  },

  methods: {

    makeGraph: function () {
      Plotly.newPlot(this.$refs.graph, this.plotData, this.layout);
    }

  },

  mounted() {
    this.makeGraph();
  },


  computed: {
    plotData: function() {
      return [this.solarcurve, this.heatcurve, this.planetdata];
    },

    temp: function() {
      return [...Array(this.maxtemp * 10).keys()].map(e => e/10);
    },

    maxheat: function() {
      return this.sigma * Math.pow(this.maxtemp, 4);
    },

    solarcurve: function() {
      return {
        name: 'Solar',
        x: this.solarflux > 0 ? this.temp : [],
        y: this.solarflux > 0 ? this.temp.map(e => this.solarflux) : [],
        showlegend: false,
        hovertemplate: 'Incoming Solar Energy Flow: %{y:.1f} W/m²',
        line: {
          color: 'rgb(255, 190, 137)',
          width: 4
        },
      }
    },

    heatcurve: function() {
      return {
        name: 'Heat',
        x: this.temp,
        y: this.temp.map(T => this.e * this.sigma * Math.pow(T, 4)),
        showlegend: false,
        hovertemplate: 'Temperature: %{x} K'
                       + '<br>Outgoing Heat Flow: %{y:.1f} W/m²',
        line: {
          color: 'rgb(202, 124, 152)',
          width: 4
        },

      }
    },

    planetdata: function() {

      return {
        name: 'Planets',
        x: this.planets.filter(e => e.T <= this.maxtemp).map(e => e.T),
        y: this.planets.filter(e => e.T <= this.maxtemp).map(e => e.solarflux),
        text: this.planets.filter(e => e.T <= this.maxtemp).map(e => e.name),
        mode: 'markers+text',
        textposition: 'top',
        type: 'scatter',
        marker: {
          color: 'rgb(141, 92, 131)',
          size: 10
        },
        showlegend: false,
        hovertemplate: '<b>%{text}</b>'
                       + '<br>Temperature: %{x} K'
                       + '<br><i>Incoming Solar Energy Flow</i>: %{y:.1f} W/m²',
      };
    }


  },

  watch: {
    e: function() {
      this.makeGraph();
    }

  }

})




let app = new Vue({

  el: '#root',

  data: {
    e: 1,

    marstemp: 0,

    earthtemp: 0,

    ecs: 0,

    planets: [
      {
        name: 'Earth',
        T: 288,  // https://nssdc.gsfc.nasa.gov/planetary/factsheet/index.html
        solarflux: 240 // https://en.wikipedia.org/wiki/File:The-NASA-Earth%27s-Energy-Budget-Poster-Radiant-Energy-System-satellite-infrared-radiation-fluxes.jpg
      },
      {
        name: 'Mars',
        T: 210, // https://nssdc.gsfc.nasa.gov/planetary/factsheet/index.html
        solarflux: 110 // (irradiance * (1 - bond albedo))/4
      },
    ]
  },

  methods: {
  },

  computed: {
  }

})



