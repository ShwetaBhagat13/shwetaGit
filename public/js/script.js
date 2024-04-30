//------------------ Notice Board : Scroll Box----------------

$(document).ready(function () {
    var Scrollbar = window.Scrollbar;
    Scrollbar.use(window.OverscrollPlugin);
    var customScroll = Scrollbar.init(document.querySelector(".js-scroll-list"), {
        plugins: {
            overscroll: true
        }
    });

    var listItem = $(".js-scroll-list-item");

    listItem.eq(0).addClass("item-focus");
    listItem.eq(1).addClass("item-next");

    customScroll.addListener(function (status) {
        var $content = $(".js-scroll-content");

        var viewportScrollDistance = 0;

        viewportScrollDistance = status.offset.y;
        var viewportHeight = $content.height();
        var listHeight = 0;
        var $listItems = $content.find(".js-scroll-list-item");
        for (var i = 0; i < $listItems.length; i++) {
            listHeight += $($listItems[i]).height();
        }

        var top = status.offset.y;
        // console.log(top);
        var visibleCenterVertical = 0;
        visibleCenterVertical = top;

        var parentTop = 1;
        var $lis = $(".js-scroll-list-item");
        var $focusLi;
        for (var i = 0; i < $lis.length; i++) {
            var $li = $($lis[i]);
            var liTop = $li.position().top;
            var liRelTop = liTop - parentTop;
            var distance = 0;
            var distance = Math.abs(top - liRelTop);
            var maxDistance = $(".js-scroll-content").height() / 2;
            var distancePercent = distance / (maxDistance / 100);

            if (liRelTop + $li.parent().scrollTop() > top) {
                if (!$li.hasClass("item-focus")) {
                    $li.prev().addClass("item-hide");
                    $lis.removeClass("item-focus");
                    $lis.removeClass("item-next");
                }
                $li.removeClass("item-hide");
                $li.addClass("item-focus");
                $li.next().addClass("item-next");
                break;
            }
        }
    });
}); 
  
//--------------------Event------------------------------------------------
//tabs
function openYear(evt, yearName) {
    var i, x, tablinks;
    x = document.getElementsByClassName("years");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < x.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" w3-red", "");
    }
    document.getElementById(yearName).style.display = "block";
    evt.currentTarget.className += " w3-red";
}

//-----------------------
//for 2021-22
function addRow() {
    var date = document.getElementById("date").value;
    var title = document.getElementById("title").value;
    var sname = document.getElementById("sname").value;
    var desg = document.getElementById("desg").value;
    var report = document.getElementById("report").value;
    var outcomes = document.getElementById("outcomes").value;
    var participants = document.getElementById("participants").value;
    var table = document.getElementById("tableData");
    var row = table.insertRow();
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);
    var cell7 = row.insertCell(6);
    var cell8 = row.insertCell(7);
    cell1.innerHTML = date;
    cell2.innerHTML = title;
    cell3.innerHTML = sname;
    cell4.innerHTML = desg;
    cell5.innerHTML = report;
    cell6.innerHTML = outcomes;
    cell7.innerHTML = participants;
    cell8.innerHTML = '<button onclick="editRow(this)">Edit</button> <button onclick="deleteRow(this)">Delete</button>';
    saveData(date, title, sname, desg, report, outcomes, participants);
    document.getElementById("date").value = "";
    document.getElementById("title").value = "";
    document.getElementById("sname").value = "";
    document.getElementById("desg").value = "";
    document.getElementById("report").value = "";
    document.getElementById("outcomes").value = "";
    document.getElementById("participants").value = "";
}

function editRow(button) {
    var row = button.parentNode.parentNode;
    var date = row.cells[0].innerHTML;
    var title = row.cells[1].innerHTML;
    var sname = row.cells[2].innerHTML;
    var desg = row.cells[3].innerHTML;
    var report = row.cells[4].innerHTML;
    var outcomes = row.cells[5].innerHTML;
    var participants = row.cells[6].innerHTML;
    var newDate = prompt("Enter new date", date);
    var newTitle = prompt("Enter new title", title);
    var newSname = prompt("Enter new sname", sname);
    var newDesg = prompt("Enter new desg", desg);
    var newReport = prompt("Enter new report", report);
    var newOutcomes = prompt("Enter new outcomes", outcomes);
    var newParticipants = prompt("Enter new participants", participants);
    if (newDate != null && newTitle != null && newSname != null && newDesg != null && newReport != null && newOutcomes != null && newParticipants != null) {
        row.cells[0].innerHTML = newDate;
        row.cells[1].innerHTML = newTitle;
        row.cells[2].innerHTML = newSname;
        row.cells[3].innerHTML = newDesg;
        row.cells[4].innerHTML = newReport;
        row.cells[5].innerHTML = newOutcomes;
        row.cells[6].innerHTML = newParticipants;
        updateData(date, title, sname, desg, report, outcomes, participants, newDate, newTitle, newSname, newDesg, newReport, newOutcomes, newParticipants);
    }
}

