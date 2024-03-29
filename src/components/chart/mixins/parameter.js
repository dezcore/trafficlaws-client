export default {
    data: () => ({}),
    watch: {},
    methods: {
        updateChart : function() {
            if(this.chartDiv)
                this.$Plotly.update(this.chartDiv, this.data, this.layout)
        },
        addTrace(trace, timeseries) {
            if(trace && !this.data.some((parameter) => parameter.name === trace.name)) {
                if(timeseries) {
                    this.$Plotly.addTraces(this.chartDiv, trace)
                } else if(!timeseries && this.data[0] === undefined) {
                    this.$Plotly.addTraces(this.chartDiv, trace)
                }
            }
        },
        appendTrace : function(trace) {
            let targetTrace
            const traces = this.data

            if(traces && trace) {
                targetTrace = traces.find( chartTrace => chartTrace.name === trace.name)
                targetTrace.x = [...targetTrace.x, ...trace.x]
                targetTrace.y = targetTrace.z === undefined ?  [...targetTrace.y, ...trace.y] : targetTrace.y

                if(targetTrace.z)
                    targetTrace.z = [...targetTrace.z, ...trace.z]
                
                this.updateChart()
            }
        },
        prependTrace : function(trace) {
            let targetTrace
            const traces = this.data

            if(traces && trace) {
                targetTrace = traces.find( chartTrace => chartTrace.name === trace.name)
                targetTrace.x = [...trace.x, ...targetTrace.x]
                targetTrace.y = targetTrace.z === undefined ? [...trace.y, ...targetTrace.y] : targetTrace.y

                if(targetTrace.z)
                    targetTrace.z = [...trace.z, ...targetTrace.z]

                this.updateChart()
            }

        },
        removeTracePoint : function(point) {
            let targetTrace, index
            const traces = this.data

            if(point) {
                targetTrace = traces.find( trace => trace.name === point.videoId)
                index = targetTrace.x.findIndex(value => value === point.date)

                if(index !== -1) {
                    targetTrace.x.splice(index, 1)
                    targetTrace.y.splice(index, 1)
                    this.updateChart()
                }
            }
        },
        removeTrace : function(parameters, callBack) {
            if(parameters) {
                this.data = this.data.filter(
                    trace => !parameters.some(parameter => parameter.name === trace.name)
                )
                
                this.$Plotly.react(this.chartDiv, this.data, this.layout, this.config)
                
                if(callBack)
                    callBack()
            }
        },
        setTraceSelectMode : function(trace) {
            if(trace) {
                trace.selected = {
                    marker : {
                        opacity : 1
                    }
                }

                trace.unselected = {
                    marker : {
                        opacity : 1
                    }
                }
            }
        },
        setTraceStyle : function(trace, parameter) {
            if(trace && parameter) {
                trace.line = {
                    color: parameter.color.value,
                    width: 2,
                    dash: "solid",
                    shape: "linear",
                    simplify: true,
                }
                trace.mode = "lines",
                trace.type = 'scatter',
                trace.opacity = 1
                trace.size = 3
                trace.marker = { size : 3 }
                trace.maxdisplayed = 0
                trace.gradient = {
                    type: "none"
                }

            }
        },
        parameterToTrace : function(parameter, callBack) {
            let trace = {x : [], y : [],name: 'Default', yaxis: 'y', close : false,  connectgaps: false}

            if(parameter && callBack) {
                trace = {
                    x : parameter.x,
                    y : parameter.y,
                    close : false,
                    connectgaps: false,
                    name: parameter.name,
                    yaxis: 'y'
                }
                this.setTraceSelectMode(trace)
                this.setTraceStyle(trace)
                callBack(trace)
            } else if(callBack) {
                callBack(trace)
            }
        },
        initParameters : function(parameters, index) {
            if(parameters) {
                this.parameterToTrace(parameters[index], (trace) => {
                    if(trace) {
                        this.addTrace(trace, true)
                    }
                })
            }
        }
    }
}
