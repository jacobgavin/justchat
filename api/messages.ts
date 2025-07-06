import {
  addDoc,
  DocumentData,
  getDocs,
  limit,
  orderBy,
  query,
  QueryConstraint,
  serverTimestamp,
  startAfter,
} from "firebase/firestore";
import { isEmpty } from "lodash";
import { messageCollection } from "../firebase/messageCollection";

type FindParams = {
  pageSize?: number;
  lastItem: DocumentData;
};
export async function findMessages({ pageSize = 25, lastItem }: FindParams) {
  const constraints: QueryConstraint[] = [
    limit(pageSize),
    orderBy("createdAt", "desc"),
  ];

  if (!isEmpty(lastItem)) {
    constraints.push(startAfter(lastItem));
  }
  const messageQuery = query(messageCollection, ...constraints);
  const docsSnapshot = await getDocs(messageQuery);

  return docsSnapshot;
}

type MessageData = {
  message: string;
  username: string;
};
export async function createMessage(data: MessageData) {
  const doc = await addDoc(messageCollection, {
    ...data,
    message: data.message.trim(),
    createdAt: serverTimestamp(),
  });
  return doc;
}
