<template>
  <v-layout row wrap justify-center id="wrapper">

    <v-flex xs6 md3 class="px-2 py-2">
      <v-card color="purple" class="white--text">
        <v-container fluid grid-list-lg>
          <v-layout row>
            <v-flex xs5>
              <v-icon x-large dark right>flash_on</v-icon>
            </v-flex>
            <v-flex xs7>
              <div>
                <div class="headline">37%</div>
                <div>Uso da CPU</div>
              </div>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-flex>

    <v-flex xs6 md3 class="px-2 py-2">
      <v-card color="teal" class="white--text">
        <v-container fluid grid-list-lg>
          <v-layout row>
            <v-flex xs5>
              <v-icon x-large dark right>memory</v-icon>
            </v-flex>
            <v-flex xs7>
              <div>
                <div class="headline">94%</div>
                <div>Uso de Memória</div>
              </div>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-flex>

    <v-flex xs6 md3 class="px-2 py-2">
      <v-card color="blue-grey" class="white--text">
        <v-container fluid grid-list-lg>
          <v-layout row>
            <v-flex xs5>
              <v-icon x-large dark right>network_check</v-icon>
            </v-flex>
            <v-flex xs7>
              <div>
                <div class="headline">53 Mbps</div>
                <div>Tráfego na Rede</div>
              </div>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-flex>

    <v-flex xs6 md3 class="px-2 py-2">
      <v-card color="brown" class="white--text">
        <v-container fluid grid-list-lg>
          <v-layout row>
            <v-flex xs5>
              <v-icon x-large dark right>power</v-icon>
            </v-flex>
            <v-flex xs7>
              <div>
                <div class="headline">743 horas</div>
                <div>Uptime</div>
              </div>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-flex>
    
    <v-flex xs12 md6 class="px-2 py-2">
      <v-card>
        <v-card-text>
          <doughnut-example />
        </v-card-text>
      </v-card>
    </v-flex>

    <v-flex xs12 md6 class="px-2 py-2">
      <v-card>
        <v-card-text>
          <pie-example />
        </v-card-text>
      </v-card>
    </v-flex>

    <v-flex xs12 md6 class="px-2 py-2">
      <v-card>
        <v-card-text>
          <custom-example />
        </v-card-text>
      </v-card>
    </v-flex>

    <v-flex xs12 md6 class="px-2 py-2">
      <v-card>
        <v-card-text>
          <bar-example />
        </v-card-text>
      </v-card>
    </v-flex>

    <v-flex xs12 md6 class="px-2 py-2">
      <v-card>
        <v-card-text>
          <radar-example />
        </v-card-text>
      </v-card>
    </v-flex>

    <v-flex xs12 md6 class="px-2 py-2">
      <v-card>
        <v-card-text>
          <scatter-example />
        </v-card-text>
      </v-card>
    </v-flex>

  </v-layout>
</template>

<script>
import SystemInformation from './WelcomeView/SystemInformation'
  
import BarExample from '../charts/BarExample'
import BubbleExample from '../charts/BubbleExample'
import CustomExample from '../charts/CustomExample'
import DoughnutExample from '../charts/DoughnutExample'
import HorizontalBarExample from '../charts/HorizontalBarExample'
import LineExample from '../charts/LineExample'
import PieExample from '../charts/PieExample'
import PolarAreaExample from '../charts/PolarAreaExample'
import RadarExample from '../charts/RadarExample'
import ScatterExample from '../charts/ScatterExample'


  export default {
    name: 'welcome',
    components: { SystemInformation, BarExample, BubbleExample, CustomExample, DoughnutExample, HorizontalBarExample, LineExample, PieExample, PolarAreaExample, RadarExample, ScatterExample },
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
