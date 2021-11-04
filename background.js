chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({Active : "False", Color : "white", Department : "나의 학과", Link1: "홈페이지", Link2: "학사공지", Link3: "타이거즈", Link4: "Smart LMS", Link5: "에브리타임", Link6: "창파도서관", Link7: "비교과", Link8: "카카오_챗봇", Link9: "나의 학과"}, function() {
        console.log();
    });
});