function deleteRow(button) {
    var row = button.parentNode.parentNode;
    var date = row.cells[0].innerHTML;
    var title = row.cells[1].innerHTML;
    var sname = row.cells[2].innerHTML;
    var desg = row.cells[3].innerHTML;
    var report = row.cells[4].innerHTML;
    var outcomes = row.cells[5].innerHTML;
    var participants = row.cells[6].innerHTML;
    row.remove();
    deleteData(date, title, sname, desg, report, outcomes, participants);
}

function saveData(date, title, sname, desg, report, outcomes, participants) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
        }
    };
    xhttp.open("POST", "/add_data", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send("date=" + date + "&title=" + title + "&sname=" + sname + "&desg=" + desg + "&report=" + report + "&outcomes=" + outcomes + "&participants=" + participants);
}

function updateData(oldDate, oldTitle, oldSname, oldDesg, oldReport, oldOutcomes, oldParticipants, newDate, newTitle, newSname, newDesg, newReport, newOutcomes, newParticipants) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
        }
    };
    xhttp.open("POST", "/update_data", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send("oldDate=" + oldDate + "&oldTitle=" + oldTitle + "&oldSname=" + oldSname + "&oldDesg=" + oldDesg + "&oldReport=" + oldReport + "&oldOutcomes=" + oldOutcomes + "&oldParticipants=" + oldParticipants + "&newDate=" + newDate + "&newTitle=" + newTitle + "&newSname=" + newSname + "&newDesg=" + newDesg + "&newReport=" + newReport + "&newOutcomes=" + newOutcomes + "&newParticipants=" + newParticipants);
}

function deleteData(date, title, sname, desg, report, outcomes, participants) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
        }
    };
    xhttp.open("POST", "/delete_data", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send("date=" + date + "&title=" + title + "&sname=" + sname + "&desg=" + desg + "&report=" + report + "&outcomes=" + outcomes + "&participants=" + participants);
}

//for 2022-23
function addRow2() {
    var date2 = document.getElementById("date2").value;
    var title2 = document.getElementById("title2").value;
    var sname2 = document.getElementById("sname2").value;
    var desg2 = document.getElementById("desg2").value;
    var report2 = document.getElementById("report2").value;
    var outcomes2 = document.getElementById("outcomes2").value;
    var participants2 = document.getElementById("participants2").value;
    var table2 = document.getElementById("tableData2");
    var row2 = table2.insertRow();
    var cell1 = row2.insertCell(0);
    var cell2 = row2.insertCell(1);
    var cell3 = row2.insertCell(2);
    var cell4 = row2.insertCell(3);
    var cell5 = row2.insertCell(4);
    var cell6 = row2.insertCell(5);
    var cell7 = row2.insertCell(6);
    var cell8 = row2.insertCell(7);
    cell1.innerHTML = date2;
    cell2.innerHTML = title2;
    cell3.innerHTML = sname2;
    cell4.innerHTML = desg2;
    cell5.innerHTML = report2;
    cell6.innerHTML = outcomes2;
    cell7.innerHTML = participants2;
    cell8.innerHTML = '<button onclick="editRow2(this)">Edit</button> <button onclick="deleteRow2(this)">Delete</button>';
    saveData2(date2, title2, sname2, desg2, report2, outcomes2, participants2);
    document.getElementById("date2").value = "";
    document.getElementById("title2").value = "";
    document.getElementById("sname2").value = "";
    document.getElementById("desg2").value = "";
    document.getElementById("report2").value = "";
    document.getElementById("outcomes2").value = "";
    document.getElementById("participants2").value = "";
}

