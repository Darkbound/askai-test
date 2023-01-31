import { useChunksHolder } from "hooks";
import React, { createContext, useState, useEffect, useContext, SetStateAction, Dispatch } from "react";

export type AnswerType = {
  content: string;
  confidence: number;
  chunkId: string;
  error: string | null;
};

interface GlobalContextProps {
  answers: AnswerType[];
  isFetchingAnswers: boolean;
  setAnswers: Dispatch<SetStateAction<AnswerType[]>>;
  setAccessToken: Dispatch<SetStateAction<string | null>>;
  setIsFetchingAnswers: Dispatch<SetStateAction<boolean>>;
  getCurrentAccessToken: () => Promise<string | null>;
}

const defaultGlobalContextState: GlobalContextProps = {
  answers: [],
  isFetchingAnswers: false,
  setAnswers: () => {},
  getCurrentAccessToken: async () => {
    return null;
  },
  setAccessToken: () => {},
  setIsFetchingAnswers: () => {}
};

export const GlobalContext = createContext<GlobalContextProps>(defaultGlobalContextState);

export const GlobalContextProvider = ({ children }) => {
  const { getTokenExpiration, getToken } = useChunksHolder();
  const [answers, setAnswers] = useState<GlobalContextProps["answers"]>([]);
  const [isFetchingAnswers, setIsFetchingAnswers] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const lsAccessToken = localStorage.getItem("chunksHolderAccessToken");

    console.log({ lsAccessToken });

    let invalidateAccessTokenTimeout: NodeJS.Timeout;

    if (lsAccessToken && getTokenExpiration(lsAccessToken) > 0) {
      setAccessToken(lsAccessToken);

      invalidateAccessTokenTimeout = clearAccessTokenTimeout(lsAccessToken);
    } else {
      localStorage.removeItem("chunksHolderAccessToken");
      setAccessToken(null);
    }

    return () => {
      clearTimeout(invalidateAccessTokenTimeout);
    };
  }, []);

  useEffect(() => {
    if (!accessToken) return;

    localStorage.setItem("chunksHolderAccessToken", accessToken);

    const invalidateAccessTokenTimeout = clearAccessTokenTimeout(accessToken);

    return () => {
      clearTimeout(invalidateAccessTokenTimeout);
    };
  }, [accessToken]);

  const clearAccessTokenTimeout = (accessToken: string): NodeJS.Timer => {
    const expiresIn = getTokenExpiration(accessToken);

    const invalidateAccessTokenTimeout = setTimeout(() => {
      localStorage.removeItem("chunksHolderAccessToken");

      setAccessToken(null);
    }, expiresIn);

    return invalidateAccessTokenTimeout;
  };

  const getCurrentAccessToken = async (): Promise<string | null> => {
    const currentAccessToken = accessToken || (await getToken());

    !accessToken && setAccessToken(currentAccessToken);

    return currentAccessToken;
  };

  console.log(accessToken);

  return (
    <GlobalContext.Provider value={{ answers, getCurrentAccessToken, setAccessToken, setAnswers, isFetchingAnswers, setIsFetchingAnswers }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
