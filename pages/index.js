import { useState, useRef, useEffect } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import CircularProgress from '@mui/material/CircularProgress';

export default function Home() {

  const [userInput, setUserInput] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      "message": "Hello, this is ChatFXT, the AI ​​chatbot service built and maintained by `OpenFXT`!",
      "type": "apiMessage"
    }
  ]);

  const messageListRef = useRef(null);
  const textAreaRef = useRef(null);

  // Auto scroll chat to bottom
  useEffect(() => {
    const messageList = messageListRef.current;
    messageList.scrollTop = messageList.scrollHeight;
  }, [messages]);

  // Focus on text field on load
  useEffect(() => {
    textAreaRef.current.focus();
  }, []);

  // Handle errors
  const handleError = () => {
    setMessages((prevMessages) => [...prevMessages, { "message": "Oops! There seems to be an error. Please try again.", "type": "apiMessage" }]);
    setLoading(false);
    setUserInput("");
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userInput.trim() === "") {
      return;
    }

    setLoading(true);

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        message: userInput,
        type: "userMessage"
      }
    ]);

    const data = {
      message: userInput
    };
    let respData = "The service has stopped working!";
    try {
      const response = await fetch("https://aiserver-openfxt.vercel.app/api/v2/detail_response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      setUserInput("");
      respData = await response.text();
    }
    catch (error) {
      setUserInput("");
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        message: respData,
        type: "apiMessage"
      }
    ]);

    setLoading(false);

  };


  const handleEnter = (e) => {
    if (e.key === "Enter" && userInput) {
      if (!e.shiftKey && userInput) {
        handleSubmit(e);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  useEffect(() => {
    fetch('https://script.google.com/macros/s/AKfycbxpEzLfBiy3Om2dOb0mx-wzGxzddpV4GZ-Nw4liGbZTbGHk-Q9XzNOe6qBMf2DgocUy/exec?action=chatfxt')
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  useEffect(() => {
    if (messages.length >= 3) {
      setHistory([[messages[messages.length - 2].message, messages[messages.length - 1].message]]);
    }
  }, [messages])

  return (
    <>
      <Head>
        <title>OpenFXT - ChatFXT</title>
        <meta name="description" content="ChatFXT - A service of OpenFXT" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="https://openfxt.vercel.app/images/favicon.png" />
      </Head>
      <div className={styles.topnav}>
        <div className={styles.navlogo}>
          <a href="/">ChatFXT</a>
        </div>
        <div className={styles.navlinks}>
          <a href="https://docs.google.com/document/d/1A0ANoUM_keDWTeRyVES9GM8aMbNq5GVncUklsRIBNic/edit?usp=sharing" target="_blank">API Docs</a>
          <a href="https://github.com/Protocol404N?tab=repositories" target="_blank">GitHub</a>
        </div>
      </div>
      <main className={styles.main}>
        <div className={styles.cloud}>
          <div ref={messageListRef} className={styles.messagelist}>
            {messages.map((message, index) => {
              return (
                // The latest message sent by the user will be animated while waiting for a response
                <div key={index} className={message.type === "userMessage" && loading && index === messages.length - 1 ? styles.usermessagewaiting : message.type === "apiMessage" ? styles.apimessage : styles.usermessage}>
                  {/* Display the correct icon depending on the message type */}
                  {message.type === "apiMessage" ? <Image src="/parroticon.png" alt="AI" width="30" height="30" className={styles.boticon} priority={true} /> : <Image src="/usericon.png" alt="Me" width="30" height="30" className={styles.usericon} priority={true} />}
                  <div className={styles.markdownanswer}>
                    {/* Messages are being rendered in Markdown format */}
                    <ReactMarkdown linkTarget={"_blank"}>{message.message}</ReactMarkdown>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className={styles.center}>

          <div className={styles.cloudform}>
            <form onSubmit={handleSubmit}>
              <textarea
                disabled={loading}
                onKeyDown={handleEnter}
                ref={textAreaRef}
                autoFocus={false}
                rows={1}
                maxLength={512}
                type="text"
                id="userInput"
                name="userInput"
                placeholder={loading ? "Waiting..." : "Question (Maximum waiting time 10s)..."}
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                className={styles.textarea}
              />
              <button
                type="submit"
                disabled={loading}
                className={styles.generatebutton}
              >
                {loading ? <div className={styles.loadingwheel}><CircularProgress color="inherit" size={20} /> </div> :
                  // Send icon SVG in input field
                  <svg viewBox='0 0 20 20' className={styles.svgicon} xmlns='http://www.w3.org/2000/svg'>
                    <path d='M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z'></path>
                  </svg>}
              </button>
            </form>
          </div>
          <div className={styles.footer}>
            <p>Powered by <a href="https://openfxt.vercel.app" target="_blank">OpenFXT</a></p>
          </div>
        </div>
      </main>
    </>
  )
}