function editRow2(button) {
    var row2 = button.parentNode.parentNode;
    var date2 = row2.cells[0].innerHTML;
    var title2 = row2.cells[1].innerHTML;
    var sname2 = row2.cells[2].innerHTML;
    var desg2 = row2.cells[3].innerHTML;
    var report2 = row2.cells[4].innerHTML;
    var outcomes2 = row2.cells[5].innerHTML;
    var participants2 = row2.cells[6].innerHTML;
    var newDate2 = prompt("Enter new date", date2);
    var newTitle2 = prompt("Enter new title", title2);
    var newSname2 = prompt("Enter new sname", sname2);
    var newDesg2 = prompt("Enter new desg", desg2);
    var newReport2 = prompt("Enter new report", report2);
    var newOutcomes2 = prompt("Enter new outcomes", outcomes2);
    var newParticipants2 = prompt("Enter new participants", participants2);
    if (newDate2 != null && newTitle2 != null && newSname2 != null && newDesg2 != null && newReport2 != null && newOutcomes2 != null && newParticipants2 != null) {
        row2.cells[0].innerHTML = newDate2;
        row2.cells[1].innerHTML = newTitle2;
        row2.cells[2].innerHTML = newSname2;
        row2.cells[3].innerHTML = newDesg2;
        row2.cells[4].innerHTML = newReport2;
        row2.cells[5].innerHTML = newOutcomes2;
        row2.cells[6].innerHTML = newParticipants2;
        updateData2(date2, title2, sname2, desg2, report2, outcomes2, participants2, newDate2, newTitle2, newSname2, newDesg2, newReport2, newOutcomes2, newParticipants2);
    }
}

function deleteRow2(button) {
    var row2 = button.parentNode.parentNode;
    var date2 = row2.cells[0].innerHTML;
    var title2 = row2.cells[1].innerHTML;
    var sname2 = row2.cells[2].innerHTML;
    var desg2 = row2.cells[3].innerHTML;
    var report2 = row2.cells[4].innerHTML;
    var outcomes2 = row2.cells[5].innerHTML;
    var participants2 = row2.cells[6].innerHTML;
    row2.remove();
    deleteData2(date2, title2, sname2, desg2, report2, outcomes2, participants2);
}

function saveData2(date2, title2, sname2, desg2, report2, outcomes2, participants2) {
    var xhttp2 = new XMLHttpRequest();
    xhttp2.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
        }
    };
    xhttp2.open("POST", "/add_data2", true);
    xhttp2.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp2.send("date2=" + date2 + "&title2=" + title2 + "&sname2=" + sname2 + "&desg2=" + desg2 + "&report2=" + report2 + "&outcomes2=" + outcomes2 + "&participants2=" + participants2);
}

function updateData2(oldDate2, oldTitle2, oldSname2, oldDesg2, oldReport2, oldOutcomes2, oldParticipants2, newDate2, newTitle2, newSname2, newDesg2, newReport2, newOutcomes2, newParticipants2) {
    var xhttp2 = new XMLHttpRequest();
    xhttp2.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
        }
    };
    xhttp2.open("POST", "/update_data2", true);
    xhttp2.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp2.send("oldDate2=" + oldDate2 + "&oldTitle2=" + oldTitle2 + "&oldSname2=" + oldSname2 + "&oldDesg2=" + oldDesg2 + "&oldReport2=" + oldReport2 + "&oldOutcomes2=" + oldOutcomes2 + "&oldParticipants2=" + oldParticipants2 + "&newDate2=" + newDate2 + "&newTitle2=" + newTitle2 + "&newSname2=" + newSname2 + "&newDesg2=" + newDesg2 + "&newReport2=" + newReport2 + "&newOutcomes2=" + newOutcomes2 + "&newParticipants2=" + newParticipants2);
}

function deleteData2(date2, title2, sname2, desg2, report2, outcomes2, participants2) {
    var xhttp2 = new XMLHttpRequest();
    xhttp2.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
        }
    };
    xhttp2.open("POST", "/delete_data2", true);
    xhttp2.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp2.send("date2=" + date2 + "&title2=" + title2 + "&sname2=" + sname2 + "&desg2=" + desg2 + "&report2=" + report2 + "&outcomes2=" + outcomes2 + "&participants2=" + participants2);
}

//for 2023-24
function addRow3() {
    var date3 = document.getElementById("date3").value;
    var title3 = document.getElementById("title3").value;
    var sname3 = document.getElementById("sname3").value;
    var desg3 = document.getElementById("desg3").value;
    var report3 = document.getElementById("report3").value;
    var outcomes3 = document.getElementById("outcomes3").value;
    var participants3 = document.getElementById("participants3").value;
    var table3 = document.getElementById("tableData3");
    var row3 = table3.insertRow();
    var cell1 = row3.insertCell(0);
    var cell2 = row3.insertCell(1);
    var cell3 = row3.insertCell(2);
    var cell4 = row3.insertCell(3);
    var cell5 = row3.insertCell(4);
    var cell6 = row3.insertCell(5);
    var cell7 = row3.insertCell(6);
    var cell8 = row3.insertCell(7);
    cell1.innerHTML = date3;
    cell2.innerHTML = title3;
    cell3.innerHTML = sname3;
    cell4.innerHTML = desg3;
    cell5.innerHTML = report3;
    cell6.innerHTML = outcomes3;
    cell7.innerHTML = participants3;
    cell8.innerHTML = '<button onclick="editRow3(this)">Edit</button> <button onclick="deleteRow3(this)">Delete</button>';
    saveData3(date3, title3, sname3, desg3, report3, outcomes3, participants3);
    document.getElementById("date3").value = "";
    document.getElementById("title3").value = "";
    document.getElementById("sname3").value = "";
    document.getElementById("desg3").value = "";
    document.getElementById("report3").value = "";
    document.getElementById("outcomes3").value = "";
    document.getElementById("participants3").value = "";
}

