import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  const history = useHistory();
  const [error404, setError404] = React.useState("ERROR 404!");
  const [notFound, setNotFound] = React.useState("PAGE NOT FOUND!");

  function check404() {

    const error404Text = document.getElementById("error-404-text");
    const errorNotFoundText = document.getElementById("error-not-found-text");
    

    if (error404Text) {
      setError404(error404Text.innerText);
    }

    if (errorNotFoundText) {
      setNotFound(errorNotFoundText.innerText);
    }

    const triggerStatement = "PAGE FOUND!";
    const forbiddenStatement = "ERROR 404!";


    if (
      notFound === triggerStatement && 
      Object.values(error404).length <= 2
    ) {
      
      history.push("/");
    }
  }

  useEffect(() => {
    const interval = setInterval(check404, 1000);
    return () => clearInterval(interval);
  }, [error404, notFound]);

  return (
    <div contentEditable="true" className="errors-html">
      <div className="error">
        <div className="wrap">
          <div className="404">
            <pre>
              <code>
                <span className="green">&lt;!</span>
                <span>DOCTYPE html</span>
                <span className="green">&gt;</span> <br />
                <span className="orange error-html">&lt;html&gt;</span> <br />
                <span className="orange error-head">&lt;head&gt;</span> <br />
                <span className="orange error-style">&lt;style&gt;</span> <br />
                <span className="dispaly-flex">
                  * &#123; display: flex; &#125;
                </span>
                <br />
                <span className="orange error-style">&lt;/style&gt;</span> <br />
                <span className="orange error-head">&lt;/head&gt;</span> <br />
                <span className="orange error-body">&lt;body&gt;</span> <br />
                <span className="animated-element">
                  <span id="error-404-text" className="error-text-404">
                    ERROR 404! <br />
                  </span>
                  <span id="error-not-found-text" className="error-text-404-page-not-found">
                    PAGE NOT FOUND!
                  </span>
                </span> <br />
                <span className="comment">&lt;!--The page you are looking for, 
                  is not where you think it is.--&gt;
                </span>
                <span className="orange"></span>
                <br />
                <span className="info">
                  <br />
                  <span className="orange error-body-bottom">&nbsp;&lt;/body&gt;</span>
                  <br />
                  <span className="orange error-html-bottom">&lt;/html&gt;</span>
                </span>
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;