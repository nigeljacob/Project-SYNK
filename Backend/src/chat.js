import { Message } from "./classes.js";
import {
  generateKey,
  read_from_Database,
  writeToDatabase,
} from "./firebaseCRUD.js";

export const sendTeamMessage = (
  message,
  senderUID,
  receiverUID,
  senderEmail
) => {
  let timeDate = getTimeDate();
  let ref =
    "Users" +
    "/" +
    senderUID +
    "/" +
    "Teams" +
    "/" +
    receiverUID +
    "/" +
    "Conversations";
  let key = generateKey(ref);

  let encryptedMessage = encrypt(message);

  let message = Message(
    encryptedMessage,
    senderUID,
    receiverUID,
    timeDate[1],
    timeDate[0],
    key,
    senderEmail
  );

  writeToDatabase(ref + "/" + key, message)
    .then(() => {
      // Message sent
    })
    .catch((error) => {
      // Message not sent
      window.alert("Failed to send message.");
    });
};

export const fetchMessage = (senderUID, receiverUID) => {
  let ref =
    "Users" +
    "/" +
    senderUID +
    "/" +
    "Teams" +
    "/" +
    receiverUID +
    "/" +
    "Conversations";

  return read_from_Database(ref)
};

// get time and date using a function
const getTimeDate = () => {
  let newDate = new Date();

  return [
    newDate.getDate() + "/" + newDate.getMonth() + "/" + newDate.getFullYear(),
    newDate.getHours() + ":" + newDate.getMinutes(),
  ];
};

// Encrypting and Decrypting messages
export const encrypt = (message) => {
  let encryptedMessage = "";

  for (let i = 0; i < message.length; i++) {
    let index = encryptList.indexOf(message[i]);
    encryptedMessage += decryptList[index];
  }

  return encryptedMessage;
};

export const decrypt = (message) => {
  let decryptedMessage = "";

  for (let i = 0; i < message.length; i++) {
    let index = decryptList.indexOf(message[i]);
    decryptedMessage += encryptList[index];
  }

  return decryptedMessage;
};

const decryptList = [
  "#",
  "3",
  "q",
  "F",
  "@",
  "8",
  "X",
  "$",
  "Y",
  "J",
  "b",
  "T",
  "m",
  "g",
  "E",
  "h",
  "1",
  "v",
  "s",
  "R",
  "n",
  "A",
  "p",
  "P",
  "L",
  "M",
  "y",
  "j",
  "W",
  "c",
  "a",
  "o",
  "2",
  "0",
  "f",
  "Z",
  "7",
  "H",
  "N",
  "l",
  "D",
  "G",
  "S",
  "O",
  "V",
  "x",
  "w",
  "i",
  "K",
  "5",
  "t",
  "e",
  "4",
  "d",
  "6",
  "I",
  "U",
  "B",
  "C",
  "Q",
  "k",
  "r",
  "£",
];

const encryptList = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "0",
  " ",
];