function editRow3(button) {
    var row3 = button.parentNode.parentNode;
    var date3 = row3.cells[0].innerHTML;
    var title3 = row3.cells[1].innerHTML;
    var sname3 = row3.cells[2].innerHTML;
    var desg3 = row3.cells[3].innerHTML;
    var report3 = row3.cells[4].innerHTML;
    var outcomes3 = row3.cells[5].innerHTML;
    var participants3 = row3.cells[6].innerHTML;
    var newDate3 = prompt("Enter new date", date3);
    var newTitle3 = prompt("Enter new title", title3);
    var newSname3 = prompt("Enter new sname", sname3);
    var newDesg3 = prompt("Enter new desg", desg3);
    var newReport3 = prompt("Enter new report", report3);
    var newOutcomes3 = prompt("Enter new outcomes", outcomes3);
    var newParticipants3 = prompt("Enter new participants", participants3);
    if (newDate3 != null && newTitle3 != null && newSname3 != null && newDesg3 != null && newReport3 != null && newOutcomes3 != null && newParticipants3 != null) {
        row3.cells[0].innerHTML = newDate3;
        row3.cells[1].innerHTML = newTitle3;
        row3.cells[2].innerHTML = newSname3;
        row3.cells[3].innerHTML = newDesg3;
        row3.cells[4].innerHTML = newReport3;
        row3.cells[5].innerHTML = newOutcomes3;
        row3.cells[6].innerHTML = newParticipants3;
        updateData3(date3, title3, sname3, desg3, report3, outcomes3, participants3, newDate3, newTitle3, newSname3, newDesg3, newReport3, newOutcomes3, newParticipants3);
    }
}

function deleteRow3(button) {
    var row3 = button.parentNode.parentNode;
    var date3 = row3.cells[0].innerHTML;
    var title3 = row3.cells[1].innerHTML;
    var sname3 = row3.cells[2].innerHTML;
    var desg3 = row3.cells[3].innerHTML;
    var report3 = row3.cells[4].innerHTML;
    var outcomes3 = row3.cells[5].innerHTML;
    var participants3 = row3.cells[6].innerHTML;
    row3.remove();
    deleteData3(date3, title3, sname3, desg3, report3, outcomes3, participants3);
}

function saveData3(date3, title3, sname3, desg3, report3, outcomes3, participants3) {
    var xhttp3 = new XMLHttpRequest();
    xhttp3.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
        }
    };
    xhttp3.open("POST", "/add_data3", true);
    xhttp3.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp3.send("date3=" + date3 + "&title3=" + title3 + "&sname3=" + sname3 + "&desg3=" + desg3 + "&report3=" + report3 + "&outcomes3=" + outcomes3 + "&participants3=" + participants3);
}

function updateData3(oldDate3, oldTitle3, oldSname3, oldDesg3, oldReport3, oldOutcomes3, oldParticipants3, newDate3, newTitle3, newSname3, newDesg3, newReport3, newOutcomes3, newParticipants3) {
    var xhttp3 = new XMLHttpRequest();
    xhttp3.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
        }
    };
    xhttp3.open("POST", "/update_data3", true);
    xhttp3.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp3.send("oldDate3=" + oldDate3 + "&oldTitle3=" + oldTitle3 + "&oldSname3=" + oldSname3 + "&oldDesg3=" + oldDesg3 + "&oldReport3=" + oldReport3 + "&oldOutcomes3=" + oldOutcomes3 + "&oldParticipants3=" + oldParticipants3 + "&newDate3=" + newDate3 + "&newTitle3=" + newTitle3 + "&newSname3=" + newSname3 + "&newDesg3=" + newDesg3 + "&newReport3=" + newReport3 + "&newOutcomes3=" + newOutcomes3 + "&newParticipants3=" + newParticipants3);
}

function deleteData3(date3, title3, sname3, desg3, report3, outcomes3, participants3) {
    var xhttp3 = new XMLHttpRequest();
    xhttp3.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
        }
    };
    xhttp3.open("POST", "/delete_data3", true);
    xhttp3.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp3.send("date3=" + date3 + "&title3=" + title3 + "&sname3=" + sname3 + "&desg3=" + desg3 + "&report3=" + report3 + "&outcomes3=" + outcomes3 + "&participants3=" + participants3);
}

