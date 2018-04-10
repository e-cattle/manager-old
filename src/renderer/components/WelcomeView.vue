<template>
  <v-layout row wrap justify-center id="wrapper">
    <v-flex xs12 class="text-xs-center centered">
      <h1 class="text-xs-center display-3">Kernel Manager</h1>
    </v-flex>
    <v-flex xs10 class="mt-3">
      <v-card>
        <v-card-text>
          <p>Bem-vindo ao E-cattle Kernel Manager.</p>
          <p>Esta plataforma tem o objetivo de gerenciar o <strong>kernel</strong> de uma fazenda, bem como os dispositivos vinculados e os dados sensoriais.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn primary flat router to="/inspire">Ir para manual</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import SystemInformation from './WelcomeView/SystemInformation'

  export default {
    name: 'welcome',
    components: { SystemInformation },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
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
</style>
