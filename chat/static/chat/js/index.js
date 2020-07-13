var $messages = $('.messages-content');
var serverResponse = "wala";
var voiceOver = false;
var speechToText = false;

const getting_started_message = "Hi there, I am Travel Support Bot. I will be taking care of your travel requests and expenses. To get started please choose from the following options";

var suggession;
//speech reco
try {

  if (speechToText) {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      document.getElementById("MSG").value = speechToText;
      //console.log(speechToText)
      insertMessage()
    }
  } else {
    $('.fa-microphone').hide();
  }

}
catch (e) {
  console.error(e);
  // $('.no-browser-support').show();
  $('.fa-microphone').hide();
}

$('#start-record-btn').on('click', function (e) {
  recognition.start();
});


function listendom(no) {
  console.log(no)
  //console.log(document.getElementById(no))
  document.getElementById("MSG").value = no.innerHTML;
  insertMessage();
}

$(window).load(function () {
  $messages.mCustomScrollbar();
  setTimeout(function () {
    serverMessage(getting_started_message);
    setTimeout(function () {
      serverMessage("type <b>TRF</b> for Travel Request Form OR \n\
                     type <b>TECF</b> for Travel Expense Claim Form\n");
    }, 2000);
  }, 100);

});


const roomName = window.location.pathname.replace('/chat/', '').replace('/', '')

const chatSocket = new WebSocket(
  'ws://'
  + window.location.host
  + '/ws/chat/'
  + roomName
  + '/'
);

var context = "null";


$(".form-btn").on("click", function () {
  $(".popup-overlay, .popup-content").removeClass("active");

  chatSocket.send(JSON.stringify({
    'message': 'CONFIRM',
    'context': context
  }));

});


$(".close").on("click", function () {
  $(".popup-overlay, .popup-content").removeClass("active");

  context = "null";
  serverMessage('Okay !!, May be you are looking for something else');
  if (voiceOver) {
    speechSynthesis.speak(new SpeechSynthesisUtterance('Okay !!, May be you are looking for something else'))
  }


  setTimeout(function () {

    serverMessage("type <b>TRF</b> for Travel Request OR \n\
    type <b>TECF</b> for Travel Expense Claim'\n");

  }, 2000);

});

chatSocket.onmessage = function (e) {
  const data = JSON.parse(e.data);
  console.log(data);
  serverMessage(data.message);
  if (voiceOver) {
    speechSynthesis.speak(new SpeechSynthesisUtterance(data.message));
  }

  if (data.context != undefined) {
    if (data.context.intent != undefined) {
      context = data.context;

      var intent = data.context.intent;
      if (intent === 'GETTING_STARTED') {
        //todo
        setTimeout(function () {
          serverMessage("type <b>TRF</b> for Travel Request OR \n\
                         type <b>TECF</b> for Travel Expense Claim'\n");
        }, 2000);
      } else if (intent === 'trf' || intent == 'tecf') {

        setTimeout(function () {
          $(".popup-overlay, .popup-content").addClass("active");

        }, 4000);
      } else if (intent === 'FURTHER_PROCESS') {
        var amessage = ''
        if (data.context.about === 'trf') {
          amessage = 'For further processes, we have transfered your request to the Travel Team.'
        } else {
          amessage = 'For further processes, we have transfered your request to the Osource Team.'
        }

        setTimeout(function () {
          serverMessage(amessage);
          if (voiceOver) {
            speechSynthesis.speak(new SpeechSynthesisUtterance(amessage))
          }

        }, 2000);

      }


    }
  }

};

chatSocket.onclose = function (e) {
  console.error('Chat socket closed unexpectedly');
  console.log(e);
};

// document.querySelector('#chat-message-input').focus();
// document.querySelector('#chat-message-input').onkeyup = function (e) {
//   if (e.keyCode === 13) {  // enter, return
//     document.querySelector('#chat-message-submit').click();
//   }
// };


function updateScrollbar() {
  $messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
    scrollInertia: 10,
    timeout: 0
  });
}



function insertMessage() {
  msg = $('.message-input').val();
  if ($.trim(msg) == '') {
    return false;
  }
  $('<div class="message message-personal">' + msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
  // fetchmsg() 

  chatSocket.send(JSON.stringify({
    'message': msg
  }));

  $('.message-input').val(null);
  updateScrollbar();

}

document.getElementById("mymsg").onsubmit = (e) => {
  e.preventDefault()
  insertMessage();
}

function serverMessage(response2) {


  if ($('.message-input').val() != '') {
    return false;
  }
  $('<div class="message loading new"><figure class="avatar"><img src="/static/chat/css/bot.png" /></figure><span></span></div>').appendTo($('.mCSB_container'));
  updateScrollbar();


  setTimeout(function () {
    $('.message.loading').remove();
    $('<div class="message new"><figure class="avatar"><img src="/static/chat/css/bot.png" /></figure>' + response2 + '</div>').appendTo($('.mCSB_container')).addClass('new');
    updateScrollbar();
  }, 100 + (Math.random() * 20) * 100);

}


function fetchmsg() {

  var url = 'http://localhost:5000/send-msg';

  const data = new URLSearchParams();
  for (const pair of new FormData(document.getElementById("mymsg"))) {
    data.append(pair[0], pair[1]);
    console.log(pair)
  }

  console.log("abc", data)
  fetch(url, {
    method: 'POST',
    body: data
  }).then(res => res.json())
    .then(response => {
      console.log(response);
      //  serverMessage(response.Reply);
      if (voiceOver) {
        speechSynthesis.speak(new SpeechSynthesisUtterance(response.Reply))
      }


    })
    .catch(error => console.error('Error h:', error));

}


