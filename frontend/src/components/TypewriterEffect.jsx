import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const TypewriterEffect = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState("");
  const indexRef = useRef(0);

  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const chars = Array.from(text);
    indexRef.current = 0;
    setDisplayedText("");

    const intervalId = setInterval(() => {
      if (indexRef.current < chars.length) {
        indexRef.current++;
        // Reconstruct the string up to the current index
        // This avoids "skipping" characters due to double-invocation in Strict Mode
        setDisplayedText(chars.slice(0, indexRef.current).join(""));
      } else {
        clearInterval(intervalId);
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      }
    }, 15);

    return () => clearInterval(intervalId);
  }, [text]);

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayedText}</ReactMarkdown>
  );
};

export default TypewriterEffect;
