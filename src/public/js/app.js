alert("hi");

/* frontend에서 사용되는 App.js를 저장할때마다 nodemon이 새로 시작되고 있다. 하지만 이거를 원하는게 아니다
나는 view 나 서버를 수정할떄만 nodemon이 재시작되었으면 좋겠다.App
server.js

frontend js를 수정할때는 새로고침이 안되게하고싶다.

 "ignore" : ["src/public/*"],
 를 nodemon.json에서 설정하니 됬다.


 지금까지 한것은 pug로 view engine을 설정하고
 express에서 template를 수정할때는 pyblic  url을 생성하서 유저에게 파일을 공유해주고
home.pug를 render해주는 route handler을 만들 었다.

이게 express 작업의 마지막이다.


*/