<template>
  <v-layout row wrap justify-center id="wrapper">
    
    <v-flex xs12 md6 class="px-1 py-1">
      <v-card>
        <v-card-text>
          <bar-example />
        </v-card-text>
      </v-card>
    </v-flex>

    <v-flex xs12 md6 class="px-1 py-1">
      <v-card>
        <v-card-text>
          <bubble-example />
        </v-card-text>
      </v-card>
    </v-flex>

    <v-flex xs12 md6 class="px-1 py-1">
      <v-card>
        <v-card-text>
          <custom-example />
        </v-card-text>
      </v-card>
    </v-flex>

    <v-flex xs12 md6 class="px-1 py-1">
      <v-card>
        <v-card-text>
          <doughnut-example />
        </v-card-text>
      </v-card>
    </v-flex>

    <v-flex xs12 md6 class="px-1 py-1">
      <v-card>
        <v-card-text>
          <horizontal-bar-example />
        </v-card-text>
      </v-card>
    </v-flex>

    <v-flex xs12 md6 class="px-1 py-1">
      <v-card>
        <v-card-text>
          <line-example />
        </v-card-text>
      </v-card>
    </v-flex>

    <v-flex xs12 md6 class="px-1 py-1">
      <v-card>
        <v-card-text>
          <pie-example />
        </v-card-text>
      </v-card>
    </v-flex>

    <v-flex xs12 md6 class="px-1 py-1">
      <v-card>
        <v-card-text>
          <polar-area-example />
        </v-card-text>
      </v-card>
    </v-flex>

    <v-flex xs12 md6 class="px-1 py-1">
      <v-card>
        <v-card-text>
          <radar-example />
        </v-card-text>
      </v-card>
    </v-flex>

    <v-flex xs12 md6 class="px-1 py-1">
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
