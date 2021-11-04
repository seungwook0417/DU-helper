/*메인 함수, DOM 로드되면 실행*/
window.addEventListener('DOMContentLoaded', function(){


    /*바로가기 생성 및 변경 기능*/
    
    //바로가기 9개 생성 및 변경
    for (let i = 1; i <= 9; i++) {
        setLink(document.getElementById(`item-link-${i}`), i);
    }

});

/*바로가기 생성 및 변경 데이터 파싱 함수*/
function setLink(itemLinkElement, num) {
    //크롬 스토리지에 동기화된 사용자 바로가기 데이터 가져오기
    chrome.storage.sync.get(`Link${num}`, function(data) {
        //json에서 Ajax로 페이지 이미지와 링크 불러오기
        let linkName = data[`Link${num}`];
        console.log(linkName)
        fetch(chrome.extension.getURL("../data/page.json"))
        .then((response) => response.json())
        .then(function (jsonData) {
            let IMG = jsonData[`${linkName}`].IMG;

            if (linkName == "나의 학과") {
                chrome.storage.sync.get(`Department`, function(data) {
                    let departmentName = data.Department;

                    fetch(chrome.extension.getURL("../data/department.json"))
                    .then((response) => response.json())
                    .then(function (jsonData) {
                        let URL = jsonData[`${departmentName}`].URL; 
                        
                        setLinkElement(itemLinkElement, linkName, URL, IMG);
                    });
                });
            }
            else {
                let URL = jsonData[`${linkName}`].URL; 
                
                setLinkElement(itemLinkElement, linkName, URL, IMG)
            }
        });
    });
}

/*바로가기 생성 및 변경 DOM 제어 함수*/
function setLinkElement(itemLinkElement, linkName, URL, IMG){
    //페이지 클릭 이벤트 추가 
    clickOpenNewTeb(itemLinkElement, URL);
    // a 태그로 크기 조정
    let atag = document.createElement('a');
    

    //이미지 및 텍스트 생성
    let linkImage = document.createElement('img');
    let linkText = document.createElement('p');

    linkImage.setAttribute('src', IMG);
    linkText.textContent = linkName;

    atag.appendChild(linkImage);
    atag.appendChild(linkText);

    itemLinkElement.appendChild(atag)
}   

/*클릭 이벤트 및 바로가기 연결 함수*/
function clickOpenNewTeb(element, URL){
    element.addEventListener('click', function(){
        window.open(URL);
    });
}

function scanlms(filename){
    
    chrome.tabs.executeScript(
        {
            code: `document.querySelector("iframe").contentWindow.document.getElementById("test_player_html5_api").getElementsByTagName("source")[0].getAttribute("src")`,
        },
        (lmsUrl) => {
            console.log(lmsUrl)
            try {
            chrome.downloads.download({ url: lmsUrl[0], filename: filename+".mp4"})
            } catch(e) {
            alert("강의 영상 시청중에 사용해 주세요");
        }
        },
        )

}


document.getElementById("download").addEventListener("click", function () {
    //let filename = document.getElementById("filename").value;
    var result = confirm("수강과목 교수님에게 다운로드 허가를 받으셨나요?");
    if(result){
        var filename = prompt("파일이름을 지정하세요.");
        scanlms(filename)
    }else{
        alert("저작권법 제25조에 의거, 수강과목 교수님의 동의후 사용 부탁드립니다.")
    }
});