import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  useRef,
} from "react";
import Axios from "axios";

export const axios = Axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    Authorization: "Bearer 123",
  },
});

export default function useApi<T>(url: string) {
  const [state, setState] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [data, setData] = useState<T | undefined>(undefined);

  useEffect(() => {
    async function load() {
      setState("loading");
      try {
        const res = await axios.get(url);
        const { data } = res;
        setData(data);
        setState("success");
      } catch (e) {
        setState("error");
        setData(undefined);
      }
    }

    load();
  }, [url]);

  return { data, state };
}

type StoreEntry<T> = {
  promise?: Promise<T>;
  data?: T;
  error?: Error;
};

type Store = { [url: string]: StoreEntry<unknown> };

const suspendingContext = createContext<null | React.MutableRefObject<Store>>(
  null
);

export function SuspendingStoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<{ [url: string]: StoreEntry<unknown> }>({});

  return (
    <suspendingContext.Provider value={storeRef}>
      {children}
    </suspendingContext.Provider>
  );
}

function useForceUpdate() {
  const update = useState({})[1];
  return () => update({});
}

export function useSuspending<T>(url: string) {
  const storeRef = useContext(suspendingContext)!;
  const store = storeRef.current;
  const forceUpdate = useForceUpdate();

  if (url in store) {
    const entry = store[url] as StoreEntry<T>;
    if (entry.data) return entry.data;
    if (entry.promise) {
      entry.promise.then(() => forceUpdate());
      throw entry.promise;
    }
  }

  const promise = axios.get(url);

  promise.then((res) => {
    store[url] = {
      promise: undefined,
      data: res.data,
      error: undefined,
    };
    forceUpdate();
  });

  store[url] = {
    ...store[url],
    promise: promise,
  };

  throw promise;
}
