<template>
  <v-layout v-if="loadingPage">
    <v-progress-linear :indeterminate="true"></v-progress-linear>
  </v-layout>
  <v-layout v-else row wrap justify-center id="wrapper">
    
    <v-flex xs12 v-show="alert.show">
      <v-alert :color="alert.color" dismissible v-model="alert.show" :icon="alert.icon">
        {{alert.message}}
      </v-alert>
    </v-flex>
    
    <v-flex xs12 class="mt-4">
      <br>
       <v-card>
        <v-btn flat icon v-show="!editingKernelDatas" @click="editKernelDatas()">
          <v-icon>edit</v-icon>
        </v-btn>
        <v-card-title class="headline">
          Dados do Kernel
        </v-card-title>
        <div v-show="!editingKernelDatas">
          <h2 class="subheading pa-3">Nome da fazenda: {{kernel.name}}</h2>  
          <h2 class="subheading pa-3">Endereço MAC do Kernel: {{macaddress}}</h2>
        </div> 
        <v-container fluid v-show="editingKernelDatas">
          <v-layout row>
            <v-flex xs12 order-lg2>
              <v-card dark tile flat>
                <v-text-field
                  label="Nome da Fazenda"
                  v-model="kernelEdit.name"
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
                  :loading="saving"
                  @click="save()"
                  :disabled="hideSave"
                >
                  Salvar
                </v-btn>
                <v-btn
                  @click="cancel()"
                >
                  Cancelar
                </v-btn>
              </div>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-flex>

    <v-flex  xs12 class="mt-4">
      <v-card>
        <v-btn flat icon v-show="!editingApiDatas" @click="editApiDatas()">
          <v-icon>edit</v-icon>
        </v-btn>
        <v-card-title class="headline">
          Endereço da nuvem
        </v-card-title>
        <div v-show="!editingApiDatas">
          <h2 class="subheading pa-3">{{kernel.apiAddressProtocol}}{{kernel.apiAddress}}</h2>  
        </div> 
        <v-container fluid v-show="editingApiDatas">
          <v-layout row>
            <v-flex xs6>
              <v-card dark tile flat>
                <v-select
                    :items="protocolOptions"
                    v-model="kernelEdit.apiAddressProtocol"
                    label="Protocolo"
                    single-line>
                  </v-select>
              </v-card>
            </v-flex>
            <v-flex xs6>
              <v-card dark tile flat>
                <v-text-field
                  label="Endereço"
                  v-model="kernelEdit.apiAddress"
                  required>
                </v-text-field>
              </v-card>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12>
              <div class="text-xs-center">
                 <v-btn
                  :loading="saving"
                  @click="save()"
                  :disabled="hideSave"
                >
                  Salvar
                </v-btn>
                <v-btn
                  @click="cancel()"
                >
                  Cancelar
                </v-btn>
              </div>
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
      </v-card>
    </v-flex>

    <v-flex xs12 class="mt-4">
      <v-card>
        <v-card-title class="headline">
          Acesso a nuvem
        </v-card-title>
        <h2 class="subheading pa-3">Status da solicitação de registro: {{registerStatus}}</h2>  
        <p class="pa-3 grey--text" style="text-align: justify;">
          O Bigbox deve estar registrado e homologado na nuvem para que possa realizar 
          a sincronização dos dados em nuvem. Caso este dispositivo ainda não esteja com o status de registro realizado 
          então clique no botão "Solicitar Registro" para que a solicitação seja criada. Caso o dispositivo tenha uma 
          solicitação em andamente porém ainda não homologada, então o dispositivo está sendo analisado pela equipe 
          técnica e o mais breve possível será ativado. Caso contrário entre em contato com a equipe técnica 
        </p>
        <p class="pa-3 red" v-if="this.registerStatus == this.API_NOT_ONLINE">
          ATENÇÃO: A nuvem está temporariamente indisponível. Isso não impede o funcionamento do Bigbox localmente, porém não será possível realizar a sincronização de dados.
        </p>
        <v-container fluid v-else>
          <v-layout row>
            <v-flex class="truncate-text" xs4>
              <span v-if="kernel && kernel.token">{{tokenStatus}}</span>
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
       
        NOT_REGISTERED: 'Solicitação não realizada',
        API_NOT_ONLINE: 'Solicitação falhou, a nuvem pode estar temporariamente fora do ar.',
        HOMOLOGING: 'Solicitação aguardando homologação',
        HOMOLOGED: 'Homologado',    

        saving: false,
        editingKernelDatas: false,
        editingApiDatas: false,
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
        kernelEdit: {},
        kernel: {},
        alert: {show: false, icon: "", message: "", color: "error"}
      }
    },
    methods: {
      showWarning(msg, icon){
        this.alert = {show: true, message: msg, icon: icon||'mdi-alert', color: "warning"}
        window.scrollTo(0, 0)
      },
      hideAlert(){
        this.alert = {show: false, message: "", icon: ""}
      },

      canSendRegister(){
        return this.registerStatus != this.API_NOT_ONLINE && this.registerStatus == this.NOT_REGISTERED ? true : false
      },
      canGenerateToken(){
        return this.registerStatus != this.API_NOT_ONLINE && this.registerStatus == this.HOMOLOGED && !this.kernel.token ? true : false
      },
      canRenewToken(){
        return this.registerStatus != this.API_NOT_ONLINE && this.registerStatus == this.HOMOLOGED && this.kernel.token ? true : false
      },
      showError(errors, icon){
        this.alert = {show: true, message: errors, icon: icon||'mdi-alert'}
        window.scrollTo(0, 0)
      },
      
      editKernelDatas(){
        this.cancel();
        this.edit();
        this.editingKernelDatas = true;
      },
      editApiDatas(){
        this.cancel();
        this.edit();
        this.editingApiDatas = true;
      },
      edit(){
        this.kernelEdit._id = this.kernel._id;
        this.kernelEdit.name = this.kernel.name;
        this.kernelEdit.apiAddressProtocol = this.kernel.apiAddressProtocol;
        this.kernelEdit.apiAddress = this.kernel.apiAddress;
      },
      cancel(){
        this.editingKernelDatas = false;
        this.editingApiDatas = false;
      },

      /**
      * Método que envia uma requisição POST para o Kernel com os dados de configuração.
      */
      async save(){
        this.saving = true;
        this.hideSave = true;
        this.kernel = this.kernelEdit;
        try {
          let response = await this.$http.post(this.$store.kernelHost + 'info/config', this.kernel);
          if(response.data.kernel) this.kernel = response.data.kernel;
          this.hideAlert();
        } catch (error) {
          console.log("Erro ao salvar configurações do kernel: " + error);
          this.showError("Erro ao salvar configurações do Bigbox, tente novamente mais tarde.");
        }
        this.hideSave = false;
        this.saving = false;                
        this.cancel();
        this.kernelEdit = {};
      },
      
      register(){
        let errors = ""
        if(!this.kernel.apiAddressProtocol) errors += "Informe o protocolo do endereço da nuvem."
        else if(!this.kernel.apiAddress) errors += "Informe endereço da nuvem."
        else if(!this.kernelName) errors += "Informe nome do kernel."
        
        if(errors != "") this.showError(errors, 'mdi-alert')
        else{
          this.hideAlert()
          this.$localStorage.set('apiProtocol', this.kernel.apiAddressProtocol);
          this.$localStorage.set('apiAddress', this.kernel.apiAddress);

          this.sendingRegister = true;
          this.$http.post(this.kernel.apiAddressProtocol + this.kernel.apiAddress + 'devices-kernel/', {
              mac: this.macaddress,
              name: this.kernelName
          })
          .then(
            response => {
              this.registerStatus = this.HOMOLOGING
              this.sendingRegister = false
            },
            responseError => { console.log(responseError); this.showError("Erro ao realizar solicitação de registro"); this.sendingRegister = false },
          )
          .catch(e => { console.log(e); this.showError("Erro ao realizar solicitação de registro"); this.sendingRegister = false })
        }
      },

      /**
      * Método que consulta o status da solicitação do registro do kernel na API Aplication.
      * Realiza uma requisição HTTP GET para a Api Application para ver o status da solitação.
      *
      * @returns {String} - status da solicitação de registro do kernel.
      *
      */
      async getRegisterStatus(){
       
       let response;

        try {
          response = await this.$http.get(this.kernel.apiAddressProtocol + this.kernel.apiAddress + 'devices-kernel/status/' + this.macaddress, {timeout: 3000})
        } catch (error) {
          console.log("Falha ao consultar status de solicitação de registro na API: " + error);
          this.registerStatus = this.API_NOT_ONLINE;
          throw "Falha ao consultar status de solicitação de registro na nuvem. A nuvem pode estar temporariamente fora do ar.";
        }

        if(!response.data){
          this.registerStatus = this.NOT_REGISTERED
        }else if(response.data.enable){ 
          this.registerStatus = this.HOMOLOGED
          this.registerEnabled = true
        }
        else {
          this.registerStatus = this.HOMOLOGING
        }
        return this.registerStatus
      },

      /**
      * Método que faz uma requisição para a API Application solicitando uma renovação de token ou um novo token.
      */
      async getToken(){
        this.gettingToken = true;
        try {
          let response = await this.$http.post(`${this.kernel.apiAddressProtocol + this.kernel.apiAddress}devices-kernel/authenticate`, { mac: this.macaddress });
          this.gettingToken = false;
          this.kernelEdit = this.kernel;
          this.kernelEdit.token = response.data.token;
          this.save();
        } catch (error) {
          console.log("Erro ao solicitar token à API: " + error);
          this.showError("Falha ao obter o token. Este kernel pode não estar registrado ou homologado na nuvem")
          this.gettingToken = false;
        }
      },

      /**
      * Método que faz uma requisição para a API Application solicitando o status atual do token que o kernel possui.
      * 
      * @returns {Boolean} - true: se o token estiver válido, false: se o token estiver inválido 
      *
      */
      async getTokenStatus(){
        try {
          let response = await this.$http.post(`${this.kernel.apiAddressProtocol + this.kernel.apiAddress}devices-kernel/verify-token`, { kernelMac: this.macaddress, token: this.kernel.token})
          if(response) this.tokenStatus = "Token válido"
          return true;
        } catch (error) {
          this.showWarning("Este token está inválido, por favor renove-o.")
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
          this.showWarning('A camada kernel do Bigbox não possui conexão com a internet.', 'mdi-alert')
          throw 'Este dispositivo não possui conexão com a internet.'
        }
        return this.isOnline;
      },

      async getKernelConfigs(){
        let response = await this.$http.get(this.$store.kernelHost + 'info/config')
        let result = response.data;

        if(!result) this.showError('Falha ao carregar configurações do Bigbox.', 'mdi-alert')

        if(!result.config && result.err){
          this.showWarning('O Bigbox pode estar sendo iniciado pela primeira vez agora. Por favor, preencha os Dados do Kernel e do Endereço da Nuvem', 'mdi-alert')
        }else{
          this.kernel = result.config;
          if(!this.kernel.apiAddress || !this.kernel.apiAddressProtocol)
            this.showWarning('Os dados do Endereço da Nuvem não estão completos. Por favor, complete-os');
        }
      },

      async isKenelRunning(){
        let response = await this.$http.get(this.$store.kernelHost, {timeout: 3000})
        let result = response.data;
        if(!result) {
          return false;
        }
        return true;
      }
    },

    async mounted (){
      try {
        if(!(await this.isKenelRunning()));
      } catch (error) {
        this.showError('Falha ao conectar com o kernel Bigbox. Por favor verifique se o kernel está ligado.', 'mdi-alert')
        this.loadingPage = false;
        return;
      }

      try {
        await this.getKernelConfigs()
        await this.getIsOnline()
        await this.getMacAddress()
        await this.getRegisterStatus()
        await this.getTokenStatus();
        this.loadingPage = false
      } catch (error) {
        this.showError(error, 'mdi-alert')        
        this.loadingPage = false
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
