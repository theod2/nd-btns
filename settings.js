const defaultData = {
  question:{
    [0]: {
      active: true,
      tag: encodeURIComponent("Incomplet"),
      motif: encodeURIComponent("Bonjour, ton devoir n'est pas complet (pas de pièces jointes, énoncé partiel, informations manquantes, ...). Nous t'avons redonné tes points pour que tu le repostes en entier cette fois ;)"),
    },
    [1]: {
      active: true,
      tag: encodeURIComponent("Illisible"),
      motif: encodeURIComponent("Bonjour, ton devoir est incompréhensible. Fais attention aux fautes de frappe ainsi qu'aux fautes d'orthographe. Pour ajouter une équation ou une formule scientifique, clique sur л. Tes points t'ont été remboursés."),
    },
    [2]:{
      active: true,
      tag: encodeURIComponent("Langue"),
      motif: encodeURIComponent("[FR] Bonjour, merci de rédiger tes devoirs avec un français correct ou d'utiliser la version de Brainly qui correspond à ta langue. [ENG] Hello, please write your homework with correct French or use the version of Brainly that corresponds to your language. "),
    },
    [3]: {
      active: true,
      tag: encodeURIComponent("Résumé"),
      motif: encodeURIComponent("Bonjour, ta question est une demande de résumé et ce n'est malheureusement pas accepté sur nosdevoirs.")
    }
  },
  answer: {
    [0]: {
      active: true,
      tag:encodeURIComponent("Spam"),
      motif:encodeURIComponent("Bonjour, tu spammes le site ! Selon le r\u00E8glement du site, ce type de comportement peut entra\u00EEner un avertissement. Apr\u00E8s plusieurs avertissements, l'admin et les mod\u00E9rateurs supprimeront ton compte !"),
    },
    [1]: {
      active: true,
      tag:encodeURIComponent("Hors-sujet"),
      motif:encodeURIComponent("Bonjour, ta r\u00E9ponse n'a aucun rapport avec le devoir et ne r\u00E9pond pas du tout au devoir. Fais attention car tu peux recevoir un avertissement \u00E0 cause de ce type de comportement !")
    },
    [2]:{
      active: true,
      tag:encodeURIComponent("Faux"),
      motif:encodeURIComponent("Bonjour, ta r\u00E9ponse est fausse ou contient beaucoup trop d'erreurs. Nous devons la supprimer de mani\u00E8re \u00E0 ce que les autres personnes ne soient pas induites en erreur mais n'h\u00E9site pas \u00E0 corriger tes erreurs et \u00E0 reposter une autre r\u00E9ponse ;)")
    },
    [3]: {
      active: true,
      tag:encodeURIComponent("Incomplet"),
      motif:encodeURIComponent("Bonjour, malheureusement, ta r\u00E9ponse est incompl\u00E8te et nous ne pouvons l'accepter. Essaye d'apporter plus d'explications et ajoute-la de nouveau.")
    }
  }
}

function sendMessageToExtension(message, callback) {
  chrome.runtime.sendMessage(message, function(response) {
    if (typeof callback === 'function') {
      callback(response);
    }
  });
}

function saveSettings(){
  const a1 = document.getElementById('btn1').checked;
  const a2 = document.getElementById('btn2').checked;
  const a3 = document.getElementById('btn3').checked;
  const a4 = document.getElementById('btn4').checked;
  const tag1 =encodeURIComponent(document.getElementById('tag1').value);
  const tag2 =encodeURIComponent(document.getElementById('tag2').value);
  const tag3 =encodeURIComponent(document.getElementById('tag3').value);
  const tag4 =encodeURIComponent(document.getElementById('tag4').value);
  const motif1 =encodeURIComponent(document.getElementById('motif1').value);
  const motif2 =encodeURIComponent(document.getElementById('motif2').value);
  const motif3 =encodeURIComponent(document.getElementById('motif3').value);
  const motif4 =encodeURIComponent(document.getElementById('motif4').value);
  const q1 = document.getElementById('qbtn1').checked;
  const q2 = document.getElementById('qbtn2').checked;
  const q3 = document.getElementById('qbtn3').checked;
  const q4 = document.getElementById('qbtn4').checked;
  const qtag1 =encodeURIComponent(document.getElementById('qtag1').value);
  const qtag2 =encodeURIComponent(document.getElementById('qtag2').value);
  const qtag3 =encodeURIComponent(document.getElementById('qtag3').value);
  const qtag4 =encodeURIComponent(document.getElementById('qtag4').value);
  const qmotif1 =encodeURIComponent(document.getElementById('qmotif1').value);
  const qmotif2 =encodeURIComponent(document.getElementById('qmotif2').value);
  const qmotif3 =encodeURIComponent(document.getElementById('qmotif3').value);
  const qmotif4 =encodeURIComponent(document.getElementById('qmotif4').value);
  var data = {
    answer: {
      [0]: {
        active: a1,
        tag: tag1,
        motif: motif1
      },
      [1]: {
        active: a2,
        tag: tag2,
        motif: motif2
      },
      [2]:{
        active: a3,
        tag: tag3,
        motif: motif3
      },
      [3]: {
        active: a4,
        tag: tag4,
        motif: motif4
      }
    },
    question: {
      [0]: {
        active: q1,
        tag: qtag1,
        motif: qmotif1
      },
      [1]: {
        active: q2,
        tag: qtag2,
        motif: qmotif2
      },
      [2]:{
        active: q3,
        tag: qtag3,
        motif: qmotif3
      },
      [3]: {
        active: q4,
        tag: qtag4,
        motif: qmotif4
      }
    }
  };
  sendMessageToExtension({ action: 'storeData', data: data }, function(response) {
    console.log(response.message);
    alert("Saved");
  });
}
function getSettings (){
  var keys = ['answer', 'question'];
  sendMessageToExtension({ action: 'getData', keys: keys }, function(response) {
  console.log(response.data);
  if(Object.keys(response.data).length === 0 && response.data.constructor === Object){
    sendMessageToExtension({ action: 'storeData', data: defaultData }, function(response) {
      console.log(response.message);
    });
    getSettings()
  } else {
    const keys = Object.keys(response.data.answer);
    keys.forEach(key => {
      let k=parseInt(key)+1
      document.getElementById(('btn'+k)).checked = response.data.answer[key].active;
      document.getElementById('tag'+k).value =decodeURIComponent(response.data.answer[key].tag);
      document.getElementById('motif'+k).value =decodeURIComponent(response.data.answer[key].motif);

      const keys = Object.keys(response.data.question);
      keys.forEach(key => {
        let k=parseInt(key)+1
        document.getElementById(('qbtn'+k)).checked = response.data.question[key].active;
        document.getElementById('qtag'+k).value =decodeURIComponent(response.data.question[key].tag);
        document.getElementById('qmotif'+k).value =decodeURIComponent(response.data.question[key].motif);
      })
    })
  }
});
};
  
document.addEventListener('DOMContentLoaded', getSettings);
document.getElementById('save').addEventListener('click', saveSettings);