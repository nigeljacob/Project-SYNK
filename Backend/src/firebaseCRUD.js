import { onValue, push, ref, set, get, child, onChildChanged, onChildAdded } from "firebase/database";
import { firebaseRealtimeDatabase } from "./firebase";
import { Team } from "./classes";

// write to firebase Realtime Database with and without unique key
export const writeToDatabase = (referencePath, data) => {
  return set(ref(firebaseRealtimeDatabase, referencePath), data);
};

// export const generateKey = (referencePath) => {
//   return push(ref(firebaseRealtimeDatabase, referencePath)).key();
// };

export const generateKey = (referencePath) => {
  // Push a new child entry to the specified reference path
  const childRef = push(ref(firebaseRealtimeDatabase, referencePath));
  // Retrieve the key of the newly generated child entry
  return childRef.key;
};

// Read one value from firebase Realtime database
export const read_OneValue_from_Database = (referencePath, onDataReceived) => {
  const dataReference = ref(firebaseRealtimeDatabase, referencePath);
  onValue(dataReference, (snapshot) => {
    onDataReceived(snapshot.val())
  });
};

// Read a group of values from firebase Realtime database
export const read_from_Database_onChange = (referencePath, onDataReceived) => {
  const dataReference = ref(firebaseRealtimeDatabase, referencePath);

  onValue(dataReference, (snapshot) => {
    let dataList = []
    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val();
      dataList.push(data);
    });

    onDataReceived(dataList)
  })

};




// Read value once from firebase database
export const readOnceFromDatabase = (referencePath) => {
  get(child(firebaseRealtimeDatabase, referencePath))
    .then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        return null;
      }
    })
    .catch((error) => {
      console.error(error.message);
    });
};

// Get profile Picture
export const getProfilePicture = (referencePath) => {
  return null;
};
