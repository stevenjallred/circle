import { normalize } from "polished";
import React, { Suspense, useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components/macro";
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
      touch("/posts");
    }, 100000);
    return () => {
      clearInterval(id);
    };
  }, []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post("/posts", { body: text });
    } catch (e) {
    } finally {
      setIsLoading(false);
      setText("");
      await touch("/posts");
    }
  }

  return (
    <>
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
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            {post.body} by user: {post.userId}
          </li>
        ))}
      </ul>
    </>
  );
}
