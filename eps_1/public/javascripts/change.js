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

$(document).ready(function() {
    $('input:button').click(function () {
        $.get('/get_star?start=' + $("#year1").val() + '&end=' + $("#year2").val()
           + '&name=' + $("#name").val(), function(data) {
           // 年份热度
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
            var mcharts = echarts.init(document.getElementById("rate"));

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
                   max: 9
               },
               series: [
                   {
                       type: 'line',
                       data: y_value,


                   }
               ]
            };

            mcharts.setOption(option, true);

            // 题材
            var all_genres = {}; // 存储每一个题材对应的得分

            data.forEach(eachData => {
               var genres = eachData["Genre"].split(", ");
               genres.forEach(eachGenre => {
                   if (!(eachGenre in all_genres)) {
                       all_genres[eachGenre] = 1;
                   } else {
                       all_genres[eachGenre] += 1;
                   }
               });
            });


            // 绘制饼图
            all_data = []
            keys = []
            for (key in all_genres) {
               all_data.push({value: all_genres[key], name: key})

            }

            all_data = all_data.sort(compare("value"));

            all_data.forEach(eachData => {
               keys.push(eachData['name']);
            })

            var mcharts = echarts.init(document.getElementById("genre"), );

            var option = {
               title : {
                   text: '动漫类型',
                   subtext: '',
                   x:'center'
               },
               tooltip : {
                   trigger: 'item',
                   formatter: "{a} <br/>{b} : {c} ({d}%)"
               },

               series : [
                   {
                       name: '动漫类型',
                       type: 'pie',
                       radius : '55%',
                       center: ['50%', '60%'],
                       data: all_data,
                       itemStyle: {
                           emphasis: {
                               shadowBlur: 10,
                               shadowOffsetX: 0,
                               shadowColor: 'rgba(0, 0, 0, 0.5)'
                           }
                       }
                   }
               ]
            };

            mcharts.setOption(option, true);

            // 合作声优

            var star_cnt = {}; // 存储声优合作次数
            tmp = $("#name").val();
            data.forEach(eachData => {
               var stars = eachData["Stars"].split(",");
               stars.forEach(eachStar => {

                   if (eachStar.indexOf(tmp) == -1) {
                       if (!(eachStar in star_cnt)) {
                           star_cnt[eachStar] = 1;
                       } else {
                           star_cnt[eachStar] += 1;
                       }
                   }

               });
            });

            star_list = [];
            for (key in star_cnt) {
                star_list.push({name: key, value: star_cnt[key]});
            }
            star_list = star_list.sort(compare("value"));
            console.log(star_list);
            star_list = star_list.slice(0, 8);
            x_value = [];
            y_value = [];
            star_list.forEach(eachStar => {
               x_value.push(eachStar["name"]);
               y_value.push(eachStar["value"]);
            });

            var mcharts = echarts.init(document.getElementById("cooperator"), );

            var option = {
                tooltip : {
                    trigger: 'axis', // 触发类型为坐标轴触发
                    axisPointer:{   // 指示器配置项
                        type:'shadow' ,// 默认为直线，可选为：'line' | 'cross' | 'shadow'
                    }
                },
                textStyle: {
                    fontFamily: ["Times new Roman" ,"serif"],
                    fontSize: 20,
                    fontStyle: "normal",
                    fontWeight: "normal",
                },

                title: {
                    text: "声优合作次数",
                    left: 'center',
                    top: 16,
                    fontFamily: "serif",
                    fontWeight: 90,
                },

                xAxis: {
                    name: '姓名',
                    type: 'category',
                    axisLabel: {
                        rotate: "45",
                        textStyle: {
                            fontFamily: "Times new Roman",
                        },
                        interval: 0
                    },
                    data: x_value
                },
                yAxis: {
                    name: '合作次数',
                    nameRotate: '90',
                    nameLocation: 'center',
                    nameGap: 30,
                    type: 'value',

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
});
