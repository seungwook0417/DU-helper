if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

function getMaxContentIdx() {
    var lists = $(".item-title-lesson");
    return lists.length;
}

function getNextContentIdx() {
    var lists = $(".item-title-lesson");
    var val = $(".item-title-lesson-on").attr("val");
    var nextIdx = '';
    lists.each(function(idx, e) {
      var eVal = $(this).attr("val");
      if (eVal == val) {
        nextIdx = (++idx); 
        return false;
      }
    });
    return nextIdx;
  }

function nextLecture() {
    var max = getMaxContentIdx();
	var idx = getNextContentIdx();
    if (idx >= max){
        $("#close_").click();
        if (Notification.permission === "granted") {
            let noti = new Notification("대구대학교 스마트LMS", { body: "마지막 강의가 종료되었습니다." });
        } else {
            
        }
    } else{
        $("#next_").click();
        if (Notification.permission === "granted") {
            let noti = new Notification("대구대학교 스마트LMS", { body: "강의가 종료되었습니다." });
        } else {
            
        }
    }
}

// 수강과목 들어가기
function enter_eclass(KJKEY) {
    $.ajax({
        url: "/ilos/st/course/eclass_room2.acl",
        type: "POST",
        data: {
            KJKEY: KJKEY,
            returnData: "json",
            returnURI: "/ilos/st/course/online_list_form.acl",
            encoding: "utf-8"
        },
        async: false,
        success: function (data) {
            if (data.isError) {
                return false;
            } else {
                return true;
            }
        }
    });
}

function convertFromStringToDate(responseDate) {
    let dateComponents = responseDate.split(' ');
    let datePieces = dateComponents[0].split(".");
    let AMPM = dateComponents[1]
    let timePieces = dateComponents[2].split(":");

    if (AMPM == '오후'){
        timePieces[0] = parseInt(timePieces[0]) + 12;
    }

    return(new Date(datePieces[0], (datePieces[1] - 1), datePieces[2],
                            timePieces[0], timePieces[1]))
    }

function getDDay(deadline){
    var setDate = convertFromStringToDate(deadline);
    var now = new Date();
    var distance = setDate.getTime() - now.getTime();
    var day = Math.floor(distance/(1000*60*60*24));
    return day;
}

