const chatBox = document.getElementById("chat-box");
const input = document.getElementById("message");

let voices = [];

// voices load hone ka wait
speechSynthesis.onvoiceschanged = () => {
    voices = speechSynthesis.getVoices();
};

// ENTER key se message send
input.addEventListener("keypress", function(e){
    if(e.key === "Enter"){
        sendMessage();
    }
});

async function sendMessage(){

    const message = input.value.trim();

    if(message === "") return;

    // USER MESSAGE
    chatBox.innerHTML += `
    <div class="message user">
        <b>You:</b> ${message}
    </div>
    `;

    input.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    // BOT TYPING
    chatBox.innerHTML += `
    <div class="message bot" id="typing">
        <b>Friday:</b> Typing...
    </div>
    `;

    chatBox.scrollTop = chatBox.scrollHeight;

    try{

        const response = await fetch("http://127.0.0.1:5000/chat",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                message: message
            })
        });

        const data = await response.json();

        document.getElementById("typing").remove();

        // BOT MESSAGE
        chatBox.innerHTML += `
        <div class="message bot">
            <b>Friday:</b> ${data.reply}
        </div>
        `;

        // SPEAK
        speak(data.reply);

        chatBox.scrollTop = chatBox.scrollHeight;

    }catch(error){

        document.getElementById("typing").remove();

        chatBox.innerHTML += `
        <div class="message bot">
            <b>Friday:</b> Server Error
        </div>
        `;
    }
}



function speak(text){

    const speech = new SpeechSynthesisUtterance();

    speech.text = text;
    speech.lang = "en-US";

    // female voice select
    const femaleVoice = voices.find(voice =>
        voice.name.includes("Zira") ||
        voice.name.includes("Samantha") ||
        voice.name.includes("Female")
    );

    if(femaleVoice){
        speech.voice = femaleVoice;
    }

    speech.rate = 1;
    speech.pitch = 1.2;

    speechSynthesis.speak(speech);
}