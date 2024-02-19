import { auth } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";

export const createUser = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password)
}

export const loginUser = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
}

export const signOut = () => {
    return auth.signOut()
}

export const getCurrentUser = () => {
    return auth.currentUser;
}                                    