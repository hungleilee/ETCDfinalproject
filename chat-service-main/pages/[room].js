import { Container, Box } from "@mui/system";
import { TextField } from "@mui/material";
import styled from "@emotion/styled";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

const MessageBox = styled.div`
  padding: 0.65rem 0;
  p {
    margin: 0;
  }
  .sender {
    font-weight: 700;
  }
`;

function Message(props) {
  return (
    <MessageBox>
      <p className="sender">{props.from}:</p>
      <p>{props.message}</p>
    </MessageBox>
  );
}

export default function Room() {
  const router = useRouter();
  const containerRef = useRef();
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [messages, setMessages] = useState([]);
  const pollingRef = useRef();
  const [from, setFrom] = useState("");
  const [message, setMessage] = useState("");

  // auto scroll down
  useEffect(() => {
    if (isAutoScroll && containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [isAutoScroll, messages]);
  useEffect(() => {
    const ele = containerRef.current;
    if (ele) {
      const updateAutoScroll = () => {
        if (
          !isAutoScroll &&
          ele.scrollTop + ele.offsetHeight + 50 >= ele.scrollHeight
        ) {
          setIsAutoScroll(true);
        }
        if (
          isAutoScroll &&
          ele.scrollTop + ele.offsetHeight + 50 < ele.scrollHeight
        ) {
          setIsAutoScroll(false);
        }
      };
      ele.addEventListener("scroll", updateAutoScroll);
      return () => ele.removeEventListener("scroll", updateAutoScroll);
    }
  }, [containerRef, isAutoScroll, setIsAutoScroll]);

  // polling message
  useEffect(() => {
    const polling = setInterval(() => {
      if (!pollingRef.current && router.query.room) {
        pollingRef.current = axios
          .get(
            `/api/message?room=${router.query.room}&startId=${
              messages.length + 1
            }`
          )
          .then(({ data }) => {
            pollingRef.current = null;
            setMessages((prev) => [...prev, ...data]);
          });
      }
    }, 500);
    return () => clearInterval(polling)
  }, [messages.length, router.query.room]);

  return (
    <Container
      maxWidth="md"
      sx={{ display: "flex", flexDirection: "column", height: "100vh" }}
    >
      <Box
        ref={containerRef}
        sx={{
          width: "100%",
          minHeight: "0px",
          background: "white",
          overflow: "auto",
          padding: "0 1rem",
          flex: 1,
        }}
      >
        {messages.length ? messages.map((message, idx) => (
          <Message
            key={`message-${idx}`}
            from={message.from}
            message={message.message}
          />
        )) : <p>There is no message in this room, send it!</p>}
      </Box>
      <Box
        sx={{
          background: "white",
          borderTop: "1px solid rgba(224, 224, 224, 0.6)",
          padding: "0.25rem",
          display: 'flex'
        }}
      >
        <TextField
          id="from"
          label="Name"
          type="text"
          variant="standard"
          size="sm"
          value={from}
          onChange={(evt) => setFrom(evt.currentTarget.value)}
        />
        <TextField
          id="message"
          label="Message"
          type="text"
          variant="standard"
          size="sm"
          value={message}
          sx={{flex: 1}}
          onChange={(evt) => setMessage(evt.currentTarget.value)}
          onKeyDown={(evt) => {
            if (evt.key == "Enter") {
              axios.post("/api/message", {
                room: router.query.room,
                from,
                message,
              });
              setMessage("");
            }
          }}
        />
      </Box>
    </Container>
  );
}
