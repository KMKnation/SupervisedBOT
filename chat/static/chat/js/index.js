var $messages = $('.messages-content');
var serverResponse = "wala";
var voiceOver = false;
var speechToText = false;

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
    sendGettingStartedMessage();
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

  processMessage(data);
  // serverMessage(data.message);
  // if (voiceOver) {
  //   speechSynthesis.speak(new SpeechSynthesisUtterance(data.message));
  // }

};

chatSocket.onclose = function (e) {
  console.error('Chat socket closed unexpectedly');
  console.log(e);
};



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

function sendGettingStartedMessage() {
  chatSocket.send(JSON.stringify({
    "name": "Delhi",
    "postback": "HB.GETTING_STARTED"
  }));
}

function sendMessage(msg) {
  // msg = $('.message-input').val();
  if ($.trim(msg) == '') {
    return false;
  }
  
  $('<div class="message message-personal">' + msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
  // fetchmsg() 

  $('.message-input').val(null);
  updateScrollbar();
}

function receiveMessage(message) {
  if ($('.message-input').val() != '') {
    return false;
  }

  // var messageContainer = document.createElement
  $('<div class="message loading new"><figure class="avatar"><img src="/static/chat/css/bot.png" /></figure><span></span></div>').appendTo($('.mCSB_container'));
  // updateScrollbar();


  $('.message.loading').remove();
  $('<div class="message new"><figure class="avatar"><img src="/static/chat/css/bot.png" /></figure>' + message + '</div>').appendTo($('.mCSB_container')).addClass('new');
  updateScrollbar();

  // setTimeout(function () {
  // }, 100 + (Math.random() * 20) * 100);

  if (voiceOver)
    speechSynthesis.speak(new SpeechSynthesisUtterance(message));

}

function getRandom() {
  return '_' + Math.random().toString(36).substr(2, 9);
}
function receiveQuickReplies(obj) {

  if ($('.message-input').val() != '') {
    return false;
  }

  // var messageContainer = document.createElement
  $('<div class="message loading new"><figure class="avatar"><img src="/static/chat/css/bot.png" /></figure><span></span></div>').appendTo($('.mCSB_container'));
  // updateScrollbar();

  var classId = getRandom();
  $('.message.loading').remove();
  $('<div class="message new" id=' + classId + '><figure class="avatar"><img src="/static/chat/css/bot.png" /></figure>' + obj.say + '</div>').appendTo($('.mCSB_container')).addClass('new');
  updateScrollbar();

  setTimeout(function () {
    $('<br></br>').appendTo($('#' + classId)).addClass('btn');

    // $('<div class="message quickreply" id="quickreply"></div>').appendTo($('.mCSB_container')).addClass('quickreply');
    for (var i = 0; i < obj.action.items.length; i++) {


      var item = obj.action.items[i];
      $('<button id=' + item.name + '>' + item.name + '</button>')
        .appendTo($('#' + classId))
        .addClass('btn')
        .click(item, function (event) {

          chatSocket.send(JSON.stringify({
            'message': {
              'message': event.data.name,
              'type': 'text'
            },
            'postback': event.data.postback
          }));

          sendMessage(event.data.name)

        });
    }

    // $('<div class="message new"><figure class="avatar"><img src="/static/chat/css/bot.png" /></figure>' + message + '</div>').appendTo($('.mCSB_container')).addClass('new');
    updateScrollbar();

  }, 500);

}

function processMessage(data) {
  if (Array.isArray(data)) {
    // It is array

    for (var i = 0; i < data.length; i++) {
      var obj = data[i];

      if (obj.say != undefined) {

        //there is no pending action
        if (obj.action == undefined) {

          receiveMessage(obj.say);

        } else {

          if (obj.action.type == 'HB.QUICK_REPLIES') {
            receiveQuickReplies(obj);
          } else {

            receiveMessage(obj.say);
          }

        }
      }

    }
  }
}

