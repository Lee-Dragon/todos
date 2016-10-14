$(function () {
    var p1=$('.page1');
    var p2=$('.page2');
    var p3=$('.page3');
    var add=$('.page1 .add');
    var back=$('.page2 .back');
    var sel=$('.page2 .sel');
    var enter=$('.page3 .enter');
    var items=$('.page1 .items');
    var cancel=$('.page1 .lists .cancel');
    var edit=$('.page1 .lists .edit');
    var clear=$('.page1 .lists .clear');
    var menu=$('.page1 .menu');
    var yi=$('.week .all .yi');
    var date=new Date();
    var zhou=date.getDay();
    var riqi,cal;

    yi.width(zhou/7*($('.all').width()));
    var dict={1:'周一',2:'周二',3:'周三',4:'周四',5:'周五',6:'周六',7:'周日'};
    $('.month .yi').width(date.getDate()/31*($('.all').width()));
    $('.year .yi').width((date.getMonth()+1)/12*($('.all').width()));
    // $('.all .dang').offset({'left':zhou/7*($('.all').width()+$('.all .dang').width())}).text(zhou);
    $('.week .all .dang').text(dict[zhou]);
    $('.month .all .dang').text(date.getDate());
    $('.year .all .dang').text(date.getMonth()+1);
    var todos=[];
    if(localStorage.todo_data){
        //转换成字符串格式的数组
        todos=JSON.parse(localStorage.todo_data);
        render();
    }else{
        // 将字符串格式的数组转换成正常的数组
        localStorage.todo_data=JSON.stringify(todos);
    }
    // 渲染页面
    function render() {
        var xia=Math.floor(Math.random()*4);
        $('.page1 .items').empty();
        $.each(todos,function (i,v) {
            $('<li class="item"><div class="state"></div><div class="todo">'+v.title+'</div><i class="icon-font del icon-del"></i></li>').addClass(function () {
                if(v.state){
                    return 'done';
                }
            }).appendTo('.page1 .items');
        })
    }
    // 添加条目
    function addtodo() {
        $('.page3 .tag .date .tag-name').val('日期');
        $('.page3 input').on('focus',function () {
            cal=''+new Date().getDate()+'/'+(new Date().getMonth()+1)+'';
            $('.page3 .tag .date .tag-name').val(cal);

        })
        $('.page3 .date .tag-name').on('focus',function () {
            $(this).val('');

        })
        $('.page3 .date .tag-name').on('blur',function () {
            riqi=$('.page3 .date .tag-name').val();

        })
        enter.on('click',function () {
            var val=$('.page3 input').val();
            $('.page3 input').val('');
            if(riqi){
                todos.push({title:val+'--'+riqi,state:0,isDel:0});
            }else{
                todos.push({title:val+'--'+cal,state:0,isDel:0});

            }
            localStorage.todo_data=JSON.stringify(todos);
            render();
            p3.fadeOut().removeClass('up');
            p1.fadeIn().css('transform','translate3d(0,0,0)');
        })
    }
    addtodo();
    p2.hide();
    p3.hide();
    add.on('click',function () {
        // p1.fadeOut(200);
        // p2.fadeIn(300);
        p1.css('transform','translate3d(-100%,0,0)');
        p2.addClass('in').fadeIn().css('transform','translate3d(0,0,0)');
    });
    back.on('click',function () {
        // p2.fadeOut(200);
        // p1.fadeIn(300);
        p1.css('transform','translate3d(0,0,0)');
        p2.removeClass('in').fadeOut().css('transform','translate3d(1000px,0,0)');
    });
    sel.on('click',function () {
        p2.hide();
        // alert(1)
        console.log(p3)
        p3.addClass('up').fadeIn().css('transform','translate3d(0,0,0)');
    })
    menu.on('click',function () {
        // alert('')
       $('.clear').triggerHandler('click');
    })

    var del=$('.page1 .items .item .del');
    var item=$('.page1 .item');

    //del
    items.on('click','.del',function () {
        var re=$(this).closest('.item');
        var i=re.index();
        todos.splice(i,1);
        localStorage.todo_data=JSON.stringify(todos);
       re.addClass('fade').delay(500).queue(function () {
           $(this).remove().dequeue();
       })
    })
    //touch
    var left=null;
    items.on('touchstart',item,function (e) {
        left=e.originalEvent.changedTouches[0].pageX;
        tar=e.originalEvent.srcElement;
        var xiabiao=$(tar).closest('.item').index();
        t=setTimeout(function () {
            $('.lists').addClass('active');
            edit.on('click',function () {
                // function modify(el) {
                    $('.page1 .lists').removeClass('active').css('transform','translate3d(0,0,0)');
                    // var todo=$('.todo',el)
                    // console.log(el,todo)
                    $('.page5').addClass('active').fadeIn();
                    $('<input class="xiu">').appendTo(tar);
                    var oldval=$(this).find('.todo').text();
                    var newval;
                    $('.xiu').get(0).focus();
                    $('.xiu').on('blur',function () {
                        var str='        '+new Date().getDate()+'/'+new Date().getMonth();
                        newval=$(this).val()+str;
                        $(this).closest('.todo').text(newval);
                        todos[xiabiao].title=newval;
                        localStorage.todo_data=JSON.stringify(todos);

                    })
                    // $('.todo').get(0).removeChild($('.xiu').get(0));
                    // $('.xiu').get(0)=null;
                // }
                // modify(tar)
            })
        },1000);
    })

    //右划
    items.on('touchmove','.item',function (e) {
        var n=e.originalEvent.changedTouches[0].pageX;
        // $(this).css('transition','.5s ease');
        $(this).css('transform','translate3d('+(n-left)+'px,0,0)')
    })
    //右划 已完成
    items.on('touchend','.item',function (e) {
        var x=e.originalEvent.changedTouches[0].pageX;
        $(this).css('transition','.5s ease');
        $(this).css('transform','translate3d(0,0,0)')
        if(x-left>=40){
            $(this).addClass('done');
            $('<i>')
            var index=$(this).closest('li').index();
            todos[index].state=1;
            localStorage.todo_data=JSON.stringify(todos);
        }
        clearInterval(t)
    })
    //修改



    clear.on('click',function () {
        var all=$('.done');
        all.addClass('fade').delay(500).queue(function () {
            $(this).remove().dequeue();
            $('.lists').removeClass('active').css('transform','translate3d(0,0,0)');
            var old=todos;
            todos=[];
            $.each(old,function (i,v) {
                if(v.state!==1){
                    todos.push(v);
                }
            })
            localStorage.todo_data=JSON.stringify(todos);
            render()

        })


    })
    $('.lists .cancel').on('click',function () {
        $(this).closest('.lists').removeClass('active').css('transform','translate3d(0,0,0)');
    })


    






})//jiazai