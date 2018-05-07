import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,
  mounted () {
    this.renderChart({
      labels: ['Jun/17', 'Jul/17', 'Ago/17', 'Set/17', 'Out/17', 'Nov/17', 'Dez/17', 'Jan/18', 'Fev/18', 'Mar/18', 'Abr/18', 'Mai/18'],
      datasets: [
        {
          label: 'Dados Obtidos (em MB)',
          backgroundColor: '#7979f8',
          data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11]
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
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#fff'
          },
        }],
        xAxes: [{
          ticks: {
            fontColor: '#fff'
          },
        }]
      }
    })
  }
}
