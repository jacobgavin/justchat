import { useInfiniteQuery } from "@tanstack/react-query";
import { format, isToday } from "date-fns";
import {
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  QueryConstraint,
  QueryDocumentSnapshot,
  startAfter,
  Timestamp,
  where,
} from "firebase/firestore";
import { last } from "lodash";
import { useEffect, useState } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  ListRenderItemInfo,
} from "react-native";
import { messageCollection } from "../firebase/messageCollection";
import { BORDER_RADIUS, PADDING } from "../theme/variables";
import { findMessages } from "@api/messages";

type Props = {
  name: string;
};
export default function ChatList({ name }: Props) {
  const newMessages = useSubscribeToChat();
  const messages = useInfiniteQuery({
    queryKey: ["messages"],
    queryFn: async ({ pageParam }) => findMessages({ lastItem: pageParam }),
    initialPageParam: {},
    getNextPageParam: (lastPage) => last(lastPage.docs),
  });

  const paginatedMessages = messages.data?.pages
    .map((page) => page.docs)
    .flat()
    .reverse();

  const allMessages = paginatedMessages
    ? [...paginatedMessages, ...newMessages]
    : newMessages;

  function renderItem(info: ListRenderItemInfo<Message>) {
    const { username, message, createdAt } = info.item;
    const me = username === name;
    return (
      <View style={[styles.chatItem, me && styles.chatItemSelf]}>
        <View style={styles.chatItemHeader}>
          <Text>{username}</Text>
          <Text style={styles.chatItemTimestamp}>
            {formatMessageSentAt(createdAt)}
          </Text>
        </View>
        <Text>{message}</Text>
      </View>
    );
  }
  return (
    <>
      {(messages.isLoading || messages.isFetching) && <Text>Loading...</Text>}
      <FlatList
        style={styles.chatList}
        keyExtractor={(item) => item.id}
        data={allMessages.map(documentToMessage)}
        contentContainerStyle={{
          flexDirection: "column-reverse",
        }}
        onEndReached={async () => {
          if (messages.isFetching || messages.isFetchingNextPage) {
            return;
          }
          if (!messages.hasNextPage) {
            return;
          }
          await messages.fetchNextPage();
        }}
        inverted
        renderItem={renderItem}
      />
    </>
  );
}

function useSubscribeToChat() {
  const [messages, setMessages] = useState<QueryDocumentSnapshot[]>([]);

  useEffect(() => {
    function makeConstraints() {
      const latestMessage = last(messages);
      const constraints: QueryConstraint[] = [orderBy("createdAt", "desc")];
      if (latestMessage) {
        constraints.push(startAfter(latestMessage));
      } else {
        constraints.push(where("createdAt", ">=", Timestamp.now()));
      }
      return constraints;
    }

    const q = query(messageCollection, ...makeConstraints());
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newDocuments = snapshot
        .docChanges()
        .filter((doc) => doc.type === "added")
        .map((doc) => doc.doc);
      setMessages((old) => [...old, ...newDocuments]);
    });

    return unsubscribe;
  }, []);

  return messages;
}

type Message = {
  id: string;
  message: string;
  username: string;
  createdAt: Date;
};
function documentToMessage(doc: DocumentData): Message {
  return {
    id: doc.id,
    message: doc.get("message"),
    username: doc.get("username"),
    createdAt: doc.get("createdAt")
      ? doc.get("createdAt").toDate()
      : new Date(),
  };
}

function formatMessageSentAt(sentAt: Date) {
  if (isToday(sentAt)) {
    return format(sentAt, "HH:mm");
  }
  return format(sentAt, "yyyy-MM-dd HH:mm");
}

const styles = StyleSheet.create({
  chatList: {
    flex: 1,
  },
  chatItemHeader: {
    flexDirection: "row",
    gap: PADDING,
  },
  chatItemTimestamp: {
    fontSize: 12,
    color: "#2F4F4F",
  },
  chatItem: {
    padding: PADDING,
    backgroundColor: "lightgray",
    borderRadius: BORDER_RADIUS,
    margin: PADDING,
    maxWidth: "70%",
    minWidth: "40%",
    alignSelf: "flex-start",
  },
  chatItemSelf: {
    alignSelf: "flex-end",
    backgroundColor: "lightblue",
  },
});
