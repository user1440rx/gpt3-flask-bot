const TheTextComponent = (props) => {
    var textContent = props.text;
    if(props.type==='bot') {
        return (
            <div className="botTextSpan">
                <span className="botText">{textContent}</span>
            </div>
        );
    }
    else {
        return (
            <div className="userTextSpan">
                <div className="userText">{textContent}</div>
            </div>
        );
    }
}



function ChatContainer() { 

var initEachText = [
   {text: "Hi! I'm an AI Chatbot. Ask me anything!", type: 'bot'}
]

const [eachText, setEachText] = React.useState(initEachText);


const handleSubmit = (event) => {
    event.preventDefault();
    var userTextinput = document.getElementById('textInput').value;
    var newText = eachText.concat({text: userTextinput, type:"user"});
    setEachText(newText);
    botAPICall(userTextinput, newText);
    document.getElementById('chatForm').reset();
    document.getElementById('chatView').scrollIntoView({ behavior: 'smooth', block: 'end' });
}

//API Call
const botAPICall = async(textToSend, userText) => {
    try {
        const botAPI = '/get?msg='+ textToSend;
        const response = await axios.get(botAPI);
        
        var newBotText = eachText.concat({text: textToSend, type:"user"},{text: response.data, type:"bot"});
        setEachText(newBotText);

    }
    catch (err) {
        console.log(err);
    }


}


return (
    <Container>
        <Box id="chatcontainer" sx={{ height: '80vh', borderRadius: '4px', paddingTop: '1px', paddingBottom: '1px' }}>
            <Box className="chatbox-in" id="chatbox-in">
                {eachText.map((etxt, key) => {
                    return <TheTextComponent key={key} text={etxt.text} type={etxt.type} />;
                })}
            <div id="chatView"></div>
            </Box>
            <form id="chatForm" onSubmit={handleSubmit}>
            <div id="userInput">
                <input id="textInput" type="text" name="msg" placeholder="Enter message here..." />
                <Button className="sendTextBtn" variant="contained" size="small" onClick={handleSubmit}>
                    <SvgIcon sx={{fontSize: '16px', marginRight: '3px'}}>
                    <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z" />
                    </SvgIcon>
                    Send 
                </Button>
            </div>
            </form>
        </Box>

    </Container>
);
}
