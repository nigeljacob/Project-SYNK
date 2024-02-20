import { firebaseRealtimeDatabase } from "./firebase";
import { onValue, ref, set, push } from "firebase/database";

// write to firebase Realtime Database with and without unique key
export const writeToDatabase = (referencePath, data, type) => {
    if(type == "withKey") {
        let key = push(ref(firebaseRealtimeDatabase, referencePath), data).key();
        return set(ref(firebaseRealtimeDatabase, referencePath).child(key), data);
    } else if(type == "withoutKey") {
        return set(ref(firebaseRealtimeDatabase, referencePath), data);
    }

}

// Read one value from firebase Realtime database
export const read_OneValue_from_Database = (referencePath) => {
    const dataReference = ref(firebaseRealtimeDatabase, referencePath);
    onValue(dataReference, (snapshot) => {
        return snapshot.val();
    })
}

// Read a group of values from firebase Realtime database
export const read_from_Database = (referencePath) => {

    let dataList = [];

    const dataReference = ref(firebaseRealtimeDatabase, referencePath);
    onValue(dataReference, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            dataList.push(data);
        });
    });

    return dataList
}

// Read value once from firebase database
export const readOnceFromDatabase = (referencePath) => {
    get(child(firebaseRealtimeDatabase, referencePath)).then((snapshot) => {
        if (snapshot.exists()) {
          return snapshot.val();
        } else {
          return null
        }
      }).catch((error) => {
        console.error(error.message);
      });
    
}
