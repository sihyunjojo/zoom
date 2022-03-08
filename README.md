# My Noom

Zoom Clone using WebRTC and Websockets.


## 하기 전에 공부해야할 것 

ExpressJS , app.get(), Pug , (req, res) =>
package.json, nodemon, bable , preset


## 공부 메모

1.5까지는 socket과 eventlistener 공부

각각의 socket에 각각의 브라우저와의 연결이 있어서 독립적으로 구축할 수 있음.

1.6는 2개의 브라우저에 상대에게 채팅을 보낼 수 있게 해준다.

1.8 object를 string으로 바꿔서 프론트나 백앤드로 보내줘야함. 
왜냐하면 websocket이 브라우저에 있는 api 이기 떄문이다.
백엔드에서 다양한 언어를 사용할 수 도 있기 때문에 api는 어떠한 판단도 되면 안된다.
그래서 {}의 모양으로 출력이 된거다.


JSON을 사용하니
SyntaxError: Unexpected token h in JSON at position 0
가 발생하였는데 

app.js의 27번째 줄에서 
setTimeout(() => {
    socket.send("hello from the browsers")
}, 1000)
코드를 지우니 해결이 되었다.


socket안에 정보(item)를 저장 할 수 있다.
socket["nickname] = message payload


1.9
나를 제외하고 채팅 보내기 나한테 까지 보내는건 이상함
그러하여서 나의 닉네임: 채팅내용 을
You: 채팅내용 으로 바꿈

2.1 websocket을 사용하는 framework인 socket.io을 사용하기.
public 방이 아닌 room을 만들어 줄 것이다.

script로 socket.io를 프론트와 백엔드에 설치해줌.

2.2 
socket.io를 이용해서 front에서 back으로 값 받아오기

socket.on 사용 front사용 방식

2.3
socket.emit과 socket.on 사용방법
socket.on에서의 emit에서 받아온 함수 작용 방식

2.4
socket.io에는 server api와 client api가 있다.
server api에 보면 socket의 id와 room의 id가 있다.

채팅room 만들기!!!

## 지금까지 한 것
