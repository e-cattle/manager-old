import { Pie } from 'vue-chartjs'

export default {
  extends: Pie,
  mounted () {
    this.renderChart({
      labels: ['Fisiológicos', 'Comportamentais', 'Micro-Clima', 'Contextuais'],
      datasets: [
        {
          backgroundColor: [
            '#41B883',
            '#E46651',
            '#00D8FF',
            '#DD1B16'
          ],
          data: [348932, 25435, 123456, 12345]
        }
      ]
    },
    {
      responsive: true, 
      maintainAspectRatio: false,
      legend: {
        labels: {
          fontColor: '#ffffff'
        }
      }
    })
  }
}
