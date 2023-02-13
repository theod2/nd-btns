var observer = new MutationObserver(function(mutations){
    if(document.querySelector('[data-testid="question_box_content"]')) {
      addQuestionBtns();
      addAnswerbtns();
      observer.disconnect();
    }
  }) 
  observer.observe(document.body, { 
    childList: true,
    subtree: true
});

function addQuestionBtns(){
    let question_container = document.querySelector('[data-testid="question_container"]')
    const url = new URL(window.location.href)
    q_id=url.pathname.split('/')[2]
    let div = document.createElement('div')
    div.className = "modbox sg-box sg-box--white sg-box--border-color-gray-20 sg-box--no-shadow sg-box--border-radius sg-box--border sg-box--padding-m sg-box--padding-m-border md:sg-box--padding-m-border lg:sg-box--padding-m-border xl:sg-box--padding-m-border sg-box--border-color-gray-20 md:sg-box--border-color-gray-20 lg:sg-box--border-color-gray-20 xl:sg-box--border-color-gray-20"
    div.innerHTML = '<img src="https://raw.githubusercontent.com/sugiiiiii/nds-moderaton-ui-ext/main/images/host/shield-black.svg" style="width: 25px;">'
    question_container.insertAdjacentElement("beforebegin", div)
    const keys = Object.keys(q_reasons)
    keys.forEach(key => {
        let btn = document.createElement("BUTTON");
        btn.id=key
        btn.className= "sg-button sg-button--s sg-button--solid btns"
        let t = document.createTextNode(key)
        btn.appendChild(t);
        div.appendChild(btn);

        btn.addEventListener('click', event => {
            deleteQuestion(q_id, q_reasons[btn.id], div)
        });
    })
}

function addAnswerbtns(){
    var answers = document.querySelectorAll("div[id^='answer-']")
    for( i = 0; i < answers.length; i++) {
        let answer_box = document.querySelectorAll('[data-testid="answer_box"]')[i]
        answer_id=answers[i].id.split("-")[1]
        let div = document.createElement('div')
        div.className = "modbox sg-box sg-box--white sg-box--border-color-gray-20 sg-box--no-shadow sg-box--border-radius sg-box--border sg-box--padding-m sg-box--padding-m-border md:sg-box--padding-m-border lg:sg-box--padding-m-border xl:sg-box--padding-m-border sg-box--border-color-gray-20 md:sg-box--border-color-gray-20 lg:sg-box--border-color-gray-20 xl:sg-box--border-color-gray-20"
        div.innerHTML = '<img src="https://raw.githubusercontent.com/sugiiiiii/nds-moderaton-ui-ext/main/images/host/shield-black.svg" style="width: 25px;">'
        answer_box.insertAdjacentElement("beforebegin", div)
        const keys = Object.keys(a_reasons)
        keys.forEach(key => {
            let btn = document.createElement("BUTTON");
            btn.id=answer_id
            btn.className= "sg-button sg-button--s sg-button--solid"
            let t = document.createTextNode(key)
            btn.appendChild(t);
            div.appendChild(btn);

            btn.addEventListener('click', event => {
                deleteAnswer(btn.id, a_reasons[btn.innerHTML], div)
        });
    })
    }
}

function deleteQuestion(id, reason, div){
    let xhr = new XMLHttpRequest()
	xhr.withCredentials = true
	xhr.open('POST', "https://nosdevoirs.fr/api/28/moderation_new/delete_task_content")	
	xhr.setRequestHeader("Content-Type", "application/json")
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            if(JSON.parse(xhr.response).success == true){
                div.innerHTML = '<p class="succes">Question supprimée avec succès !</p>'
            } else {
                alert(JSON.parse(xhr.response).message)
            }
        }
    }
    xhr.send(`{"model_id":${id},"model_type_id":1,"reason_id":4,"reason":"${reason}","give_warning":false,"take_points":true,"return_points":true,"schema":""}`)
}

function deleteAnswer(id, reason, div){
    let xhr = new XMLHttpRequest()
	xhr.withCredentials = true
	xhr.open('POST', "https://nosdevoirs.fr/api/28/moderation_new/delete_response_content")	
	xhr.setRequestHeader("Content-Type", "application/json")
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            if(JSON.parse(xhr.response).success == true){
                div.innerHTML = '<p class="succes">Réponse supprimée avec succès !</p>'
            } else {
                alert(JSON.parse(xhr.response).message)
            }
        }
    }
    xhr.send(`{"model_id":${id},"model_type_id":2,"reason_id":23,"reason":"${reason}","give_warning":false,"take_points":true,"schema":"moderation.response.delete.req"}`)
}

const q_reasons = {
    "Incomplet": "Bonjour, ton devoir n'est pas complet (pas de pièces jointes, énoncé partiel, informations manquantes, ...). Nous t'avons redonné tes points pour que tu le repostes en entier cette fois ;)",
    "Illisible": "Bonjour, ton devoir est incompréhensible. Fais attention aux fautes de frappe ainsi qu'aux fautes d'orthographe. Pour ajouter une équation ou une formule scientifique, clique sur л. Tes points t'ont été remboursés.",
    "Langue": "[FR] Bonjour, merci de rédiger tes devoirs avec un français correct ou d'utiliser la version de Brainly qui correspond à ta langue. [ENG] Hello, please write your homework with correct French or use the version of Brainly that corresponds to your language. ",
    "Résumé": "Bonjour, ta question est une demande de résumé et ce n'est malheureusement pas accepté sur nosdevoirs."
}

const a_reasons = {
    "Spam": "Bonjour, tu spammes le site ! Selon le règlement du site, ce type de comportement peut entraîner un avertissement. Après plusieurs avertissements, l'admin et les modérateurs supprimeront ton compte !",
    "Hors-sujet": "Bonjour, ta réponse n'a aucun rapport avec le devoir et ne répond pas du tout au devoir. Fais attention car tu peux recevoir un avertissement à cause de ce type de comportement !",
    "Faux": "Bonjour, ta réponse est fausse ou contient beaucoup trop d'erreurs. Nous devons la supprimer de manière à ce que les autres personnes ne soient pas induites en erreur mais n'hésite pas à corriger tes erreurs et à reposter une autre réponse ;)",
    "Incomplet": "Bonjour, malheureusement, ta réponse est incomplète et nous ne pouvons l'accepter. Essaye d'apporter plus d'explications et ajoute-la de nouveau."
}



