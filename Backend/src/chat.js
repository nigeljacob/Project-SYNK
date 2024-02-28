import { Message } from "./classes.js";
import {
  generateKey,
  getProfilePicture,
  readOnceFromDatabase,
  read_from_Database_onChange,
  writeToDatabase,
} from "./firebaseCRUD.js";

export const sendTeamMessage = (
  message,
  senderUID,
  receiverUID,
  senderEmail,
  senderName
) => {
  let timeDate = getTimeDate();
  let ref = "Conversations/" + receiverUID;
  let key = generateKey(ref);

  let encryptedMessage = encrypt(message);

  let newMessage = Message(
    encryptedMessage,
    senderUID,
    receiverUID,
    timeDate[1],
    timeDate[0],
    key,
    senderEmail,
    senderName
  );

  return writeToDatabase(ref + "/" + key, newMessage)
    .then(() => {
    })
    .catch((error) => {
      window.alert(error.message);
    });
};

export const fetchMessage = (onDataReceived, receiverUID) => {
  let ref = "Conversations/" + receiverUID;
  read_from_Database_onChange(ref, onDataReceived);
};

// get time and date using a function
const getTimeDate = () => {
  let newDate = new Date();

  let month = newDate.getMonth() + 1;

  let hours = newDate.getHours();
  if (hours < 10) hours = "0" + hours;
  let minutes = newDate.getMinutes();
  if (minutes < 10) minutes = "0" + minutes;

  return [
    newDate.getDate() + "/" + month + "/" + newDate.getFullYear(),
    hours + ":" + minutes,
  ];
};

export const encrypt = (message) => {
  let encryptedMessage = "";

  for (let i = 0; i < message.length; i++) {
    let index = encryptList.indexOf(message[i]);
    
    if (index !== -1) { // Check if the element is found in the list
      encryptedMessage += decryptList[index];
    } else {
      encryptedMessage += message[i]; // Add the original element if not found
    }
  }

  return encryptedMessage;
};

export const decrypt = (message) => {
  let decryptedMessage = "";

  for (let i = 0; i < message.length; i++) {
    let index = decryptList.indexOf(message[i]);
    
    if (index !== -1) { // Check if the element is found in the list
      decryptedMessage += encryptList[index];
    } else {
      decryptedMessage += message[i]; // Add the original element if not found
    }
  }

  return decryptedMessage;
};


export const retrieveProfilePicture = (uid) => {
  return getProfilePicture("ProfilePictures" + "/" + uid + "/" + "profile.png");
};

export const retrieveSenderData = (uid) => {
  return readOnceFromDatabase("Users" + "/" + uid);
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
