var ungraded;
var numOfUngraded = $('tr:contains("未评")').length;

function waitForAppearance(element, callBack) {
    if($(".alert-modal").length) {
        return;
    }
    window.setTimeout( function() {
        if($(element).length){
            if(element == 'div.col-sm-8:contains("当前评价课程为")') {
                autoGrade();
            } else {
                waitForDisappearance();
            }
        }else{
            waitForAppearance(element, callBack);
        }
    }, 200);
}

function waitForDisappearance() {
    window.setTimeout( function() {
        if($(".success-modal").length == 0) {
            waitForRefresh();
        } else {
            waitForDisappearance();
        }
    }, 200);
}

function waitForRefresh() {
    window.setTimeout( function() {
        var num = $('tr:contains("未评")').length;
        if(num != numOfUngraded) {
            numOfUngraded = num;
            gotoNext();
        } else {
            waitForRefresh();
        }
    }, 5000);
}

function gotoNext() {
    ungraded = $('tr:contains("未评"):first');
    if(ungraded.length == 0) return;

    $("#tempGrid").setSelection(ungraded.attr("id"));

    waitForAppearance('div.col-sm-8:contains("当前评价课程为")', autoGrade);
}

function autoGrade() {
    $(".input-xspj-1 label input").prop("checked",true);
    let pjContent = $('#jsxm').html() + "老师辛苦了！";
    $("textarea.input-zgpj").text(pjContent);
    $("#btn_xspj_tj").click();
    $('#btn_ok').click();
    waitForRefresh();
}

gotoNext();