$(document).ready(function () {

    var urlHost = window.location.host;
    var urlPathname = window.location.pathname;
    if (urlHost === 'lms.daegu.ac.kr'  && urlPathname === '/ilos/main/main_form.acl') {

        var assignmentCrawling = new Object;
        var eclassRoomArray = document.querySelectorAll('em.sub_open');
        for (let i = 0; i < eclassRoomArray.length; i++) {
            var title = eclassRoomArray[i].title.split(" ")[0];
            var kjCode = eclassRoomArray[i].getAttribute('kj');
            assignmentCrawling[title] = kjCode;
        }

        if (jQuery.isEmptyObject(assignmentCrawling)) {
            return true;
        } else {
            $('div.icon-box').before(`
            <div class="gnb-top-class" id="active_button" return false;"></div>
            <div id='newprogress' style='box-sizing:border-box;'></div>
            `);

            $('div.shedule_form').after(`
                <div id='newAssignment' style='box-sizing:border-box;'></div>
                `);

            let today = new Date();

            var assignmentHtml = `
                <div class="title-01">
                    <div class="bar site-background-color"></div>
                    <span>과제목록</span><br>
                </div>
                <table class="course-datatable" border="1">
                    <caption></caption>
                    <colgroup>
                        <col style="width:50%;">
                        <col style="width:30%;">
                        <col style="width:20%;">
                    </colgroup>
                    <thead>
                        <tr>
                        <th scope="col" class="first">과제명</th>
                        <th scope="col">마감 기한</th>
                        <th scope="col" class="last">제출 여부</th>
                        </tr>
                    </thead>
            `;

            var progressHtml = `
                <div class="m-box1" style="position: relative;">
                    <div class="title-01" style="margin: 15px 19px 15px 19px;">
                        <span class="site-font-color">온라인강의 진도율</span>
                    </div>
                <table class="bbsview" border="1">
                    <caption></caption>
                    <colgroup>
                        <col style="width:50%;">
                        <col style="width:50%;">
                    </colgroup>
                    <thead>
                        <tr>
                        <th scope="col" class="first">과목명</th>
                        <th scope="col" class="last">진도율</th>
                        </tr>
                    </thead>
            `;           


            var temp_assignment = new Object;
            var temp_progress = new Object;

            for (var courseName in assignmentCrawling) {
                enter_eclass(assignmentCrawling[courseName]);

                // 온라인 강의 진도율
                $.ajax({
                    url: "/ilos/st/course/online_list_form.acl",
                    type: "POST",
                    success: function (data) {
                        var locationmap = $('.locationmap', data).get();
                        var title = locationmap[0].children[3].textContent;
                        var online_progress = $('#content_text', data).get();
                        var test = online_progress[0].children[3]
                        var _KJKEY = online_progress[0].children[2].children[2].value
                        var tbody_progress = test.querySelector('tbody');
                        var progress_rate  = tbody_progress.querySelectorAll('div');

                        var recommend = progress_rate[2].textContent;
                        var current = progress_rate[5].textContent;

                        if (recommend != current){
                            progressHtml += `
                            <tr class="" style="cursor:pointer;" onclick="eclassRoom('${_KJKEY}')">
                                <td rowspan="2" style="color:black">${title}</td>
                                <td style="color:black">권장진도율 : <span style="color:green";>${recommend}</span></td>
                            </tr>
                            <tr class="" style="cursor:pointer;" onclick="eclassRoom('${_KJKEY}')">
                                <td style="color:black">나의진도율 : <span style="color:red";>${current}</span></td>
                            </tr>
                            `;
                            $('div#newprogress').html(progressHtml);

                            temp_progress[title] = _KJKEY
                        }
                        progressHtml += `
                            <tr class="" style="cursor:pointer;" onclick="eclassRoom('${_KJKEY}')">
                                <td rowspan="2" style="color:black">${title}</td>
                                <td style="color:black">권장진도율 : <span style="color:green";>${recommend}</span></td>
                            </tr>
                            <tr class="" style="cursor:pointer;" onclick="eclassRoom('${_KJKEY}')">
                                <td style="color:black">나의진도율 : <span style="color:red";>${current}</span></td>
                            </tr>
                            `;
                            $('div#newprogress').html(progressHtml);

                        
                    }
                });
                


                // 수강과목 과제 가져오기
                $.ajax({
                    url: "/ilos/st/course/report_list.acl",
                    type: "POST",
                    data: {
                        start: "",
                        display: "1",
                        SCH_VALUE: "",
                        ud: "",
                        ky: "",
                        encoding: "utf-8"
                    },
                    async: false,
                    success: function (data) {
                        var trhtmlList = $('tr', data).get();
                        for (var i = 1; i < trhtmlList.length; i++) {
                            try {
                                var deadline = trhtmlList[i].children[7].title;
                                if (today <= convertFromStringToDate(deadline)) {
                                    var title = `[${courseName}] ` + $(trhtmlList[i]).find("div.subjt_top").text();
                                    var Submit = trhtmlList[i].children[4].children[0].title;
                                    var dDay = getDDay(deadline);
                                    var dDay_color;
                                    if (dDay === 0) {
                                        dDay = "DAY";
                                        dDay_color = "#FF0000";
                                    } else {
                                        dDay_color = "#FF0000";
                                    } 
                                    if (Submit === '제출') {
                                        var Submit_color = 'green';
                                    } else if (Submit === '미제출') {
                                        var Submit_color = '#FF0000';
                                    }
                                    assignmentHtml += `
                                    <tr class="" style="cursor:pointer;" onclick="eclassRoom1('${assignmentCrawling[courseName]}','/ilos/st/course/report_list_form.acl')">
                                        <td style="color:black">${title}</td>
                                        <td style="color:black">${deadline}<span style="color:${dDay_color};"> [${"D-"+dDay}]</span></td>
                                        <td style="color:${Submit_color}" class="">${Submit}</td>
                                    </tr>
                                    `;
                                    temp_assignment[title] = assignmentCrawling[courseName]
                                    
                                }
                                
                            } catch (error) {
                                continue;
                            }
                            
                        }
                        
                    }
                });

                
            }          

            if (jQuery.isEmptyObject(temp_assignment)) {
                assignmentHtml +='<tr><td colspan="4" height="30" class="last">조회할 자료가 없습니다</td></tr>';
            }

            if (jQuery.isEmptyObject(temp_progress)) {
                progressHtml +='<tr><td colspan="4" height="30" class="last">조회할 자료가 없습니다</td></tr>';
            }

            assignmentHtml += `
                </table>
            `;

            $('div#newprogress').html(progressHtml);
            $('div#newAssignment').html(assignmentHtml);

            
            

            chrome.storage.sync.get(`Active`, function(data) {
                let Active = data[`Active`];
                if (Active === "False"){
                    var active_button_Html = '<div class="gnb-top-class-off" style="width: 295px; background-color:#f59494; color:#fff;  border-radius: 4px;">LMS+ 비활성화 상태</div>'
                }else{
                    var active_button_Html = '<div class="gnb-top-class-off" style="width: 295px; background-color:#3C8794; color:#fff;  border-radius: 4px;">LMS+ 활성화 상태</div>'
                }
                $('div#active_button').html(active_button_Html);
            });
            
        }
    
    } else if (urlHost === 'lms.daegu.ac.kr' && urlPathname === '/ilos/st/course/online_view_form.acl') {
        chrome.storage.sync.get(`Active`, function(data) {
            let Active = data[`Active`];
            if (Active === "True"){
                document.querySelector("iframe").addEventListener('load', () => {
                    let video = document.querySelector("iframe").contentDocument.querySelector("video#test_player_html5_api");
                    
                    video.addEventListener("ended", () => {
                        nextLecture()     
                    });
                    if (video.paused == true){
                        video.muted=true; 
                        video.play();
                        video.autoplay=true;
                    }
                })
            }
            
        })
        $("#contentViewer").on("load", function() {
            let head = $("#contentViewer").contents().find("head");
            let css = '<style>.vjs-fullscreen-control{display:block !important;}video{outline:none;}</style>';
            $(head).append(css);
        });

    } else if (urlHost === 'lms.daegu.ac.kr' && urlPathname === '/ilos/st/course/lecture_material_list_form.acl') {
        chrome.storage.sync.get(`Active`, function(data) {
            let Active = data[`Active`];
            if (Active === "True"){
                var all_download_Html = '   <div id="all_download" class="btntype">전체 다운로드</div>'
                $('div.btntype').after(all_download_Html);
            }
            
        })
    }else {
        return true;
    }

});

