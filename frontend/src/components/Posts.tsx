import React, { useEffect } from "react";
import styled from "styled-components/macro";
import Stack from "./Stack";
import { useApi, touch } from "../hooks/use-api";
import { Collection, Post } from "../types";
import { Box } from "./Box";

export default function Posts() {
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

  return (
    <Stack>
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
  );
}

const User = styled.div`
  font-size: 0.8em;
  opacity: 0.8;
`;

const Body = styled.div``;

export const Picture = styled.div`
  border-radius: 1000px;
  width: 40px;
  height: 40px;
  background: #ccc;
  flex-shrink: 0;
  flex-grow: 0;
`;

export const Content = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
`;
