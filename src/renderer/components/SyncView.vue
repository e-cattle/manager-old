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
      <h1 class="text-xs-center headline">Sincronização</h1>
      <br>
      <v-flex class="text-xs-center">
        <v-btn flat icon :class="{sync: isSyncing}" @click="sync()">
          <v-icon x-large>sync</v-icon>
        </v-btn>
        <br>
        <br>
        <p v-html="message"></p>
      </v-flex>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data () {
    return {
      error: {show: false, message: "", icon: ""},
      isOnline: false,
      loadingPage: true,
      apiProtocol: "",
      apiAddress: "",
      macaddress: "",
      registerStatus: "",
      registerEnabled: "",
      message: '',
      kernel: {},
      isKernelComplete: false,
      isSyncing: false
    }
  },
  methods: {
    showError(errors, icon){
      this.error = {show: true, message: errors, icon: icon}
    },
    hideError(){
      this.error = {show: false, message: "", icon: ""}
    },

    //Recupera MAC da API-Kernel
    async getMacAddress(){
      return await this.$http.get(this.$store.kernelHost + 'info/macaddress')
    },

    //Faz Sincronismo dos Devices com API-Application
    async syncDevices(){ 
      this.message += "Fazendo backup dos dispositivos...<br>"          
      try{
        //Todos dispositivos não sincronizados
        let response = await this.$http.get(this.$store.kernelHost + 'devices/sync')
        if(!response.data) {
          return this.message += "Falha ao sincronizar dispositivos<br>" 
        }else{
          return this.message += "Dispositivos sincronizados<br>" 
          return;
        }
      } catch(err) {
          this.message += "Erro ao sincronizar dispositivos";
          throw err;
      }
    },

    async syncMeasures(){
      this.message += "Fazendo backup dos dados sensoriais...<br>"          
      try{
        let response = await this.$http.get(this.$store.kernelHost + 'measures/sync')
        if(!response.data) {
          return this.message += "Falha ao sincronizar dados sensoriais" 
        }else{
          let sensors = response.data;
          if(sensors.length <= 0) { this.message += "Todos os dados sensoriais sincronizados.<br>"; this.isSyncing = false }
          for (let i = 0; i < sensors.length; i++) {
            let sensor = sensors[i];
            sensor.kernelMac = this.macaddress;
            this.message += `Enviando dados sensoriais de <strong>${sensor.name}</strong> para nuvem...<br>`
            let response = await this.$http.post(`${this.apiProtocol}${this.apiAddress}measures-sync/`, { token: this.token, sensors: [sensor], kernelMac: this.macaddress })
            await this.$http.post(`${this.$store.kernelHost}measures/synced/`, { sensors: [sensor] })
          }
          return;
        }
      } catch(err) {
        if(String(err).indexOf("401") >= -1) this.message += "Token inválido. Por favor renove seu token em <strong>Configuração</strong>"
        else this.message += "Erro ao sincronizar dados sensoriais."
        throw err
      }
    },

    async isKernelOnline(){
      try{
        let response = await this.$http.get(this.$store.kernelHost + 'info/is-online')
        this.isOnline = response.data.isOnline
        this.loadingPage = false
        if(!this.isOnline) this.showError('Este dispositivo não possui conexão com a internet.', 'mdi-alert')
      }catch (err){
        this.loadingPage = false
        this.showError('Este dispositivo não possui conexão com a internet.', 'mdi-alert')
      }
    },

    async sync () {
      this.isSyncing = true
      this.message = 'Conectando com a nuvem...<br>'
      try{
        let response = await this.getMacAddress()
        this.macaddress = response.data.mac
        await this.getKernelConfigs();
        await this.getRegisterStatus()
        await this.syncDevices()
        // await this.syncMeasures()
        this.isSyncing = false;
        this.message += "Todos os dados sincronizados"
      }catch(e){
        throw e
      }
    },

    async getKernelConfigs(){
        let response = await this.$http.get(this.$store.kernelHost + 'info/config')
        let result = response.data;

        if(!result) this.message += 'Falha ao carregar configurações do Bigbox.';

        if(!result.config && result.err){
          this.message += 'O Bigbox pode estar sendo iniciado pela primeira vez agora. Por favor, preencha os Dados do Kernel e do Endereço da Nuvem';
        }else{
          this.kernel = result.config;
          if(!this.kernel.apiAddress || !this.kernel.apiAddressProtocol)
            this.message += 'Os dados do Endereço da Nuvem não estão completos. Por favor, complete-os';
          else this.isKernelComplete = true;
        }
      },

    async getRegisterStatus(){
      try {
        let response = await this.$http.get(this.kernel.apiAddressProtocol + this.kernel.apiAddress + 'devices-kernel/status/' + this.macaddress)
        if(response.data.enable) {
          this.registerStatus = "Registrado"
          this.registerEnabled = true
          this.message += "Conxão estabelecida.<br>"            
          return;
        }
        else {
          this.message = "Conxão falhou. Este dispositivo não está homologado na nuvem."
          this.isSyncing = false;
          throw "Dispositivo não homologado na nuvem"
        }
      } catch (error) {
        this.registerStatus = "Solicitação não realizada"
        this.message = "Conxão falhou.A nuvem pode estar temporariamente indisponível ou este dispositivo não está registrado."
        this.isSyncing = false;
        throw "Dispositivo não encontrado na nuvem"
      }
    }
  },
  mounted () {
    this.apiProtocol = this.$localStorage.get('apiProtocol')
    this.apiAddress = this.$localStorage.get('apiAddress')
    this.token = this.$localStorage.get('token')
    this.isKernelOnline();
  }
}
</script>

<style scoped>
  img {
    margin-left: auto;
    margin-right: auto;
    display: block;
  }
  .sync{
    animation: sync-animation;
    animation-duration: 1.5s;
    animation-iteration-count: infinite;
  }
  @keyframes sync-animation {
    0% { transform: rotate(0deg)}
    75% { transform: rotate(360deg)}
    100% { transform: rotate(360deg)}
  }
</style>