# My Zoom

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

2.5
__공식문서를 보는 능력을 기르자__
room에서 message나오는 기능 구현

2.6
    이제 좀 재대로된 채팅앱을 갖춘것 같다.
    내가 출력하고 그게 상대에게 출력되는 것 만듬

    const value = input.value; 
     만약 이 줄을 사용하지 않고 마지막에서 input.value를 지워주게 되면 you: ${input.value}코드 실행시에 you 이후의 인자값을 비워진 채로 받아온다.

2.7

2.8 adpter
    db를 사용해서 서버간의 통신을 해주는 것이다. 
    모든 클라이언트가 동일한 서버에 연결되는 것이 아니니까.value를 adpter은 어플리케이션으로 가는 통로이다. 

    중요한 이론들이 많다.

2.9 

2.10 room count
    countRoom함수를 이용해서 socket내부에 있는 room의 갯수를 가져온 후
    나타내 준다.

2.11 admin panel
    socket.io에서 지원하는 admin ui가 있다.
    


3.0 user video
    기본적인 camera띄우기와 
    button 만들기

3.1 call constrols
    getAudioTracks에는 정보가 들어있다.

    getaudio
    id, kind, label,

    위와 같은 정보를 사용하여서 front에 정보를 띄우고 선택하게함.

3.2 Camera Switch

    MDN에서 찾아보면 audio의 카메라 설정과 audio 설정을 할수 있는 값을 찾을 수 있다.

3.3 WewbRTC
    web realtime communicate
    peer to peer의 방식이다.
    
    기존 chat은 서버에 많은 socket들이 연결되어 있었다.
    그리고 서버가 모두에게 msg를 전달하는 방식이였다.

    peer to peer은 브라우저간 or 개인간 직접 보내고 받는다.
    (=직접 연결된다)

    비디오와 오디오가 서버를 통해서 전달되지 않고 직접 전달됨.

    니가 어디에 있는지를 알아야지 연결 할 수 있다.

    처음에 서버를 통해서 위치를 서로 안 후에 서로 직접 연결함.

3.4 Rooms
    room을 친구들에게 공개하고 공유하고 들어오게 해야함.
    방을 열고 다른 사람 참여 가능함.
    

3.5 Offer
    브라우저 양쪽에서 연결통로를 만드는 걸 먼저시작함.
    peer to peer 다음 양쪽 브라우저에서 카메라와 마이크의 데이터 stream을 받아서 그것들을 연결 안에 집어 넣었다.

    그리고 createOffet을 만들어야 한다. =>

    offer을 만들어서 offer을 상대 브라우저에게 주면 offer을 공유함으로 
    signaling process를 완수한다.


## 앞으로 공부하고 공부하고 싶은 것

    쓰레드 공부
    RDBMS


