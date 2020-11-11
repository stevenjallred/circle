import { normalize } from "polished";
import React, { Suspense, useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components/macro";
import Stack from "./components/Stack";
import { useApi, axios, touch } from "./hooks/use-api";

type User = {
  id: number;
  name: string;
};

type Post = {
  id: number;
  userId: number;
  body: string;
};

type Collection<T> = {
  meta: any;
  data: T[];
};

export default function App() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const api = useApi();

  const { data: posts } = api.posts({ limit: 100 }) as Collection<Post>;

  useEffect(() => {
    const id = window.setInterval(() => {
      touch("posts");
    }, 10000);
    return () => {
      clearInterval(id);
    };
  }, []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post("/posts", { body: text });
    } finally {
      setIsLoading(false);
      setText("");
      await touch("posts");
    }
  }

  return (
    <Container>
      <Column>
        <Stack>
          <Box>
            <form onSubmit={submit}>
              <label>
                Body:
                <input
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                  }}
                />
              </label>
              <button>Send</button>
              {isLoading && <>Loading</>}
            </form>
          </Box>

          {[...posts].reverse().map((post) => (
            <Box key={post.id}>
              <Stack horizontal align="flex-start" fill>
                <Picture />
                <Content>
                  <Stack space="small">
                    <User>{post.userId}</User>
                    <Body>{post.body}</Body>
                  </Stack>
                </Content>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Column>
    </Container>
  );
}

const Container = styled.div`
  text-align: center;
  min-height: 100%;
  background: #f8f8f8;
`;

const Column = styled.div`
  text-align: left;
  margin: auto;
  width: 600px;
  min-height: var(--window-height);
  padding: 20px;
`;

const Box = styled.div`
  background: white;
  box-shadow: 0 0 0 1px #ddd, 0 2px 4px #00000008;
  padding: 20px;
  border-radius: 7px;
`;

const User = styled.div`
  font-size: 0.8em;
  opacity: 0.8;
`;

const Body = styled.div``;

const Picture = styled.div`
  border-radius: 1000px;
  width: 40px;
  height: 40px;
  background: #ccc;
  flex-shrink: 0;
  flex-grow: 0;
`;

const Content = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
`;
