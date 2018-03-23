<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
      <h1>Dispositivos</h1>
        <br>
        <v-list two-line style="width: 100%">
          <template v-for="(device) in devices">
            <v-subheader v-if="device.header" :key="device.header">{{ device.header }}</v-subheader>
            <v-list-tile avatar :key="device.name">
              <v-list-tile-avatar>
                <img v-if="device.photo" :src="device.photo">
                <img v-else src="@/assets/device.svg">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-html="device.name"></v-list-tile-title>
                <v-menu bottom>
                  <v-btn icon slot="activator">
                    <v-icon>more_vert</v-icon>
                    <!-- : -->
                  </v-btn>
                  <v-list>
                    <v-list-tile>
                      <v-list-tile-title v-if="!device.enable" @click="enable(device.mac)">Ativar</v-list-tile-title>
                      <v-list-tile-title v-else @click="disable(device.mac)">Desativar</v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-menu>
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
  name: 'Devices',
  data () {
    return {
      title: 'Devices',
      devices: []
    }
  },
  methods: {
    findAll () {
      this.$http.get('http://localhost:3000/devices/').then(response => {
        this.devices = response.data
      }, response => {
        console.log('Erro ao buscar devices: ' + response)
      })
    },
    enable(mac){
      this.$http.get('http://localhost:3000/devices/enable/' + mac).then(response => {
        this.findAll();
      }, response => {
        console.log('Erro ao ativar dispositivo: ' + response)
      })
    },
    disable(mac){
      this.$http.get('http://localhost:3000/devices/disable/' + mac).then(response => {
        this.findAll();
      }, response => {
        console.log('Erro ao desativar dispositivo: ' + response)
      })
    }
  },
  mounted () {
    this.findAll()
  }
}
</script>
