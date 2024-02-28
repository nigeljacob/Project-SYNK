import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { User } from "./classes";
import { auth } from "./firebase";
import { read_OneValue_from_Database, updateDatabase, writeToDatabase } from "./firebaseCRUD";

export const createUser = async (email, password, displayName) => {
  return createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      const user = User(auth.currentUser.uid, email, displayName, "", "active");
      writeToDatabase("Users/" + auth.currentUser.uid, user).catch((error) => {
        console.log(`Error writing to database: ${error.message}`);
      });

      updateProfile(auth.currentUser, {
        displayName: displayName,
      }).catch((error) => {
        console.error(error.message);
      });
    })
    .catch((error) => {
      console.error(error.message);
    });
};

export const loginUser = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signOut = () => {
  return auth.signOut();
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const updateStatus = (status) => {
  updateDatabase("Users/" + auth.currentUser.uid, {"userStatus": status})
}

export const getStatus = (UID, onStatusReceived) => {
  read_OneValue_from_Database("Users/" + UID + "/userStatus", onStatusReceived)
}