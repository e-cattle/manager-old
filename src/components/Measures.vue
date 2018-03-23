<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
      <h1>Medidas</h1>
        <br>
        <v-list two-line style="width: 100%">
          <template v-for="(measure) in measures">
            <v-list-tile avatar :key="measure._id">
              <v-list-tile-avatar>
                <img src="@/assets/measure.svg">
              </v-list-tile-avatar>
              <v-list-tile-content style="overflow-y: scroll;">
                <v-list-tile-title v-html="measure.name"></v-list-tile-title>
                  <v-flex xs12>
                    <v-expansion-panel popout>
                      <v-expansion-panel-content v-for="(sensor) in measure.sensors" :key="sensor._id">
                        <div slot="header">{{sensor.type}}</div>
                        <v-card>
                          <v-card-text>{{sensor}}</v-card-text>
                        </v-card>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-flex>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

<script>

export default {
  name: 'Measures',
  data () {
    return {
      title: 'Measures',
      measures: []
    }
  },
  methods: {
    findAll () {
      this.$http.get('http://localhost:3000/measures/').then(response => {
        this.measures = response.data
      }, response => {
        console.log('Erro ao buscar measures: ' + response)
      })
    }
  },
  mounted () {
    this.findAll()
  }
}
</script>
