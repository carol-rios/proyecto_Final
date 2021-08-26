<template>
    <div class="ex2">
        <canvas id="myChart"></canvas>
    </div>
</template>

<script>
import Chart from 'chart.js'
import axios from 'axios';
export default {
    data(){
        return {
            datos:[],
            stock:[]    
        }
    },

    methods: {
        async graficar(){
            let me = this;
            let categoriaArray = [];
            let header = {headers: {"token": this.$store.state.token}  };
            
            await axios
            .get("articulo", header )
            .then(function (response) {
                categoriaArray = response.data.articulo;
                console.log(response.data.articulo);
                categoriaArray.map(function (x) {
                    me.datos.push(x.nombre);
                    me.stock.push(x.stock)
                })
                
            })

            let ctx = document.getElementById('myChart');
            /* eslint-disable no-unused-vars */
            const myChart = new Chart (ctx,{
                type: 'bar',
                data:{
                    labels: me.datos,
                    datasets: [{
                        label: 'Articulos',
                        data: me.stock,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(25, 80, 130, 0.2)',
                            'rgba(25, 255, 12, 0.2)',
                        ],
                        borderColor: [
                            'rgba(255,  99, 132, 1)',
                            'rgba( 54, 162, 235, 1)',
                            'rgba(255, 206,  86, 1)',
                            'rgba( 75, 192, 192, 1)',
                            'rgba( 25,  80, 130, 1)',
                            'rgba( 25, 255,  12, 1)',
                        ],
                        borderWidth:1
                    }]
                },
                options: {
                    scales:{
                        yAxes:[{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            }) 

        }
    },
    mounted(){
        this.graficar();
    }

}
</script>

<style>
.ex2{
    margin: 100px;
    
}

</style>