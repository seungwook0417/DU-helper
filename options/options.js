const itemColorList = ["white", "black"];
const itemLinkList =  ['홈페이지', '타이거즈', '포털', 'Smart LMS', '수강신청', '메일', '에브리타임', '무들', '비교과', '기숙사', 'DBpia', '전자출결', 'K-MOOC', 'DU-MOOC', '창파도서관', 'ALL_in_Care', 'LINC+사업단', 'ACE+사업단', '창업지원단', '증명서발급', '두드림', '학사일정', '사이트맵', '교내전화번호', '학사공지', '입학안내', '카카오_챗봇','나의 학과'];
const itemDepartmentList =['자유전공학부', '한국어교육학부', '글로벌언어문화학부(중국어중국학전공)', '글로벌언어문화학부(일본어일본학과)', '영어영문학과', '문화예술학부(디지털문예창작전공 / 문화콘텐츠전공 / 공연예술전공)', '체육학과', '스포츠레저학과', '법학부', '행정학과', '경찰학부(경찰행정학전공 / 자치경찰학전공)', '부동산지적학과', '군사학과', '경영학부(경영학전공)', '경영학부(무역학전공)', '경영학부(회계학전공)', '경영학부(경제학전공)', '경영학부(금융보험전공)', '호텔관광경영학부(호텔관광전공)', '호텔관광경영학부(관광경영전공)', '사회복지학과', '청소년상담복지학과', '아동가정복지학과', '지역사회개발·복지학과', '국제관계학과', '사회학과', '미디어커뮤니케이션학과', '문헌정보학과', '심리학과', '빅데이터학과', '화학생명과학부(나노화학전공)', '화학생명과학부(생명과학전공)', '화학생명과학부(원예학전공)', '화학생명과학부(바이오산업학전공)', '동물자원학과', '산림 자원학과', '반려동물산업학과', '건축공학과', '건설시스템공학과', '환경기술공학과', '기계학부(기계공학전공)', '기계학부(기계설계공학전공)', '기계학부(기계자동차공학전공)', '식품공학과', '식품영양학과', '생명공학과', 
'화학공학과', '조경학과', '신소재에너지시스템공학부(신소재에너지공학전공)', '신소재에너지시스템공학부(에너지시스템공학전공)', '전자전기공학부(전자공학전공)', '전자전기공학부(전기공학전공)', '전자전기공학부(정보통신 공학전공)', '컴퓨터정보공학부(컴퓨터공학전공)', '컴퓨터정보공학부(컴퓨터소프트웨어전공)', '컴퓨터정보공학부(정보보호전공)', '융합예술학부(아트앤디자인전공)', '융합예술학부(영상애니메이션디자인학과)', '융합예술학부( 생활조형디자인학과)', '시각디자인융합학부(시각디자인전공)', '시각디자인융합학부(서비스디자인전공)', '산업디자인학과', '패션디자인학과', '실내건축디자인학과', '국어교육과', '영어교육과', '역사교육과', '일반사회교육과', '지리교육과', '유아교육과', '특수교육과', '초등특수교육과', '유아특수교육과', '수학교육과', '물리교육과', '화학교육과', '생물교육과', '지구과학교육과', '직업재활학과', '언어치료학과', '재활심리학과', '재활공학과', '물리치료학과', '작업치료학과', '재활건강증진학과', '간호학과', 'AI학부(AI소프트웨어전공,AI엔터테인먼트전공)', '실버복지상담학전공', '자산관리・6차산업학전공', '평생교육·청소년학전공'];


/*메인 함수, 윈도우가 로드되면 실행*/
window.addEventListener('load', function(){
    

    /*학과 선택 옵션 생성 기능*/

    let formElement = document.getElementById('form-department');
    let selectElement = document.getElementById('select-department');

    //학과 선택 버튼 생성
    for (let item of itemDepartmentList) {
        var select = document.createElement('option');
        select.setAttribute('value', item);
        select.textContent = item;

        selectElement.appendChild(select);
    }

    let button = document.createElement('button');

    button.id = "button-department";
    button.textContent = "변경";

    //버튼 클릭시 학과 설정 동기화
    button.addEventListener('click', function() {
        let data = selectElement.options[selectElement.selectedIndex].value;
        
        chrome.storage.sync.set({Department: data}, function() { 
            window.alert(data + "로 변경 완료!");
        }); 
    });

    formElement.appendChild(button);

    /*바로가기 선택 옵션 생성 기능*/

    for (let i = 1; i <= 9; i++){
        itemLinkOptions(document.getElementById(`button-link-${i}`), itemLinkList, i);
    }
});

/*바로가기 선택 옵션 생성 함수*/
function itemLinkOptions(buttonLinkElement, itemLinkList, num) {
    for (let item of itemLinkList) {
        let button = document.createElement('button');
        button.textContent = item

        //버튼 클릭시 바로가기 설정 동기화
        button.addEventListener('click', function() {
            chrome.storage.sync.set({[`Link${num}`] : item}, function() {

            }); 
        });

        buttonLinkElement.appendChild(button);
    }
}