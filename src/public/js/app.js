const socket = io(); // 소켓을 초기화

const myFace = document.getElementById("myFace"); // 나의 영상이 출력될 요소
const muteBtn = document.getElementById("mute"); // 음소거 버튼
const cameraBtn = document.getElementById("camera"); // 카메라 끄기/켜기 버튼
const camerasSelect = document.getElementById("cameras"); // 카메라 선택 드롭다운

const call = document.getElementById("call"); // 통화 화면 요소
call.hidden = true; // 처음에는 통화 화면을 숨김

let myStream; // 나의 스트림
let muted = false; // 음소거 상태 여부
let cameraOff = false; // 카메라 끔 상태 여부
let roomName; // 방 이름
let myPeerConnection; // 피어 연결 객체

// 사용 가능한 카메라 목록을 가져오는 함수
async function getCameras() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices(); // 모든 장치 목록을 가져옴
        const cameras = devices.filter(device => device.kind === "videoinput"); // 비디오 입력 장치만 필터링
        const currentCamera = myStream.getVideoTracks()[0]; // 현재 사용 중인 카메라
        cameras.forEach((camera) => {
            const option = document.createElement("option"); // 옵션 요소 생성
            option.value = camera.deviceId; // 옵션 값에 장치 ID 설정
            option.innerText = camera.label; // 옵션 텍스트에 장치 레이블 설정
            if (currentCamera.label === camera.label) { // 현재 카메라와 일치하면
                option.selected = true; // 선택된 상태로 설정
            }
            camerasSelect.appendChild(option); // 드롭다운에 옵션 추가
        });
    } catch (e) {
        console.log(e); // 오류가 발생하면 콘솔에 출력
    }
}

// 미디어 스트림을 가져오는 함수
async function getMedia(deviceId) {
    const initialConstrains = {
        audio: true,
        video: { facingMode: "user" },
    };
    const cameraConstraints = {
        audio: true,
        video: { deviceId: { exact: deviceId } },
    };
    try {
        myStream = await navigator.mediaDevices.getUserMedia(
            deviceId ? cameraConstraints : initialConstrains
        ); // 장치 ID가 있으면 해당 카메라, 그렇지 않으면 기본 카메라 사용
        myFace.srcObject = myStream; // 나의 영상 요소에 스트림 설정
        if (!deviceId) {
            await getCameras(); // 카메라 목록 가져오기
        }
    } catch (e) {
        console.log(e); // 오류가 발생하면 콘솔에 출력
    }
}

// 음소거 버튼 클릭 핸들러
function handleMuteClick() {
    myStream
        .getAudioTracks()
        .forEach((track) => (track.enabled = !track.enabled)); // 오디오 트랙의 활성 상태를 토글
    if (!muted) {
        muteBtn.innerText = "Unmute"; // 버튼 텍스트 변경
        muted = true; // 음소거 상태로 설정
    } else {
        muteBtn.innerText = "Mute"; // 버튼 텍스트 변경
        muted = false; // 음소거 해제 상태로 설정
    }
}

// 카메라 버튼 클릭 핸들러
function handleCameraClick() {
    myStream
        .getVideoTracks()
        .forEach((track) => (track.enabled = !track.enabled)); // 비디오 트랙의 활성 상태를 토글
    if (cameraOff) {
        cameraBtn.innerText = "Turn Camera Off"; // 버튼 텍스트 변경
        cameraOff = false; // 카메라 켬 상태로 설정
    } else {
        cameraBtn.innerText = "Turn Camera On"; // 버튼 텍스트 변경
        cameraOff = true; // 카메라 끔 상태로 설정
    }
}

// 카메라 변경 핸들러
function handleCameraChange() {
    getMedia(camerasSelect.value); // 선택된 카메라로 미디어 스트림 가져오기
    if (myPeerConnection) {
        const videoTrack = myStream.getVideoTracks()[0]; // 새로운 비디오 트랙 가져오기
        const videoSender = myPeerConnection
            .getSenders()
            .find(sender => sender.track.kind === "video"); // 비디오 트랙을 보내는 Sender 찾기
        videoSender.replaceTrack(videoTrack); // 새로운 비디오 트랙으로 교체
    }
}

