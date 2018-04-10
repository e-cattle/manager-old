<template>
  <v-layout v-if="loadingPage">
    <v-progress-linear :indeterminate="true"></v-progress-linear>
  </v-layout>
  <v-layout v-else row wrap justify-center id="wrapper">
    <v-flex xs12 v-show="error.show">
      <v-alert color="error" dismissible v-model="error.show" :icon="error.icon">
        {{error.message}}
      </v-alert>
    </v-flex>
    <v-flex xs10 class="mt-4">
      <h1 class="text-xs-center headline">Configuração do Kernel</h1>
      <br>
       <v-card>
        <v-card-title class="headline">
          Dados do Kernel
        </v-card-title>
        <h2 class="subheading pa-3">Endereço MAC do Kernel: {{macaddress}}</h2>  
        <h2 class="subheading pa-3">Status da solicitação de registro: {{registerStatus}}</h2>  
        <v-container fluid>
          <v-layout row>
            <v-flex xs12 order-lg2>
              <v-card dark tile flat>
                <v-text-field
                  label="Nome do Kernel"
                  v-model="kernelName"
                  required
                  @change="hideSave = false">
                </v-text-field>
              </v-card>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12>
              <div class="text-xs-center">
                 <v-btn
                  :loading="savingKernelDatas"
                  @click="save()"
                  :disabled="hideSave"
                >
                  Salvar
                </v-btn>
              </div>
            </v-flex>
          </v-layout>
        </v-container>
        <v-divider></v-divider>
        <v-card-title class="headline">
          Endereço da nuvem
        </v-card-title>
        <v-container fluid>
          <v-layout row>
            <v-flex xs6 order-lg2>
              <v-card dark tile flat>
                <v-select
                    :items="protocolOptions"
                    v-model="apiProtocol"
                    label="Protocolo"
                    single-line>
                  </v-select>
              </v-card>
            </v-flex>
            <v-flex xs6>
              <v-card dark tile flat>
                <v-text-field
                  label="Endereço"
                  v-model="apiAddress"
                  required>
                </v-text-field>
              </v-card>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12>
              <div class="text-xs-center" v-if="canSendRegister()">
                 <v-btn
                  :loading="sendingRegister"
                  @click="register()"
                  :disabled="sendingRegister || !isOnline"
                >
                  Solicitar registro
                </v-btn>
              </div>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-title class="headline">
          Token de acesso
        </v-card-title>
        <v-container fluid>
          <v-layout row>
            <v-flex class="truncate-text" xs4>
              <span v-if="token">{{tokenStatus}}</span>
              <span v-else>Este kernel ainda não possui token.</span>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12>
              <div class="text-xs-center" v-if="canGenerateToken()">
                 <v-btn
                  :loading="gettingToken"
                  @click="getToken()"
                  :disabled="gettingToken || !isOnline"
                >
                  Solicitar token
                </v-btn>
              </div>
              <div class="text-xs-center" v-if="canRenewToken()">
                 <v-btn @click="getToken()">
                  Renovar token
                </v-btn>
              </div>
              <div v-else>
                Este kernel pode não estar cadastrado ou homologado na nuvem.
              </div>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    name: 'Config',
    data (){
      return {
        notRegisteredMessage: 'Solicitação não realizada',
        homologingMessage: 'Solicitação aguardando homologação',
        homologedMessage: 'Homologado',    
        token: '',
        savingKernelDatas: false,
        hideSave: false,
        loadingPage: true,
        registerStatus: "",
        tokenStatus: "",
        registerEnabled: false,
        isOnline: false,
        macaddress: "",
        sendingRegister: false,
        gettingToken: false,
        apiProtocol: "",
        apiAddress: "",
        protocolOptions: ["http://","https://"],
        error: {show: false, icon: "", message: ""}
      }
    },
    methods: {
      canSendRegister(){
        return this.registerStatus == this.notRegisteredMessage ? true : false
      },
      canGenerateToken(){
        return this.registerStatus == this.homologedMessage && !this.token ? true : false
      },
      canRenewToken(){
        return this.registerStatus == this.homologedMessage && this.token ? true : false
      },
      showError(errors, icon){
        this.error = {show: true, message: errors, icon: icon}
        window.scrollTo(0, 0)
      },
      hideError(){
        this.error = {show: false, message: "", icon: ""}
      },
      save(){
        this.savingKernelDatas = true;
        this.$localStorage.set('kernelName', this.kernelName);
        this.hideSave = true;
        this.savingKernelDatas = false;                
      },
      register(){
        let errors = ""
        if(!this.apiProtocol) errors += "Informe o protocolo do endereço da nuvem."
        else if(!this.apiAddress) errors += "Informe endereço da nuvem."
        else if(!this.kernelName) errors += "Informe nome do kernel."
        
        if(errors != "") this.showError(errors, 'mdi-alert')
        else{
          this.hideError()
          this.$localStorage.set('apiProtocol', this.apiProtocol);
          this.$localStorage.set('apiAddress', this.apiAddress);

          this.sendingRegister = true;
          this.$http.post(this.apiProtocol + this.apiAddress + 'devices-kernel/', {
              mac: this.macaddress,
              name: this.kernelName
          })
          .then(
            response => {
              this.registerStatus = this.homologingMessage
              this.sendingRegister = false
            },
            responseError => { console.log(responseError); this.showError("Erro ao realizar solicitação de registro"); this.sendingRegister = false },
          )
          .catch(e => { console.log(e); this.showError("Erro ao realizar solicitação de registro"); this.sendingRegister = false })
        }
      },
      getToken(){
        this.gettingToken = true;
        this.$http.post(`${this.apiProtocol + this.apiAddress}devices-kernel/authenticate`, { mac: this.macaddress }).then(response => {
          this.gettingToken = false;
          this.token = response.data.token
          this.$localStorage.set('token', this.token);          
        }, response => {
          this.showError("Falha ao obter o token. Este kernel pode não estar registrado ou homologado na nuvem")
          this.gettingToken = false;
        })
      },
      async getTokenStatus(){
        try {
          let response = await this.$http.post(`${this.apiProtocol + this.apiAddress}devices-kernel/verify-token`, { kernelMac: this.macaddress, token: this.$localStorage.get('token') })
          if(response) this.tokenStatus = "Token válido"
          return true;
        } catch (error) {
          this.showError("Este token está inválido, por favor renove-o.")
          this.tokenStatus = "Token inválido"
          console.log(error)
          return false;
        }
      },
      async getMacAddress(){
        let response = await await this.$http.get(this.$store.kernelHost + 'info/macaddress')
        this.macaddress = response.data.mac
        return this.macaddress
      },
      async getIsOnline(){
        let response = await this.$http.get(this.$store.kernelHost + 'info/is-online')
        this.isOnline = response.data.isOnline
        if(!this.isOnline) {
          this.showError('Este dispositivo não possui conexão com a internet.', 'mdi-alert')
          throw 'Este dispositivo não possui conexão com a internet.'
        }
        return this.isOnline;
      },
      async getRegisterStatus(){
        let response = await this.$http.get(this.apiProtocol + this.apiAddress + 'devices-kernel/status/' + this.macaddress)
        if(response.data.enable){ 
          this.registerStatus = this.homologedMessage
          this.registerEnabled = true
        }
        else {
          this.registerStatus = this.homologingMessage
        }
        return this.registerStatus
      }
    },
    async mounted (){
      this.apiProtocol = this.$localStorage.get('apiProtocol')
      this.apiAddress = this.$localStorage.get('apiAddress')
      this.kernelName = this.$localStorage.get('kernelName')
      this.token = this.$localStorage.get('token')

      try {
        await this.getIsOnline()
        await this.getMacAddress()
        await this.getRegisterStatus()
        await this.getTokenStatus();
        this.loadingPage = false
      } catch (error) {
        this.showError(error, 'mdi-alert')        
        throw error
      }
    }
  }
</script>

<style scoped>
  .centered
  {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .logo
  {
    max-width: 100%;
  }

  .link-btn
  {
    width: 150px;
  }

  .truncate-text {
    /* width: 100px; */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis
  }
</style>
