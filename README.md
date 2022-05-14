# 上海交通大学自动评教脚本(Auto Grade）

## Warning (2022/5/14)

现在教学信息服务网有检测脚本功能，所以本脚本暂时不能正常运行。

## 目录(Table of Contents)

- [中文使用指南](#评教脚本使用指南)
- [English User Guide](#user-guide)

## 评教脚本使用指南

### 已知问题

- 脚本暂时不支持自动翻页，i.e.只支持自动评价前15门课，第二页之后的还是要手动评教。如果有需求，请在issue中提出。
- 如果用户网络延迟过高，可能导致脚本无法正常工作。

### 脚本概述

本脚本有两个版本：

- **全自动**：开始运行后，所有的主观题会自动填入*教师姓名+“老师辛苦了”*，**不需要做任何额外操作**。如果你想要默认填入其他内容，在代码中搜索“老师辛苦了”，替换成其他内容即可。
- **半自动**：用户需要手动输入每门课的主观题内容，浏览器会使用对话框提示用户何时输入。在一门课评教完成后，用户必须手动确认“评教成功”才能继续。

### 第一步

进入你的**学生评价**界面。

### 第二步

如果您想使用**全自动**版本，请**复制**如下代码：

```javascript
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
```

如果您想使用**半自动**版本，请**复制**如下代码：

```javascript
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
    let courseInfo = $('div.col-sm-8:contains("当前评价课程为")').text();
    courseInfo = courseInfo.substring(courseInfo.indexOf("当前"), courseInfo.indexOf(";"))
    $("textarea.input-zgpj").text(prompt(courseInfo + "，主观题填什么？"));
    $("#btn_xspj_tj").click();
    waitForAppearance(".success-modal", waitForDisappearance);
}

gotoNext();
```

### 第三步

回到学生评价界面，打开浏览器的控制台。如果您不知道快捷键，请**右键点击**页面空白处，在弹出菜单中点击**检视/Inspect**或含义类似的选项（因浏览器而异）。然后，会有一个**内嵌窗口**从您浏览器中弹出，在顶部的**水平菜单**中选择**Console**。

### 第四步

将代码**粘贴**到下方的输入框中。再按下**回车键**。

### 第五步

开始评教。目前脚本**不会**在评教结束时提示用户。如果想要终止自动评教，请**刷新页面**。

## User Guide

### Known issues

- This script only works for the first page of courses, namely the first 15 courses.
- The script might not work properly under unstable or extremely laggy network conditions.

### Overview

There are two versions of the script:

- **Auto**: This version will automatically grade all ungraded courses non-stop, filling in the "主观题" section with pre-defined text. The default text is *教师姓名 + "老师辛苦了！"*. If you want something else, search for *老师辛苦了* in the code and replace it.
- **Semi-auto**: This version wil lnot automatically fill in the "主观题" section: a prompt will pop up asking you to fill in whatever you want to say about the course. And after grading a course, you will have to confirm "提交成功" in order to proceed.

### Step 1

Enter "Students evaluation" page.

### Step 2

For the **auto** version, **copy** the code snippet below:

```javascript
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
```

For the **semi-auto** version, **copy** the code snippet below:

```javascript
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
    let courseInfo = $('div.col-sm-8:contains("当前评价课程为")').text();
    courseInfo = courseInfo.substring(courseInfo.indexOf("当前"), courseInfo.indexOf(";"))
    $("textarea.input-zgpj").text(prompt(courseInfo + "，主观题填什么？"));
    $("#btn_xspj_tj").click();
    waitForAppearance(".success-modal", waitForDisappearance);
}

gotoNext();
```

### Step 3

Return to Student Evaluation page, and open the console of your browser. If you do not now the keyboard shortcut, please **right click** the page, click **Insepct** or something of similar meaning in the pop-up menu. An embedded window will pop up in your browser. On the top menu bar, select **Console**.

### Step 4

**Paste** the code in the input section and press **Enter**.

### Step 5

The grading starts。Current, the user will not be informed of the end of evaluation。If you want to terminate the process, simply **refresh the page**.

## Credit

[@xx01cyx](https://github.com/xx01cyx) came up with the idea and implemented the auto version. She's AWESOME.
