import { collection } from "firebase/firestore";
import { db } from "./firestore";

export const messageCollection = collection(db, "jacob_v2_messages");
