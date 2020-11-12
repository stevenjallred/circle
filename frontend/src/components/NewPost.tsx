import React, {
  TextareaHTMLAttributes,
  useState,
  useRef,
  useLayoutEffect,
} from "react";
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

  const inputProps = {
    value: text,
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value);
    },
  };

  return (
    <Box as="form" onSubmit={submit}>
      <label>
        <SuperTextArea {...inputProps} />
      </label>
      <button>Send</button>
      {isLoading && <>Loading</>}
    </Box>
  );
}

function SuperTextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { value } = props;
  const ref = useRef<HTMLTextAreaElement | null>(null);

  useLayoutEffect(() => {
    const textarea = ref.current;
    if (textarea === null) return;

    textarea.style.height = "";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [value]);

  return <SuperTextAreaStyles ref={ref} rows={1} {...props} />;
}

const SuperTextAreaStyles = styled.textarea`
  width: 100%;
  resize: none;
  border: 0;
`;
