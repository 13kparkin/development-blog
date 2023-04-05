import "./SinglePost.css";
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useDispatch, useSelector } from "react-redux";
import { getSinglePost, getAllPosts } from "../../../store/posts";
import { useHistory, useParams } from "react-router-dom";
import { timeConverter } from "../../../utils/time";
import { getGptMessages } from "../../../store/gpt";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeRaw from "rehype-raw";

const SinglePost = () => {
  const dispatch = useDispatch();
  const singlePostObj = useSelector((state) => state.posts?.singlePost?.post);
  const history = useHistory();
  const { postId } = useParams();
  const [gptPushed, setgptPushed] = useState(false);
  const [question, setQuestion] = useState("");
  const [gptMessageHistory, setGptMessageHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [countDown, setCountDown] = useState(20);
  const [error, setError] = useState([]);
  const sampleMessages = [
    "What is this article about?",
    "What is a summary of this article?",
    "What is the main idea of this article?",
  ];
  const [displaySampleQuestions, setDisplaySampleQuestions] = useState(true);
  const [serverTimeout, setServerTimeout] = useState(false);
  const [searchResults, setSearchResults] = useState("");

  const [gptAnswers, setGptAnswers] = useState("");

  const gptMessages = useSelector(
    (state) => state.getGptMessages?.getGptMessages
  );
  const [activeQuestionId, setActiveQuestionId] = useState(null);
  const [activeQuestionClicked, setActiveQuestionClicked] = useState(false);

  const [highlightedTextBody, setHighlightedTextBody] = useState(
    singlePostObj?.body
  );

  useEffect(() => {
    const sliceString = (str, char) => {
      const index = str.indexOf(char);
      return str.slice(index + 1);
    };

    const slicedString = sliceString(searchResults, '"');
    const bodyArray = singlePostObj?.body.split(" ");


    let bestMatch = {
      numberMatchWords: 0,
      sentence: "",
      startIndex: 0,
      endIndex: 0,
    };
    let adjacentWordsString = "";
    let proposedStartIndex = 0;

    if (gptMessageHistory?.[0]?.answer?.length > 0) {
      let numberMatchWords = 0;
      bodyArray.forEach((word, index) => {
        if (numberMatchWords === 0) {
          proposedStartIndex = index;
        }

        if (~slicedString.toLowerCase().indexOf(word.toLowerCase().trim())) {
          numberMatchWords++;
          adjacentWordsString += `${word} `;
        } else {
          numberMatchWords = 0;
          adjacentWordsString = "";
        }

        if (numberMatchWords > bestMatch.numberMatchWords) {
          bestMatch.numberMatchWords = numberMatchWords;
          bestMatch.sentence = adjacentWordsString;
          bestMatch.endIndex = index;
          bestMatch.startIndex = proposedStartIndex;
        }
      });
      let newBodyArray = bodyArray.map((a, i) => {

        if (i === bestMatch.startIndex) return "<mark>" + a;
        else if (i === bestMatch.endIndex) return "</mark>" + a;
        else return a;
      });
      let textToHighlightBody = newBodyArray.join(" ");
      setHighlightedTextBody(textToHighlightBody);
    }
  }, [singlePostObj, gptMessageHistory]);

  const getGptMessagesData = async (data, question) => {
    const gptMessages = await dispatch(getGptMessages(data, question));
    return gptMessages;
  };

  const chatSendPushed = async (e) => {
    e.preventDefault();
    setError([]);
    setgptPushed(true);
    setIsLoading(true);
    setQuestion(question);
    const articleString = ` ${singlePostObj?.title} \n ${singlePostObj?.body} \n ${singlePostObj?.User?.username}`;
    setDisplaySampleQuestions(false);

    // Timeout for lagged server
    const timer = setTimeout(() => {
      setQuestion("");
      setgptPushed(false);
      setIsLoading(false);
      setServerTimeout(true);
      setError(["The server is taking too long to respond. Please try again."]);
      setGptAnswers(error);
      // const newMessage = { question, answer: answers?.final?.everythingFound };
      setGptMessageHistory([...gptMessageHistory]);
    }, 20000);

    const answers = await getGptMessagesData(articleString, question);

    if (serverTimeout === false) {
      setSearchResults(answers?.openAiResponse);
      setgptPushed(false);
      setGptAnswers(answers);
      clearTimeout(timer);
      if (answers?.final?.everythingFound.length === 0) {
        setError(["No answer found. Please try again."]);
      }
      // Update message history state with new question and answer
      const newMessage = { question, answer: answers?.final?.everythingFound };
      setGptMessageHistory([newMessage, ...gptMessageHistory]);
      setQuestion("");
      setIsLoading(false);
    }
    setServerTimeout(false);
  };

  const handleFieldChange = (e) => {
    setQuestion(e.target.value);
  };

  useEffect(() => {
    const getSinglePostData = async () => {
      const posts = await dispatch(getSinglePost(postId));

      setHighlightedTextBody(posts?.post?.body);
    };
    getSinglePostData();
    let intervalId;
    if (isLoading) {
      intervalId = setInterval(() => {
        if (countDown > 0) {
          setCountDown(countDown - 1);
        }
      }, 1000);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [dispatch, countDown, isLoading, postId]);

  useEffect(() => {
    if (isLoading === false) {
      setCountDown(20);
    }
  }, [isLoading]);

  useEffect(() => {
    if (error.length > 0) {
      setIsLoading(false);
    }
  }, [error]);

  const handleSamleQuestionsClick = (e, index) => {
    setQuestion(e.target.innerText);
    setActiveQuestionId(index);
    setActiveQuestionClicked(true);
  };

  return (
    <>
      <form onSubmit={chatSendPushed} className="single-post-chat-container">
        <div className="single-post-chat">
          <div className="single-post-chat-title"></div>
          <div className="single-post-chat-input">
            <input
              type="text"
              placeholder="Ask a question about this article"
              value={question}
              onChange={handleFieldChange}
            />
            <button
              className={gptPushed ? "gptPushed" : "gptbutton"}
              onClick={chatSendPushed}
              disabled={gptPushed}
            >
              {isLoading ? <span className="loader"></span> : "Send"}
            </button>
            {isLoading && <span className="countdown">{countDown}</span>}
          </div>
          <div className="single-post-chat-response">
            {error &&
              error?.map((error, index) => (
                <div key={index} className="single-post-chat-response-error">
                  {error}
                </div>
              ))}
            {displaySampleQuestions && (
              <div className="single-post-chat-sample-messages">
                <div className="single-post-chat-sample-message-title">
                  Here are some ideas you can ask:
                </div>
                {sampleMessages?.map((message, index) => (
                  <div
                    onClick={(e) => handleSamleQuestionsClick(e, index)}
                    key={index}
                    className={`single-post-chat-sample-message ${
                      index === activeQuestionId ? "active" : ""
                    } ${
                      index === activeQuestionId && activeQuestionClicked
                        ? "pushed"
                        : ""
                    }`}
                  >
                    {message}
                  </div>
                ))}
              </div>
            )}
            {gptMessageHistory?.map((message, index) => (
              <div key={index} className="single-post-chat-response-message">
                <div className="single-post-chat-response-question">
                  {message?.question}
                </div>
                {message?.answer?.map((answer, index) => (
                  <div key={index} className="single-post-chat-response-answer">
                    <ReactMarkdown>{answer}</ReactMarkdown>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </form>
      <div className="single-post-container">
        <div className="single-post">
          <div className="single-post-image">
            <ReactMarkdown>
              {singlePostObj?.PostsImages?.[0]?.url}
            </ReactMarkdown>
          </div>
          <div className="user-info">
            <div className="username">{singlePostObj?.User?.username}</div>
          </div>
          <div className="single-post-updateAt">
            {timeConverter(singlePostObj?.updatedAt)}
          </div>
          <div className="single-post-title">{singlePostObj?.title}</div>
          <div className="single-post-body">
            <ReactMarkdown
              className="single-post-body"
              rehypePlugins={[rehypeRaw]}
              children={highlightedTextBody}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      children={String(children).replace(/\n$/, "")}
                      style={atomDark} // theme
                      language={match[1]}
                      PreTag="section" // parent tag
                      {...props}
                    />
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SinglePost;
