import React from "react";
import styled from "styled-components/macro";
import NewPost from "./components/NewPost";
import Posts from "./components/Posts";
import Stack from "./components/Stack";

export default function App() {
  return (
    <Container>
      <Column>
        <Stack>
          <NewPost />
          <React.Suspense fallback="loading...">
            <Posts />
          </React.Suspense>
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
