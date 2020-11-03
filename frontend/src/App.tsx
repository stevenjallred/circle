import React, { Suspense } from "react";
import styled from "styled-components/macro";
import useApi, { useSuspending } from "./hooks/use-api";

type User = {
  id: number;
  name: string;
};

type Post = {
  id: number;
  userId: number;
  body: string;
};

export default function App() {
  return (
    <>
      <HelloDiv>
        Hello,&nbsp;
        <Suspense fallback={<DefaultUser />}>
          <UserName />
        </Suspense>
        !
      </HelloDiv>
      <Suspense fallback={"loading posts..."}>
        <Posts />
      </Suspense>
    </>
  );
}

function UserName() {
  const user = useSuspending<User>("/users/me");
  return <>{user.name}</>;
}

function Posts() {
  const { data: posts } = useSuspending<{ data: Post[] }>("/posts");
  return (
    <>
      {posts.map((post) => (
        <Post post={post} key={post.id} />
      ))}
    </>
  );
}

function Post({ post }: { post: Post }) {
  return (
    <>
      <StyledPost>
        User Id: {post.userId}
        <br />
        Body: {post.body}
        <br />
        Post Id: {post.id}
        <br />
      </StyledPost>
    </>
  );
}

function DefaultUser() {
  return <>world</>;
}

const HelloDiv = styled.div`
  font-size: 32px;
  font-family: "Lemon Milk";
`;

const StyledPost = styled.ul`
  font-size: 2rem;
  border: 1px solid #ccc;
  padding: 2rem;
  margin: 4em;
  font-family: "Philosopher";
`;
