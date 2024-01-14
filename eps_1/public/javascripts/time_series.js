$(document).ready(function() {
    $("input:button").click(function() {
        $.get('/time_series_get?keywords=' + $("#input_keywords").val(), function(data) {
            if (data[0] === null || data[0] === undefined) {
                // 判断是否存在相应的数据
                alert("不存在您搜索的新闻哦");
            } else {
                var data_cnt = {};  // 记录每一天关键字的出现次数
                /**
                 * 遍历得到的内容
                 * 统计每一天该关键词出现的次数
                 */
                data.forEach(eachNews => {
                    if (!(eachNews.publish_date in data_cnt)) {
                        data_cnt[eachNews.publish_date] = 1;
                    } else {
                        data_cnt[eachNews.publish_date] += 1;
                    }
                });

                // 得到折线图的横纵坐标
                // 分别用两个数组进行存储
                let x_value = [];
                let y_value = [];
                for (let i in data_cnt) {
                    x_value.push(i);
                    y_value.push(data_cnt[i]);
                }

                // 将图存储在line中
                var mcharts = echarts.init(document.getElementById("line"), );

                var option = {
                    textStyle: {
                        fontFamily: ["Times new Roman" ,"serif"],
                        fontSize: 20,
                        fontStyle: "normal",
                        fontWeight: "normal",
                    },

                    title: {
                        text: '\"' + $("#input_keywords").val() + '\"一词出现的次数',
                        left: 'center',
                        top: 16,
                        fontFamily: "serif",
                        fontWeight: 90,
                    },

                    xAxis: {
                        name: '日期',
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
                        name: '出现次数',
                        nameRotate: '90',
                        nameLocation: 'center',
                        nameGap: 30,
                        type: 'value'
                    },
                    series: [
                        {
                            type: 'line',
                            data: y_value,

                            label: {
                                normal: {
                                    show: true,//开启显示
                                    position: 'top',//柱形上方
                                    textStyle: { //数值样式
                                        color: 'black'
                                    }
                                }
                            }
                        }
                    ]
                };

                mcharts.setOption(option, true);
            }

        });
    });
});