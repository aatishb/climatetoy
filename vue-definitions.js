// custom graph component
Vue.component('graph', {

  props: {

   maxtemp: {
      default: 750,
      type: Number
    },

    e: {
      default: 1,
      type: Number
    },

    solarflux: {
      default: () => ([]),
      type: Array
    },

    showplanets: {
      default: false,
      type: Boolean
    }

  },

  template: '<div ref="graph" class="graph"></div>',

  data:  function() {
    return {

      sigma: 5.67 * Math.pow(10, -8),

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
      ],


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

    // draws the graph
    makeGraph: function () {
      Plotly.newPlot(this.$refs.graph, this.plotData, this.layout);
    },

    solarcurve: function(planet) {

      let solarflux = this.planets.filter(e => e.name == planet)[0].solarflux;

      return {
        name: 'Solar',
        x: this.temp ,
        y: this.temp.map(e => solarflux),
        showlegend: false,
        hovertemplate: 'Incoming Solar Energy Flow: %{y:.1f} W/m²',
        line: {
          color: 'rgb(255, 190, 137)',
          width: 4
        },
      }
    },

  },

  mounted() {
    this.makeGraph();
  },


  computed: {
    // computes plot traces
    plotData: function() {

      let plots = [];

      for(let planet of this.solarflux) {
        plots.push(this.solarcurve(planet));
      }

      plots.push(this.heatcurve);

      if(this.showplanets) {
        plots.push(this.planetdata);
      }

      return plots;
    },

    temp: function() {
      return [...Array(this.maxtemp * 10).keys()].map(e => e/10);
    },

    maxheat: function() {
      return this.sigma * Math.pow(this.maxtemp, 4);
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

  // recreate graph when e changes
  watch: {
    e: function() {
      this.makeGraph();
    }

  }

})

// global data
let app = new Vue({

  el: '#root',

  data: {
    e: 1,
    marstemp: 0,
    earthtemp: 0,
    ecs: 0
  }

})
