function compare(property) {
    return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value2 - value1;
    }
}

$(document).ready(function() {
    $('input:button').click(function () {
        $.get('/genre_change?genre=' + $("#genre_name").val(), function(data) {
            // 数量
            year_cnt = {};

            data.forEach(eachData => {
               if (!(eachData['Year'] in year_cnt)) {
                   year_cnt[eachData['Year']] = 1;
               }
               else {
                   year_cnt[eachData['Year']] += 1;
               }
            });

            all_data = []

            for (key in year_cnt) {
                all_data.push([key, year_cnt[key]]);
            }

            const dateList = all_data.map(function (item) {
                return item[0];
            });
            const valueList = all_data.map(function (item) {
                return item[1];
            });
            // 数量

            // 得分
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

            all_data = []

            for (key in year_average) {
                all_data.push([key, year_average[key]]);
            }

            const dateList2 = all_data.map(function (item) {
                return item[0];
            });
            const valueList2 = all_data.map(function (item) {
                return item[1];
            });
            // 得分

            var mcharts = echarts.init(document.getElementById("genre_line"));
            option = {
                // Make gradient line here
                visualMap: [
                    {
                        show: false,
                        type: 'continuous',
                        seriesIndex: 0,
                        min: 0,
                        max: 400
                    },
                    {
                        show: false,
                        type: 'continuous',
                        seriesIndex: 1,
                        dimension: 0,
                        min: 0,
                        max: dateList.length - 1
                    }
                ],
                title: [
                    {
                        left: 'center',
                        text: '该题材作品数量'
                    },
                    {
                        top: '55%',
                        left: 'center',
                        text: '该题材用户评分'
                    }
                ],
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: [
                    {
                        data: dateList
                    },
                    {
                        data: dateList2,
                        gridIndex: 1
                    }
                ],
                yAxis: [
                    {},
                    {
                        gridIndex: 1,
                        max: 9,
                        min: 5
                    }
                ],
                grid: [
                    {
                        bottom: '60%'
                    },
                    {
                        top: '60%'
                    }
                ],
                series: [
                    {
                        type: 'line',
                        showSymbol: false,
                        data: valueList
                    },
                    {
                        type: 'line',
                        showSymbol: false,
                        data: valueList2,
                        xAxisIndex: 1,
                        yAxisIndex: 1
                    }
                ]
            };

            mcharts.setOption(option, true);
        });
    });
});