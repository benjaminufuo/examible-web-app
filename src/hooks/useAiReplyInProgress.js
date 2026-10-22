import { useSyncExternalStore } from "react";
import { isAiReplyInProgress, subscribeAiReply } from "../utils/aiTutor";

// True while an AI tutor reply is still streaming in, even if the chat was
// closed and reopened since it started
export const useAiReplyInProgress = () =>
  useSyncExternalStore(subscribeAiReply, isAiReplyInProgress);
