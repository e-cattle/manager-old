<template>
    <v-layout v-if="loadingPage">
        <v-progress-linear :indeterminate="true"></v-progress-linear>
    </v-layout>
  <v-layout v-else column justify-center>
    <v-flex xs12 v-show="error.show">
      <v-alert color="error" dismissible v-model="error.show" :icon="error.icon">
        {{error.message}}
      </v-alert>
    </v-flex>
    <v-flex>
      <h1 class="text-xs-center headline">Dispositivos</h1>
      <br>
      <h2 class="text-xs-center subheading" v-if="!devices || devices.length<=0">Não há dispositivos registrados no momento.</h2>
       <v-list v-if="devices && devices.length>0">
          <template v-for="(item, i) in devices">
            <!-- <v-subheader v-if="item.header" :key="item.header">{{ item.header }}</v-subheader>
            <v-divider v-else-if="item.divider" :inset="item.inset" :key="index"></v-divider> -->
            <v-list-tile avatar :key="item.name">
              <v-list-tile-avatar>
                <img v-if="item.enable" src="@/assets/device.svg" style="border-radius: 0%;">
                <img v-else src="@/assets/device-disabled.svg" style="border-radius: 0%;">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-html="item.name"></v-list-tile-title>
                <v-list-tile-sub-title v-html="item.enable ? 'Ativo' : 'Inativo'"></v-list-tile-sub-title>
              </v-list-tile-content>
              <v-menu bottom>
                <v-btn icon slot="activator" dark>
                  <v-icon>more_vert</v-icon>
                </v-btn>
                <v-list>
                  <v-list-tile v-if="item.enable" @click="disable(item.mac)">
                    <v-list-tile-title>Desativar</v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile v-else @click="enable(item.mac)">
                    <v-list-tile-title>Ativar</v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile @click.stop="showDevice(i)">
                    <v-list-tile-title>Detalhes</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </v-list-tile>
          </template>
        </v-list>
        <template>
  <div>
    <v-layout row justify-center>
      <v-dialog
        v-model="dialog"
        fullscreen
        transition="dialog-bottom-transition"
        :overlay="false"
        scrollable
      >
        <v-card tile>
          <v-toolbar card dark>
            <v-btn icon @click.native="dialog = false" dark>
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title v-html="deviceToShow.name"></v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu bottom right offset-y>
              <v-btn slot="activator" dark icon>
                <v-icon>more_vert</v-icon>
              </v-btn>
              <v-list>
                 <v-list-tile v-if="deviceToShow.enable" @click="disable(deviceToShow.mac)">
                    <v-list-tile-title>Desativar</v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile v-else @click="enable(deviceToShow.mac)">
                    <v-list-tile-title>Ativar</v-list-tile-title>
                  </v-list-tile>
              </v-list>
            </v-menu>
          </v-toolbar>
          <v-card-text>
            <!-- <v-tooltip right>
              <v-btn slot="activator">Tool Tip Activator</v-btn>
              Tool Tip
            </v-tooltip> -->
            <v-list three-line subheader>
              <v-subheader>Detalhes do dispositivo</v-subheader>
              <v-list-tile avatar>
                <v-list-tile-content>
                  <v-list-tile-title>Versão: {{deviceToShow.version}}</v-list-tile-title>
                  <v-list-tile-title>MAC: {{deviceToShow.mac}}</v-list-tile-title>
                  <v-list-tile-title>Status: {{deviceToShow.enable ? 'Ativo' : 'Inativo'}}</v-list-tile-title>
                  <v-list-tile-title>Última sincronização: {{deviceToShow.syncedAt ? deviceToShow.syncedAt : 'Ainda não sincronizado'}}</v-list-tile-title>
                  <!-- <v-list-tile-sub-title>Set the content filtering level to restrict apps that can be downloaded</v-list-tile-sub-title> -->
                </v-list-tile-content>
              </v-list-tile>
              <v-subheader>Sensores</v-subheader>
              <v-list-tile avatar v-for="(sensor) in deviceToShow.sensors" :key="sensor._id">
                <v-list-tile-content>
                  <v-list-tile-title>Tipo: {{sensor.type}}</v-list-tile-title>
                  <v-list-tile-sub-title>
                    Descrição: {{sensor.descriptor}}
                  </v-list-tile-sub-title>
                  <v-list-tile-sub-title>
                    Unix: {{sensor.unix}}
                  </v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-divider></v-divider>
          </v-card-text>

          <div style="flex: 1 1 auto;"/>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>
    </v-flex>
  </v-layout>
</template>

<style scoped>
  img {
    margin-left: auto;
    margin-right: auto;
    display: block;
  }
</style>

<script>
export default {
  name: 'Devices',
  data () {
    return {
        error: {show: false, message: "", icon: ""},
        loadingPage: true,
        apiProtocol: "",
        apiAddress: "",
        macaddress: "",
        registerStatus: "",
        registerEnabled: "",
        title: 'Devices',
        devices: [],
        deviceToShow: {},
        dialog: false,
        dialogMenuItens: [
            {
            title: 'Desativar'
            }
        ]
    }
  },
  methods: {
    showError(errors, icon){
      this.error = {show: true, message: errors, icon: icon}
    },
    hideError(){
      this.error = {show: false, message: "", icon: ""}
    },
    findAll () {
      this.$http.get('http://localhost:3000/devices/').then(response => {
        this.devices = response.data
      }, response => {
        console.log('Erro ao buscar devices: ' + response)
      })
    },
    showDevice (i) {
      this.deviceToShow = this.devices[i]
      this.dialog = true
    },
    enable (mac) {
      this.$http.get('http://localhost:3000/devices/enable/' + mac).then(response => {
        this.findAll()
        if(this.deviceToShow) this.deviceToShow.enable = true;
      }, response => {
        console.log('Erro ao ativar dispositivo: ' + response)
      })
    },
    disable (mac) {
      this.$http.get('http://localhost:3000/devices/disable/' + mac).then(response => {
        this.findAll()
        if(this.deviceToShow) this.deviceToShow.enable = false;
      }, response => {
        console.log('Erro ao desativar dispositivo: ' + response)
      })
    },
    getMacAddress(){
        this.$http.get(this.$store.kernelHost + 'info/macaddress').then(response => {
            this.macaddress = response.data.mac
            this.getRegisterStatus()
        }, response => {
            this.macaddress = "";
        })
    },
    getRegisterStatus(){
        this.$http.get(this.apiProtocol + this.apiAddress + 'devices-kernel/status/' + this.macaddress).then(response => {
            if(response.data.enable){ 
                this.registerStatus = "Registrado"
                this.registerEnabled = true
            }
            else this.registerStatus = "Solicitação em andamento"
        }, response => {
            this.registerStatus = "Solicitação não realizada"
        })
    },
    isKernelOnline(){
        this.$http.get(this.$store.kernelHost + 'info/is-online').then(response => {
            this.isOnline = response.data.isOnline
            this.loadingPage = false
            if(!this.isOnline) this.showError('Este dispositivo não possui conexão com a internet.', 'mdi-alert')
            else this.findAll()
        }, response => {
            this.loadingPage = false
            this.showError('Este dispositivo não possui conexão com a internet.', 'mdi-alert')
        })
    },
  },
    mounted () {
        this.apiProtocol = this.$localStorage.get('apiProtocol')
        this.apiAddress = this.$localStorage.get('apiAddress')
        this.isKernelOnline()
    }
}
</script>