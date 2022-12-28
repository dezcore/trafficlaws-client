import $ from "jquery"

export default {
    data: () => ({
        data: [],
        layout: {},
        config: {},
        chartname: "",
        chartDiv : null,
        componentKey: 1,
        rangeslider: true,
        modeBarButtons: [],
        xAxisName : 'Time',
        yAxisName : 'Value',
        title : 'Chart title',
        theme: {
            name : "light",
            background:"rgb(255,255,255)",
            plotPaper:"rgb(255,255,255)",
            grid:"rgb(230,230,230)",
            text:"rgb(70,70,70)",
            iconColor:"rgba(68, 68, 68, 0.3)",
            activecolor:"rgba(212, 10, 10, 0.7)",
            chartTabColor:"light-blue",
            flagOpacity:0.28,
            thresholdMaxColor:"rgb(245,6,6)",
            thresholdMinColor:"rgb(27,27,28)"
        },
    }),
    watch: {},
    methods: {
        getXMargin: function() {
            return {
                t: 40,
                b: 26,
                l: 72,
                r: 80,
                pad: 0,
                autoexpand: true
            }
        },
        getXaxis: function(type) {
            let color =  this.theme.text
            let startDate = '', endDate = ''

            return ({
                type: type,
                range : [startDate, endDate],
                gridcolor: this.theme.grid,
                tickfont: {
                    color: color
                },
                title: {
                    text: this.xAxisName,
                    font: {
                        family: 'Courier New, monospace',
                        size: 18,
                        color: this.theme.text
                    }
                },
                fixedrange : true,
                margin : this.getXMargin(),
                rangeslider: { visible : this.rangeslider, y : 1},
            })
        },
        getYaxis: function() {
            return ({
                title: {
                    text: this.yAxisName,
                    font: {
                        family: 'Courier New, monospace',
                        size: 18,
                        color: this.theme.text
                    }
                },
                gridcolor: this.theme.grid,
                tickfont: {
                    color: this.theme.text
                },
                fixedrange: false,
                zeroline: false
            })
        },
        getTitle : function() {            
            return {
                text: this.title,
                x : 0.52,
                font: {
                    color: this.theme.text,
                    family : '"Open Sans", verdana, arial, sans-serif',
                    size : 18,
                }
            }
        },
        initLayout: function() {
            this.layout = {
                height: 400,
                showlegend: true,
                font : {
                    color: this.theme.text
                },
                plot_bgcolor: this.theme.plotPaper,
                paper_bgcolor: this.theme.plotPaper,
                title: this.getTitle(),
                xaxis: this.getXaxis(),
                yaxis: this.getYaxis(),
                shapes: [],
                //modebar: this.getLayoutModeBarConf()
            }
        },
        getModeBarConf : function(/*icons*/) {
            return ([
                [
                    'select2d',
                ],
                [
                    {
                        name: 'resetAxes',
                        icon:  this.$Plotly.Icons.home,
                        click: () => {
                            //this.resetAxes()
                        }
                    },
                    'sendDataToCloud',
                ]
            ])
        },
        getChartModeBar: function(icons) {
            let modeBar = []

            if(this.getChartId !== 'defaultChart') {
                modeBar = this.getModeBarConf(icons)
            }

            return modeBar
        },
        loadChart : function(chartDiv, parameter) {
            if(parameter === null && chartDiv) {
                this.$Plotly.react(chartDiv, this.data, this.layout, this.config)
            } else if(chartDiv) {
                this.$Plotly.newPlot(chartDiv, this.data, this.layout, this.config)
            }
        },
        configuration : function(chartDiv, parameter) {   
            this.modeBarButtons = this.getChartModeBar(
                {
                    //linkIcon : this.getLinkChartIcon, 
                    //scatterIcon : this.scatterMode
                }, 
                parameter
            )

            this.initLayout()
            this.loadChart(chartDiv, parameter) 
        },
        initCharts : function(parameter, callBack) {
            this.$nextTick(() => {
                $('document').ready(() => {
                    this.chartDiv = document.getElementById(this.chartId)
                    this.configuration(this.chartDiv, parameter)
                    if(callBack)
                        callBack()
                })
            })
        }
    }
}