muteBtn.addEventListener("click", handleMuteClick); // 음소거 버튼 클릭 이벤트 리스너
cameraBtn.addEventListener("click", handleCameraClick); // 카메라 버튼 클릭 이벤트 리스너
camerasSelect.addEventListener("input", handleCameraChange); // 카메라 선택 변경 이벤트 리스너

const welcome = document.getElementById("welcome"); // 환영 화면 요소
const welcomeForm = welcome.querySelector("form"); // 환영 화면 폼 요소

// 통화 초기화 함수
async function initCall() {
    welcome.hidden = true; // 환영 화면 숨김
    call.hidden = false; // 통화 화면 표시
    await getMedia(); // 미디어 스트림 가져오기
    makeConnection(); // 피어 연결 생성
}

// 환영 화면 폼 제출 핸들러
async function handleWelcomeSubmit(event) {
    event.preventDefault(); // 기본 폼 제출 동작 막기
    const input = welcomeForm.querySelector("input"); // 입력 필드 가져오기
    await initCall(); // 통화 초기화
    socket.emit("join_room", input.value); // 소켓을 통해 방에 참가
    roomName = input.value; // 방 이름 설정
    input.value = ""; // 입력 필드 초기화
}

welcomeForm.addEventListener("submit", handleWelcomeSubmit); // 폼 제출 이벤트 리스너

// 소켓 코드

socket.on("welcome", async() => {
    const offer = await myPeerConnection.createOffer(); // 초대장 생성
    myPeerConnection.setLocalDescription(offer); // 로컬 설명 설정
    console.log("sent the offer"); // 콘솔에 로그 출력
    socket.emit("offer", offer, roomName); // 소켓을 통해 오퍼 전송
});

socket.on("offer", async(offer) => {
    console.log("received the offer"); // 콘솔에 로그 출력
    myPeerConnection.setRemoteDescription(offer); // 원격 설명 설정
    const answer = await myPeerConnection.createAnswer(); // 답변 생성
    myPeerConnection.setLocalDescription(answer); // 로컬 설명 설정
    socket.emit("answer", answer, roomName); // 소켓을 통해 답변 전송
    console.log("sent the answer"); // 콘솔에 로그 출력
});

socket.on("answer", answer => {
    console.log("received the answer"); // 콘솔에 로그 출력
    myPeerConnection.setRemoteDescription(answer); // 원격 설명 설정
});

socket.on("ice", ice => {
    console.log("received candidate"); // 콘솔에 로그 출력
    myPeerConnection.addCandidate(ice); // ICE 후보자 추가
});

// RTC 코드

// 피어 연결 생성 함수
function makeConnection() {
    myPeerConnection = new RTCPeerConnection({
        iceServers: [{
            urls: [
                "stun:stun.l.google.com:19302",
                "stun:stun1.l.google.com:19302",
                "stun:stun2.l.google.com:19302",
                "stun:stun3.l.google.com:19302",
                "stun:stun4.l.google.com:19302",
            ],
        }],
    });
    myPeerConnection.addEventListener("icecandidate", handleIce); // ICE 후보자 이벤트 리스너 추가
    myPeerConnection.addEventListener("addstream", handleAddStream); // 스트림 추가 이벤트 리스너 추가
    myStream
        .getTracks()
        .forEach((track) => myPeerConnection.addTrack(track, myStream)); // 스트림의 모든 트랙을 피어 연결에 추가
}

// ICE 후보자 이벤트 핸들러
function handleIce(data) {
    console.log("sent candidate"); // 콘솔에 로그 출력
    socket.emit("ice", data.candidate, roomName); // 소켓을 통해 ICE 후보자 전송
}

// 스트림 추가 이벤트 핸들러
function handleAddStream(data) {
    const peersStream = document.getElementById("peersStream"); // 상대방 영상 요소
    console.log("got an event from my peer"); // 콘솔에 로그 출력
    console.log("Peer's Stream", data.stream); // 상대방 스트림 콘솔에 출력
    console.log("My Stream:", myStream); // 내 스트림 콘솔에 출력
    peersStream.srcObject = data.stream; // 상대방 영상 요소에 스트림 설정
}