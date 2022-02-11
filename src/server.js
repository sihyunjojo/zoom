import express from "express";

const app = express();

app.set("view engine","pug");
app.set("views",__dirname + "src/views");
app.use("/public", express.static(__dirname + "/public"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);
app.listen(3000, handleListen);


/* 여기에서는 express를 import 하고 express 어플리케이션을 구성하고
view engine을 pug로 설정하고 views 디렉토리가 설정되고
public파일들에 대해서도 똑같은 작업을 해주고 있다.

public 파일들은 frontend에서 구동되는 코드고 아주 중요한 부분이다.
 */