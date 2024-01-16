function compare(property) {
    return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value2 - value1;
    }
}

$(document).ready(function() {
    $("#year").click(function() {
        $.get('/factor_year', function(data) {

            var year_rate = {}; // 用于存储每一年的动漫所有的得分

            data.forEach(eachRate => {
                if (!(eachRate["Year"] in year_rate)) {
                    year_rate[eachRate["Year"]] = [eachRate["UserRating"]];
                } else {
                    year_rate[eachRate["Year"]].push(eachRate["UserRating"]);
                }
            });

            var year_average = {}

            for (key in year_rate) {
                average = year_rate[key].reduce(
                    (accumulator, currentValue) => accumulator + currentValue, 0) / year_rate[key].length;
                year_average[key] = average;
            }

            // 绘制折线图
            let x_value = [];
            let y_value = [];
            for (let i in year_average) {
                x_value.push(i);
                y_value.push(year_average[i]);
            }

            // 将图存储在line中
            var mcharts = echarts.init(document.getElementById("line"), );

            var option = {
                tooltip: {
                    trigger: 'axis', // 当鼠标悬停时触发提示框
                    axisPointer: {            // 指示器类型为直角坐标系内的十字准星指示器
                        type: 'cross'
                    }
                },

                textStyle: {
                    fontFamily: ["Times new Roman" ,"serif"],
                    fontSize: 20,
                    fontStyle: "normal",
                    fontWeight: "normal",
                },

                title: {
                    text: "不同年份的动漫评分",
                    left: 'center',
                    top: 16,
                    fontFamily: "serif",
                    fontWeight: 90,
                },

                xAxis: {
                    name: '年份',
                    type: 'category',
                    axisLabel: {
                        rotate: "45",
                        textStyle: {
                            fontFamily: "Times new Roman",
                        },
                    },
                    data: x_value
                },
                yAxis: {
                    name: '评分',
                    nameRotate: '90',
                    nameLocation: 'center',
                    nameGap: 30,
                    type: 'value',
                    min: 6,
                    max: 8
                },
                series: [
                    {
                        type: 'line',
                        data: y_value,
                    }
                ]
            };

            mcharts.setOption(option, true);
        });
    });


    $("#genre").click(function() {
        $.get('/factor_genre', function(data) {
            var genre_rate = {}; // 存储每一个题材对应的得分

            data.forEach(eachData => {
                var genres = eachData["Genre"].split(", ");
                genres.forEach(eachGenre => {
                    if (!(eachGenre in genre_rate)) {
                        genre_rate[eachGenre] = [eachData["UserRating"]];
                    } else {
                        genre_rate[eachGenre].push(eachData["UserRating"]);
                    }
                });
            });

            var genre_average = {}

            for (key in genre_rate) {
                average = genre_rate[key].reduce(
                    (accumulator, currentValue) => accumulator + currentValue, 0) / genre_rate[key].length;
                genre_average[key] = average;
            }

            average_list = []

            for (key in genre_average) {
                average_list.push({name: key, value: genre_average[key]});
            }

            average_list = average_list.sort(compare("value"))

            // 绘制柱状图
            let x_value = [];
            let y_value = [];
            average_list.forEach(eachAverage => {
               x_value.push(eachAverage["name"]);
               y_value.push(eachAverage["value"]);
            });

            var mcharts = echarts.init(document.getElementById("line"), );

            var option = {
                textStyle: {
                    fontFamily: ["Times new Roman" ,"serif"],
                    fontSize: 20,
                    fontStyle: "normal",
                    fontWeight: "normal",
                },

                title: {
                    text: "不同类型的动漫评分",
                    left: 'center',
                    top: 16,
                    fontFamily: "serif",
                    fontWeight: 90,
                },

                visualMap: {
                    show: false,
                    min: 6,   // 数据最小值
                    max: 9, // 数据最大值

                    calculable: true, // 开启计算功能
                    orient: 'horizontal', // 水平布局
                    left: 'center', // 左对齐
                    bottom: 10, // 距离底部位置

                    inRange: {
                        color: ['#FF3F79','#FFA500'] // 渐变色起止颜色
                    }
                },

                xAxis: {
                    name: '类型',
                    type: 'category',
                    axisLabel: {
                        rotate: "45",
                        textStyle: {
                            fontFamily: "Times new Roman",
                        },
                    },
                    data: x_value
                },
                yAxis: {
                    name: '评分',
                    nameRotate: '90',
                    nameLocation: 'center',
                    nameGap: 30,
                    type: 'value',
                    min: 6,
                    max: 9
                },
                series: [
                    {
                        type: 'bar',
                        data: y_value,
                    }
                ]
            };

            mcharts.setOption(option, true);

        });
    });

    // 查明星
    $("#stars").click(function() {
        $.get('/factor_star', function(data) {
            var star_rate = {}; // 存储每一个题材对应的得分

            data.forEach(eachData => {
                var stars = eachData["Stars"].split(",");
                stars.forEach(eachStar => {
                    if (!(eachStar in star_rate)) {
                        star_rate[eachStar] = [eachData["UserRating"]];
                    } else {
                        star_rate[eachStar].push(eachData["UserRating"]);
                    }
                });
            });

            var star_average = []

            for (key in star_rate) {
                average = star_rate[key].reduce(
                    (accumulator, currentValue) => accumulator + currentValue, 0) / star_rate[key].length;
                tmp = {name: key, value: average}
                star_average.push(tmp)
            }

            new_star = star_average.sort(compare("value"));

            // 取前100个
            cloud_words = new_star.slice(0, 100);

            var name = [];
            var avg = [];
            for (item in cloud_words) {
                name.push(cloud_words[item]["name"]);
                avg.push(cloud_words[item]["value"]);
            }

            var myChart = echarts.init(document.getElementById('line'));
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




        });


    });
});