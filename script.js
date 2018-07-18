const chatPage = document.getElementById("chat-page");
const loginPage = document.getElementById("login-page");
const socket = io.connect();

let userName, userNickname;
function main() {
    const userHeader = document.getElementById('userHeader');
    const nameButton = document.getElementById('nameButton');
    const nameInput = document.getElementById('nameInput');
    const messages = document.getElementById('messages');
    const messagesContainer = document.getElementById('messages-container');
    const users = document.getElementById('users');
    const text = document.getElementById('text');
    const textSubmit = document.getElementById('textSubmit');
    let typing = document.createElement('span');
    userHeader.innerText = userName+" "+userNickname;
    textSubmit.onclick = function () {
        let data = {
            name:userNickname,
            text: text.value
        };

        if (text.value.trim() === '') {
            text.value = '';
            return false;
        }else{
            text.value = '';
            socket.emit('chat message', data);
            isTyping = false;
            socket.emit('not typing', userNickname);
        }
    };

    socket.on('history', function (msg) {
        messages.innerHTML = '';
        for(let i in msg){
            if(msg.hasOwnProperty(i)){
                let el = document.createElement('li');
                if(isMentioned(msg[i].text, userNickname)){
                    el.classList.add("mention");
                }
                el.innerText = msg[i].name + ": " + msg[i].text;
                messages.appendChild(el);
            }
        }
    });
    socket.on('not typing', (userNickname) =>{
        console.log(1);
        $("span:contains("+userNickname+")").remove()
    });

    socket.on(users, function (msg) {
        users.innerHTML = '';
        for(let i in user){
            if(user.hasOwnProperty(i)){
                let el = document.createElement('li');
                el.innerText = "Name: "+user[i].name + " Nickname: " + user[i].nickName;
                users.appendChild(el);
            }
        }
    });


    socket.on('chat message', function (msg) {
        let el = document.createElement('li');
        if(isMentioned(msg.text, userNickname)){
            el.classList.add("mention");
        }
        el.innerText = msg.name + ": " + msg.text;
        messages.appendChild(el);
    });


    let isTyping = false;
    text.onkeypress = function () {
        socket.emit('typing', userNickname);
    };

    socket.on('typing', (userNickname) =>{
        if(!isTyping){
            typing.innerHTML = userNickname+" is typing... ";
            messagesContainer.appendChild(typing);
            isTyping = true;
        }
    })

};



function login() {
    let nameInput = document.getElementById('name-input');
    let nickNameInput = document.getElementById('nickname-input');

    if (nameInput.value.trim() === '' || nickNameInput.value.trim()==='') {
        return false
    } else {
        chatPage.classList.remove("hidden");
        loginPage.classList.add("hidden");
        userName = nameInput.value;
        userNickname = nickNameInput.value;
        let user ={
            name: userName,
            nickName: userNickname
        };
        main();

    }
}

function isMentioned(message,username) {
    let mention =  "@"+username;
    return message.includes(mention);
}