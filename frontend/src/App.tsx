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
        <div key={post.id}>{post.body}</div>
      ))}
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
