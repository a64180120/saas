<template>
    <div id="chart1" style="width:600px ;height:300px" >

    </div>
</template>

<script>
import echarts from 'echarts'
export default {
    name:'rankchart1',
    props:{
        source:{
            type:Array,
            default(){
                return  [
                        ['product', '2015', '2016', '2017'],
                        ['Matcha Latte', 43.3, 85.8, 93.7],
                        ['Milk Tea', 2000, 73.4, 55.1],
                        ['Cheese Cocoa', 86.4, 65.2, 82.5],
                        ['Walnut Brownie', 100, 53.9, 39.1],
                        ['Walnut 2', 72.4, 210, 39.1],
                        ['Walnut 3', 72.4, 500, 39.1],
                        ['Walnut 4', 72.4, 53.9, 600]
                    ]
            }
        }
    },
    data(){
        return {
            option : {
                legend: {show:false},
                tooltip: {},
                dataset: {
                    source:[]
                },
                xAxis: {type: 'category',
                    axisLine:{
                        lineStyle :{
                             color:'#ffffff'
                        }   
                    }
                },
                yAxis: {
                    axisLine:{
                        lineStyle :{
                             color:'#ffffff'
                        }   
                    }
                },
                // Declare several bar series, each will be mapped
                // to a column of dataset.source by default.
                series: [
                    {type: 'bar'},
                    {type: 'bar'},
                    {type: 'bar'}
                ]
            }

        }
    },
    mounted(){
        this.$nextTick(this.draw)
       
    },
    methods:{
        draw(){
            let vm = this ;
            var myChart = echarts.init(document.getElementById('chart1'));
            vm.option.dataset.source=vm.source; 
            myChart.setOption( vm.option);
        }
    },
    watch:{
        source:{
            handler(val){
                if(val){
                   this.option.dataset.source=this.source; 
                   this.draw();
                }
            },
            deep:true
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
