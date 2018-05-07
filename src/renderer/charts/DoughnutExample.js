import { Doughnut } from 'vue-chartjs'

export default {
  extends: Doughnut,
  mounted () {
    this.renderChart({
      labels: ['Espaço Ocupado', 'Espaço Disponível'],
      datasets: [
        {
          backgroundColor: [
            '#DD1B16',
            '#41B883'
          ],
          data: [67, 33]
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
