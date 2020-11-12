import React, { useState } from "react";
import styled from "styled-components/macro";
import { useApi, touch } from "../hooks/use-api";
import { Box } from "./Box";

export default function NewPost() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const api = useApi();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.posts.post({}, { data: { body: text } });
    } finally {
      setIsLoading(false);
      setText("");
      await touch("posts");
    }
  }

  return (
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
  );
}