$(document).on('click','#all_download',function(){
    var materiallist = document.querySelectorAll('td.center.impt.impt_off');
    var KJ = document.querySelector('input#KJ_KEY');
    var KJ_value = KJ.getAttribute('value');

    for (let i = 0; i < materiallist.length; i++) {
        var impt_seq = materiallist[i].getAttribute('impt_seq');
        window.open('https://lms.daegu.ac.kr/ilos/pf/course/lecture_material_list_zip_download2.acl?CONTENT_SEQ='+impt_seq+'&ky='+KJ_value+'&ud=&pf_st_flag=2')
    }
});

$(document).on('click','#active_button',function(){
    chrome.storage.sync.get(`Active`, function(data) {
        let Active = data[`Active`];

        if (Active === "False"){
            var active_button_Html = '<div class="gnb-top-class-off" style="width: 295px; background-color:#3C8794; color:#fff;  border-radius: 4px;">LMS+ 활성화 상태</div>'
            chrome.storage.sync.set({[`Active`] : 'True'}, function() {
            });
        }else{
            var active_button_Html = '<div class="gnb-top-class-off" style="width: 295px; background-color:#f59494; color:#fff;  border-radius: 4px;">LMS+ 비활성화 상태</div>'
            chrome.storage.sync.set({[`Active`] : 'False'}, function() {
            }); 
        }
        $('div#active_button').html(active_button_Html);
    });
});