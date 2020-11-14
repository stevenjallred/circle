import React, {
  TextareaHTMLAttributes,
  useState,
  useRef,
  useLayoutEffect,
} from "react";
import styled from "styled-components/macro";
import { useApi, touch } from "../hooks/use-api";
import { Box } from "./Box";
import Stack from "./Stack";
import { Picture, Content } from "./Posts";

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

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const newPostClick = () => {
    textAreaRef.current!.focus();
  };

  return (
    <NewPostBox as="form" onSubmit={submit} onClick={newPostClick}>
      <Stack horizontal align="flex-start" fill>
        <Picture />
        <Content>
          <Stack fill space="small" align="flex-end">
            <SuperTextArea ref={textAreaRef} {...inputProps} />
            <PostButton>Send</PostButton>
          </Stack>
        </Content>
      </Stack>
      {isLoading && <>Loading</>}
    </NewPostBox>
  );
}

const SuperTextArea = React.forwardRef<HTMLTextAreaElement>(
  function SuperTextArea(
    props: TextareaHTMLAttributes<HTMLTextAreaElement>,
    givenRef
  ) {
    const { value } = props;
    const ref = useRef<HTMLTextAreaElement | null>(null);

    useLayoutEffect(() => {
      const textarea = ref.current;
      if (textarea === null) return;

      textarea.style.height = "";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }, [value]);

    return (
      <SuperTextAreaStyles
        ref={(el) => {
          ref.current = el;
          if (givenRef) {
            if (typeof givenRef === "object") givenRef.current = el;
            else givenRef(el);
          }
        }}
        rows={1}
        {...props}
      />
    );
  }
);

const SuperTextAreaStyles = styled.textarea`
  width: 100%;
  font-size: 1.5em;
  resize: none;
  border: 0;
`;

const PostButton = styled.button`
  font-size: 1rem;
  margin: 0;
  padding: 1rem;
  border: 0;
  background: #0078ff;
  color: white;
  border-radius: 9px;
  cursor: pointer;
`;

const NewPostBox = styled(Box)`
  cursor: text;
  &:focus-within {
    box-shadow: 0 0 0 1px #0078ff, 0 2px 4px #00000008;
  }
`;
