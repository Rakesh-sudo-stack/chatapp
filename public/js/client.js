// Variables
const chatArea = document.querySelector('.chat_area');
const inputValue = document.querySelector('#inputvalue');
const button = document.querySelector('button');
const form = document.querySelector('form');
var ring = new Audio('/img/sound.mp3');

const socket = io();

let name;
do{
    name = prompt("Enter your name");
}while(!name);

const appendmsg = (text,type) => {
    const msg = document.createElement('div');
    msg.classList.add("msg",type);
    msg.innerHTML = text;
    chatArea.appendChild(msg);
    chatArea.scrollTop = chatArea.scrollHeight;
}

socket.emit('new-user',name);
socket.on('user-joined',(user)=>{
    appendmsg(`<b>${user}</b> joined the chat`,"incoming");
    ring.play();
});

button.addEventListener('click',(e)=>{
    e.preventDefault();
    if(inputValue.value!=""){
        socket.emit('send',inputValue.value);
        appendmsg(`<h4>YOU: </h4>${inputValue.value}`,"outgoing");
    }
    inputValue.value = "";
})

socket.on('receive',(information)=>{
    appendmsg(`<h4>${information.user}: </h4>${information.message}`,"incoming");
    ring.play();
});

socket.on('left',(userleft)=>{
    appendmsg(`<b>${userleft}</b> left the chat`,"incoming")
    ring.play();
});

