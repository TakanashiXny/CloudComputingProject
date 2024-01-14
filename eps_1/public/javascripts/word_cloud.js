/**
 * 根据数组对象的某个属性进行排序
 * @param property 属性名
 * @returns {function(*, *): *}
 */
function compare(property) {
    return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value2 - value1;
    }
}

var all_words = []; // 将所有关键词提取出来
var frequency = {}; // 得到所有关键词的出现频度
var all_data = []; // 得到适用于词云的数组
var new_all_data = []; // 将all_data根据频度进行排序
var cloud_words = []; // 选出频度较大的词来生成词云
$.get('/word_cloud_get', function(data) {
    // 中间变量
    var tmp;
    for (let list of data) {
        var key = list["keywords"];
        tmp = key.split(",");
        tmp = tmp.filter(item => item !== "原创新闻");
        all_words = all_words.concat(tmp);
    }
    for (let list of all_words) {
        if (!(list in frequency)) {
            frequency[list] = 1;
        } else {
            frequency[list] += 1;
        }
    }

    for (var item in frequency) {
        tmp = {name:item, value:frequency[item]};
        all_data.push(tmp);
    }

    //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
    new_all_data = all_data.sort(compare("value"));
    // 取前100个
    cloud_words = new_all_data.slice(0, 100);

    var words = [];
    var freq = [];
    for (item in cloud_words.slice(0, 10)) {
        words.push(cloud_words[item]["name"]);
        freq.push(cloud_words[item]["value"]);
    }

    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));
    // 指定图表的配置项和数据
    option = {
        tooltip: {
            show: true
        },
        series: [
            {
                type: 'wordCloud', //词云图
                gridSize: 6, //词的间距
                shape: 'circle', //词云形状，可选diamond，pentagon，circle，triangle，star等形状
                sizeRange: [12, 100], //词云大小范围
                width: 1000, //词云显示宽度
                height: 500, //词云显示高度
                textStyle: {
                    color: function () {
                        //词云的颜色随机
                        return (
                            'rgb(' +
                            [
                                Math.round(Math.random() * 160),
                                Math.round(Math.random() * 160),
                                Math.round(Math.random() * 160)
                            ].join(',') +
                            ')'
                        );
                    },

                    emphasis: {
                        shadowBlur: 10, //阴影的模糊等级
                        shadowColor: '#333' //鼠标悬停在词云上的阴影颜色
                    }
                },
                data: cloud_words
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option, true);

    $("#cloud_pc").click(function() {
        $("#main").show();
        $("#bar").hide();
        var mChart = echarts.init(document.getElementById('main'));
        // 指定图表的配置项和数据
        option = {
            tooltip: {
                show: true
            },
            series: [
                {
                    type: 'wordCloud', //词云图
                    gridSize: 6, //词的间距
                    shape: 'circle', //词云形状，可选diamond，pentagon，circle，triangle，star等形状
                    sizeRange: [12, 100], //词云大小范围
                    width: 1000, //词云显示宽度
                    height: 500, //词云显示高度
                    textStyle: {
                        color: function () {
                            //词云的颜色随机
                            return (
                                'rgb(' +
                                [
                                    Math.round(Math.random() * 160),
                                    Math.round(Math.random() * 160),
                                    Math.round(Math.random() * 160)
                                ].join(',') +
                                ')'
                            );
                        },

                        emphasis: {
                            shadowBlur: 10, //阴影的模糊等级
                            shadowColor: '#333' //鼠标悬停在词云上的阴影颜色
                        }
                    },
                    data: cloud_words
                }
            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        mChart.setOption(option, true);
    });

    $("#bar_pc").click(function() {
        $("#main").hide();
        $("#bar").show();
        var mChart = echarts.init(document.getElementById("bar"), );

        option = {
            textStyle: {
                fontFamily: ["Times new Roman" ,"serif"],
                fontSize: 20,
                fontStyle: "normal",
                fontWeight: "normal",
            },

            title: {
                text: "出现次数前10的关键词",
                left: 'center',
                top: 16,
                textStyle: {
                    fontSize: 20,
                    fontFamily: "serif",
                },
            },

            xAxis: {
                name: '关键词',
                type: 'category',
                axisLabel: {
                    rotate: "45",
                    textStyle: {
                        fontFamily: "Times new Roman",
                    },
                    fontSize: 20,
                },
                data: words
            },
            yAxis: {
                name: '出现次数',
                nameRotate: '90',
                nameLocation: 'center',
                nameGap: 30,
                type: 'value'
            },
            series: [
                {
                    type: 'bar',
                    data: freq,

                    label: {
                        normal: {
                            show: true,//开启显示
                            position: 'top',//柱形上方
                            textStyle: { //数值样式
                                color: 'black'
                            }
                        }
                    },

                    itemStyle: {
                        color: {
                            type: 'linear', 					// 线性渐变
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 0, color: 'orange' 		// 0% 处的颜色
                                },
                                {
                                    offset: 1, color: 'tomato' 		// 100% 处的颜色
                                }
                            ]
                        }
                    }
                }
            ]
        };

        mChart.setOption(option, true);
    });


});
