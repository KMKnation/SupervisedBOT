# chat/consumers.py
import json
import random
from random import randrange
from chat import chat_utils
from channels.generic.websocket import WebsocketConsumer

greetings = ['hi', 'hello', 'hey', 'hii']

STATIC_CHAT_MODEL = '/home/hb/demos/medicalstorebot/chat/static/chat/chat.json'

getting_started_message = 'Hi there, ' \
                          'I am Travel Support Bot. I will be taking care of your travel requests and expenses. ' \
                          'To get started please choose from the following options'

CHAT_MODEL = None
with open(STATIC_CHAT_MODEL, 'r') as file:
    CHAT_MODEL = json.load(file)


class ChatConsumer(WebsocketConsumer):
    employees = []
    requests = []

    def connect(self):
        self.id = randrange(start=0, stop=10000)
        self.employees.append(self)
        self.accept()
        self.context = {}

    def disconnect(self, close_code):
        self.employees.remove(self)
        pass

    def postback(self, textdata):

        if textdata['postback'] == chat_utils.GETTING_STARTED:
            self.send(text_data=json.dumps(CHAT_MODEL['getting_started']))

        if textdata['postback'] == chat_utils.CITY_SELECTION: #also check for textual
            self.context[chat_utils.CITY_SELECTION] = textdata['message']['message']
            self.send(text_data=json.dumps(CHAT_MODEL[chat_utils.CITY_SELECTION]))

        if textdata['postback'] == chat_utils.SEARCH:
            self.context[chat_utils.SEARCH] = textdata['message']['message']
            self.send(text_data=json.dumps(CHAT_MODEL[chat_utils.SEARCH]))

        if textdata['postback'] == chat_utils.UPLOAD:
            self.context[chat_utils.UPLOAD] = textdata['message']['message']
            self.send(text_data=json.dumps(CHAT_MODEL[chat_utils.UPLOAD]))


        pass

    def received_message(self, text_data_json):
        message = text_data_json['message']

        if message.lower() in greetings:
            self.send(text_data=json.dumps({
                'message': random.choice(greetings),
                'context': {
                    'intent': 'GETTING_STARTED'
                }
            }))
            return

        if message.lower() == 'trf':
            self.send(text_data=json.dumps({
                'message': 'Please raise the request by filling up the Travel Request Form through this window',
                'context': {
                    'intent': 'trf'
                }
            }))

        elif message.lower() == 'tecf':
            self.send(text_data=json.dumps({
                'message': 'Please claim the travel expenses from filling this window',
                'context': {
                    'intent': 'tecf'
                }
            }))
        else:

            if message == 'CONFIRM':
                self.send(text_data=json.dumps({
                    'message': 'Your request has been sent to the your reporting manager for approval. We will notify you for further updates'
                }))
                self.requests.append({
                    'intent': str(text_data_json['context']['intent']),
                    'id': self.id
                })  # todo
                return

            if message == 'GET_REQUESTS':
                self.send(text_data=json.dumps(self.requests))
                return

            if message == 'APPROVE':
                for emp in self.employees:
                    if str(emp.id) == str(text_data_json['context']['id']):
                        emp.send(text_data=json.dumps({
                            'message': 'Your request of the ' + str(
                                text_data_json['context']['intent']).upper() + ' has been approved.',
                            'context': {
                                'intent': 'FURTHER_PROCESS',
                                'about': str(text_data_json['context']['intent'])
                            }
                        }))
                        for request in self.requests:
                            if request['intent'] == str(text_data_json['context']['intent']):
                                self.requests.remove(request)
                return

            if message == 'REJECT':
                for emp in self.employees:
                    if str(emp.id) == str(text_data_json['context']['id']):
                        emp.send(text_data=json.dumps({
                            'message': 'Sorry !!, Your request has been rejected. There might be some errors in your form. Please check that and get back to us soon.'
                        }))
                        for request in self.requests:
                            if request['intent'] == str(text_data_json['context']['intent']):
                                self.requests.remove(request)
                return

            self.send(text_data=json.dumps({
                'message': 'Feature for ' + str(message) + ' not implemented yet'
            }))
            # self.send(text_data=json.dumps({
            #     'message': message
            # }))

            # if text_data_json['context']['intent'] == 'trf':
            # else:
        pass

    def delivered(self):
        pass

    def evaluate_callback(self, message):
        if message['postback'] == None:
            self.receive(message)
        else:
            self.postback(message)

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        print(text_data_json)
        self.evaluate_callback(text_data_json)



'''
import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    # Receive message from room group
    def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'message': message
        }))
'''
