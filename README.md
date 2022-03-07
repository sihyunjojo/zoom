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


## 지금까지 한 것
