var observer = new MutationObserver(function(mutations){
    if(document.querySelector('[data-testid="question_box_content"]')) {
      addQuestionBtns();
      addAnswerbtns();
      observer.disconnect();
    }
  });
  observer.observe(document.body, { 
    childList: true,
    subtree: true
});

function addQuestionBtns(){
    let question_container = document.querySelectorAll('[class="sg-flex sg-flex--justify-content-space-between"]')[0];
    const url = new URL(window.location.href);
    q_id=url.pathname.split('/')[2];
    let div = document.createElement('div');
    let suivant = document.querySelectorAll('[Title="Questions suivantes"');
    if(suivant.length>0){
        suivant[0].className+=" sg-button--icon-only";
    }
    question_container.insertBefore(div, question_container.children[1]);
    div.className="nd-btns-div";
    chrome.runtime.sendMessage({ action: "getData", keys:['question'] }, function(response) {
        const keys = Object.keys(response.data.question);
        keys.forEach(key => {
            if(response.data.question[key].active){
                let btn = document.createElement("BUTTON");
                btn.id=key;
                btn.className= "sg-button sg-button--s sg-button--solid nd-btns";
                let t = document.createTextNode(decodeURIComponent(response.data.question[key].tag));
                btn.appendChild(t);
                div.appendChild(btn);
    
                btn.addEventListener('click', event => {
                    deleteQuestion(q_id, decodeURIComponent(response.data.question[key].motif), div);
                });
            }
        })
    });
}

function addAnswerbtns(){
    var answers = document.querySelectorAll("div[id^='answer-']");
    for( i = 0; i < answers.length; i++) {
        let answer_box = document.querySelectorAll('[class="sg-flex sg-flex--justify-content-space-between"]')[i+1];
        answer_id=answers[i].id.split("-")[1];
        let div = document.createElement('div');
        answer_box.insertBefore(div, answer_box.children[1]);
        div.className="nd-btns-div";
        chrome.runtime.sendMessage({ action: "getData", keys:['answer'] }, function(response) {
            const keys = Object.keys(response.data.answer);
            keys.forEach(key => {
                if(response.data.answer[key].active){
                    let btn = document.createElement("BUTTON");
                    btn.id=answer_id;
                    btn.className= "sg-button sg-button--s sg-button--solid nd-btns";
                    let t = document.createTextNode(decodeURIComponent(response.data.answer[key].tag));
                    btn.appendChild(t);
                    div.appendChild(btn);
        
                    btn.addEventListener('click', event => {
                        deleteAnswer(btn.id, decodeURIComponent(response.data.answer[key].motif), div);
                    });
                }
            })
        });
    }
}

function deleteQuestion(id, reason, div){
    let xhr = new XMLHttpRequest();
	xhr.withCredentials = true;
	xhr.open('POST', "https://nosdevoirs.fr/api/28/moderation_new/delete_task_content");
	xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            if(JSON.parse(xhr.response).success == true){
                div.innerHTML = '<p class="succes">Question supprimée avec succès !</p>';
            } else {
                alert(JSON.parse(xhr.response).message);
            }
        }
    }
    xhr.send(`{"model_id":${id},"model_type_id":1,"reason_id":4,"reason":"${reason}","give_warning":false,"take_points":true,"return_points":true,"schema":""}`);
}

function deleteAnswer(id, reason, div){
    let xhr = new XMLHttpRequest();
	xhr.withCredentials = true;
	xhr.open('POST', "https://nosdevoirs.fr/api/28/moderation_new/delete_response_content");
	xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            if(JSON.parse(xhr.response).success == true){
                div.innerHTML = '<p class="succes">Réponse supprimée avec succès !</p>';
            } else {
                alert(JSON.parse(xhr.response).message);
            }
        }
    }
    xhr.send(`{"model_id":${id},"model_type_id":2,"reason_id":23,"reason":"${reason}","give_warning":false,"take_points":true,"schema":"moderation.response.delete.req"}`);
}

