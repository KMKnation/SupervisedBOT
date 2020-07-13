const agentId = document.getElementById('agent_id').textContent;

const chatSocket = new WebSocket(
  'ws://'
  + window.location.host
  + '/ws/chat/'
  + agentId
  + '/'
);

chatSocket.onclose = function (e) {
    console.error('Chat socket closed unexpectedly');
    console.log(e);
};


chatSocket.addEventListener('open', function (e) {

    console.log("WebSocket is open now.");

    chatSocket.send(JSON.stringify({
        'message': 'GET_REQUESTS'
    }));
});

$(window).load(function () {


});


chatSocket.onmessage = function (e) {

    try {

        const data = JSON.parse(e.data);
        console.log(data);

        var container = document.getElementById('invite-records');

        if (data.length > 0) {
            data.forEach(function (item) {
                console.log('contact_info: ' + item.contact_info);

                var cardInvite = document.createElement('div');
                cardInvite.id = "card-invite";
                cardInvite.style.backgroundColor = 'wheat'

                var content = document.createElement('p');
                content.id = 'card-invite-detail'
                content.textContent = item.intent;
                cardInvite.onclick = function () {
                    // window.location.href = API_SERVER + "/invite/" + item.id;
                };


                content.style.float = 'left';
                var button = document.createElement('button');
                button.id = 'btn';
                button.style.color = 'green';
                button.style.float = 'right'
                button.innerText = "APPROVE";
                button.onclick = function () {
                    // window.location.href = API_SERVER + "/invite/" + item.id;
                    chatSocket.send(JSON.stringify({
                        'message': 'APPROVE',
                        'context': item
                    }));

                    container.removeChild(cardInvite);
                };

                var buttonR = document.createElement('button');
                buttonR.id = 'btn';
                buttonR.style.color = 'red';
                buttonR.style.float = 'right'
                buttonR.innerText = "REJECT";
                buttonR.onclick = function () {
                    // window.location.href = API_SERVER + "/invite/" + item.id;
                    chatSocket.send(JSON.stringify({
                        'message': 'REJECT',
                        'context': item
                    }));

                    container.removeChild(cardInvite);
                };

                cardInvite.appendChild(content);
                cardInvite.append(button);
                cardInvite.append(buttonR);
                container.appendChild(cardInvite);
            });
        } else {


            var cardInvite = document.createElement('div');
            cardInvite.id = "card-invite";
            cardInvite.style.backgroundColor = '#ebebeb'

            var content = document.createElement('p');
            content.id = 'card-invite-detail';
            content.style.textAlign = 'center';
            content.textContent = 'No requests found';
            cardInvite.onclick = function () {
                // window.location.href = API_SERVER + "/invite/" + item.id;
            };

            cardInvite.appendChild(content);
            container.appendChild(cardInvite);

        }

    } catch (e) {
        console.log(e);
    }

};