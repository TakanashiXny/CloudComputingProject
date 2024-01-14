var cnt = 0; // 用于记录当前页的第几条新闻，用于相邻行设置不同颜色
var num = 0; // 表格中某一行的第几个表项，用于url的特殊处理
var current_page = 1; // 记录当前页
var PERPAGE = 10; // 记录每一页的新闻最大数量
var MAXPAGE = 0; // 记录最大页数
var all_data = [];
$("#button_container").hide();
$("#prev").hide();
$(document).ready(function() {
    $("input:button").click(function() {
        $("#button_container").show();
        $("#prev").hide();
        $("#next").show();
        // 提取参数：搜索条件1，搜索条件2，顺序，排序指标
        var condition1 = $("#search1").val();
        var condition2 = $("#search2").val();
        var order = $("#order").val();
        var index = $("#order_index").val();
        var option = $("#option").val();
        $.get('/process_get?title1=' + $("#text1").val() + '&way1=' + condition1 + '&title2=' + $("#text2").val() +
            '&way2=' + condition2 + '&order=' + order + '&index=' + index + '&option=' + option, function(data) {
            if (data[0] === null || data[0] === undefined) {
                // 检查数据是否存在
                alert("不存在您搜索的新闻哦");
            } else {
                // 将当前页设置为1
                current_page = 1;
                // 存储所有的数据
                // 以便进行上下翻页操作
                all_data = data;
                // 计算最大分页
                MAXPAGE = Math.ceil(all_data.length / PERPAGE);
                // 分页
                pagination();
            }
        });
    });

    // 切换页面
    $("#prev").click(function() {
        // 向前翻页
        if (current_page > 1) {
            current_page--;
            $("#next").show();
            pagination();
            if (current_page === 1) {
                $("#prev").hide();
            }
        }

    });

    $("#next").click(function() {
        // 向后翻页
        if (current_page < MAXPAGE) {
            current_page++;
            $("#prev").show();
            pagination();
            if (current_page === MAXPAGE) {
                $("#next").hide();
            }
        }
    });

    $("#skip").click(function() {
       var goal = $("#skip_page").val();
       goal = parseInt(goal);
       if (goal > MAXPAGE) {
           alert("最大页数为" + MAXPAGE + "哦");
       } else if (goal <= 0) {
           alert("请输入一个正数哦");
       } else if (Math.ceil(goal) !== goal) {
           alert("请输入一个正整数哦");
       } else if (goal === current_page){
           alert("请去往一个不同的页面哦");
       } else {
           if (current_page === 1) {
               $("#prev").show();

           } else if (current_page === MAXPAGE) {
               $("#next").show();

           }
           if (goal === MAXPAGE) {
               $("#next").hide();
           } else if (goal === 1) {
               $("#prev").hide();
           }
           current_page = goal;
           pagination();
       }
    });

    /**
     * 分页函数
     */
    function pagination() {
        $("#news").empty();
        $("#news").append('<tr><th>标题</th><th>来源</th>' +
            '<th>URL</th><th>发布日期</th><th>关键词</th></tr>');

        for (let list of all_data.slice((current_page - 1) * PERPAGE, current_page * PERPAGE)) {
            let table;
            num = 0;
            // 奇数行偶数行使用不同的颜色背景
            if (cnt == 1) {
                table = '<tr>';
            } else {
                table = '<tr class="alt">'
            }

            Object.values(list).forEach(element => {
                // 第二个位置是url的位置，将其转变为跳转按钮
                if (num !== 2) {
                    table += ('<td>' + element + '</td>');
                } else {
                    table += ('<td style="width: 80px">' + '<a href=\"' + element + '\">点击跳转</a>' + '</td>');
                }
                num++;
            });
            $("#news").append(table + "</tr>");
            cnt = 1 - cnt;
        }
        var str =  "第" + current_page  + "页/共" + MAXPAGE + "页";
        $("#page").html(str);
    }
});
