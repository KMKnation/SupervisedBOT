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


$(".close, .form-btn").on("click", function () {
    $(".popup-overlay, .popup-content").removeClass("active");
});

chatSocket.onmessage = function (e) {

    try {

        const data = JSON.parse(e.data);
        console.log(data);

        var container = document.getElementById("records");
        console.log(container == undefined);

        if (data.length > 0) {
            data.forEach(function (item) {

                //     <div class="chat-title">
                //     <div class="list-left"><h1>TRF</h1></div>
                //     <div class="list-right"><a href="#" class="reject-btn">REJECT</a> <a href="#" class="approve-btn">APPROVE</a></div>
                //     <div class="clear"></div>
                //    </div>

                console.log(item);

                var chatTitleElem = document.createElement('div');
                chatTitleElem.className = 'chat-title';

                var listLeftElem = document.createElement('div');
                listLeftElem.className = 'list-left';

                var headOne = document.createElement('h1');

                if (item.intent == 'trf') {
                    headOne.textContent = 'Travel Request Form - Kavya Dave'
                } else {
                    headOne.textContent = 'Travel Expense Claim Form - Kavya Dave'
                }
                listLeftElem.appendChild(headOne);

                var listRightElem = document.createElement('div');
                listRightElem.className = 'list-right';

                var anchorElemReject = document.createElement('a');
                anchorElemReject.className = 'reject-btn'
                anchorElemReject.textContent = 'REJECT'
                anchorElemReject.onclick = function () {
                    chatSocket.send(JSON.stringify({
                        'message': 'REJECT',
                        'context': item
                    }));

                    // container.removeChild(chatTitleElem);
                    window.location = window.location;

                };

                var anchorElemAccept = document.createElement('a');
                anchorElemAccept.className = 'approve-btn'
                anchorElemAccept.textContent = 'APPROVE'
                anchorElemAccept.onclick = function () {
                    chatSocket.send(JSON.stringify({
                        'message': 'APPROVE',
                        'context': item
                    }));

                    // container.removeChild(chatTitleElem);
                    window.location = window.location;

                };

                listRightElem.appendChild(anchorElemReject);
                listRightElem.appendChild(anchorElemAccept);


                var clearItem = document.createElement('div');
                clearItem.className = 'clear';

                chatTitleElem.appendChild(listLeftElem);
                chatTitleElem.appendChild(listRightElem);
                chatTitleElem.appendChild(clearItem);

                chatTitleElem.onclick = function () {
                    setTimeout(function(){
                        $(".popup-overlay, .popup-content").addClass("active");
                    },100);
                };

                container.appendChild(chatTitleElem);


                // content.style.float = 'left';
                // var button = document.createElement('button');
                // button.id = 'btn';
                // button.style.color = 'green';
                // button.style.float = 'right'
                // button.innerText = "APPROVE";
                // button.onclick = function () {
                // window.location.href = API_SERVER + "/invite/" + item.id;

                //     container.removeChild(cardInvite);
                // };

                // var buttonR = document.createElement('button');
                // buttonR.id = 'btn';
                // buttonR.style.color = 'red';
                // buttonR.style.float = 'right'
                // buttonR.innerText = "REJECT";
                // buttonR.onclick = function () {
                //     // window.location.href = API_SERVER + "/invite/" + item.id;
                //     chatSocket.send(JSON.stringify({
                //         'message': 'REJECT',
                //         'context': item
                //     }));

                //     container.removeChild(cardInvite);
                // };

                // cardInvite.appendChild(content);
                // cardInvite.append(button);
                // cardInvite.append(buttonR);
                // container.appendChild(cardInvite);
            });
        } else {


            var cardInvite = document.createElement('div');
            cardInvite.id = "card-invite";

            var content = document.createElement('p');
            content.id = 'card-invite-detail';
            content.style.textAlign = 'center';
            content.textContent = 'No requests found !!';
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