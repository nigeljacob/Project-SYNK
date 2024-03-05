import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { User } from "./classes";
import { auth, firebaseRealtimeDatabase } from "./firebase";
import { readOnceFromDatabase, read_OneValue_from_Database, updateDatabase, uploadToStrorage, writeToDatabase } from "./firebaseCRUD";
import { sendNotification } from "./teamFunctions";
import { getDownloadURL } from "firebase/storage";
import { OnDisconnect, ref } from "firebase/database";

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

export const uploadProfilePic = (UID, Image, onImageUploaded) => {
    const uploadTask = uploadToStrorage("Users/" + UID + "/ProfilePics/profilePic.jpg", Image);

    uploadTask.on("state_changed",
      (snapshot) => {},
      (error) => {
        sendNotification("Image Upload Failed", "Your Profile Picture failed at upload", "danger", UID)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          onImageUploaded(downloadURL)
        });
      }
    );
}

export const updateProfileData = (displayName, email, phoneNumber, profileImage, about, setLoadingTriger) => {

  if(profileImage != null) {
    uploadProfilePic(auth.currentUser.uid, profileImage, (photoURL) => {
      if(phoneNumber != null) {
        updateProfile(auth.currentUser, {
          displayName: displayName,
          email: email,
          phoneNumber: phoneNumber,
          photoURL: photoURL
        }).catch((error) => {
           sendNotification("Failed to Update Data", "An error occured while trying to update your data",  "danger", auth.currentUser.uid);
           setLoadingTriger(false)
        });
      } else {
        updateProfile(auth.currentUser, {
          displayName: displayName,
          email: email,
          photoURL: photoURL
        }).catch((error) => {
          sendNotification("Failed to Update Data", "An error occured while trying to update your data",  "danger", auth.currentUser.uid);
          setLoadingTriger(false)
        });
      }

      if(about != "") {
        readOnceFromDatabase("Users/" + auth.currentUser.uid, (user) => {
          user = {email: email, profile: photoURL, uid: auth.currentUser.uid, userStatus: "Active", username: displayName, about: about}
          console.log(user)
          updateDatabase("Users/" + auth.currentUser.uid, user).then(() => {
            sendNotification("Profile Updated Succesfully", "Your Profile has been updated", "success", auth.currentUser.uid)
            setLoadingTriger(false)
          }).catch((error) => {
            sendNotification("Profile Updated Failed", error.message, "danger", auth.currentUser.uid)
            setLoadingTriger(false)
          })
        })
      } else {
        updateDatabase("Users/" + auth.currentUser.uid + "/profile", photoURL).then(() => {
          sendNotification("Profile Updated Succesfully", "Your Profile has been updated", "success", auth.currentUser.uid)
          setLoadingTriger(false)
        }).catch((error) => {
          sendNotification("Profile Updated Failed", error.message, "danger", auth.currentUser.uid)
          setLoadingTriger(false)
        })
      }
    })

  } else {
    if(phoneNumber != null) {
      updateProfile(auth.currentUser, {
        displayName: displayName,
        email: email,
        phoneNumber: phoneNumber
      }).catch((error) => {
         sendNotification("Failed to Update Data", "An error occured while trying to update your data",  "danger", auth.currentUser.uid);
         setLoadingTriger(false)
      });
    } else {
      updateProfile(auth.currentUser, {
        displayName: displayName,
        email: email
      }).catch((error) => {
        sendNotification("Failed to Update Data", "An error occured while trying to update your data",  "danger", auth.currentUser.uid);
        setLoadingTriger(false)
      });
    }

    if(about != "") {
      readOnceFromDatabase("Users/" + auth.currentUser.uid, (user) => {
        user = {email: email, uid: auth.currentUser.uid, userStatus: "Active", username: displayName, about: about}
        console.log(user)
        updateDatabase("Users/" + auth.currentUser.uid, user).then(() => {
          sendNotification("Profile Updated Succesfully", "Your Profile has been updated", "success", auth.currentUser.uid)
          setLoadingTriger(false)
        }).catch((error) => {
          sendNotification("Profile Updated Failed", error.message, "danger", auth.currentUser.uid)
          setLoadingTriger(false)
        })
      })
    } else {
      readOnceFromDatabase("Users/" + auth.currentUser.uid, (user) => {
        user = {email: email, uid: auth.currentUser.uid, userStatus: "Active", username: displayName}
        console.log(user)
        updateDatabase("Users/" + auth.currentUser.uid, user).then(() => {
          sendNotification("Profile Updated Succesfully", "Your Profile has been updated", "success", auth.currentUser.uid)
          setLoadingTriger(false)
        }).catch((error) => {
          sendNotification("Profile Updated Failed", error.message, "danger", auth.currentUser.uid)
          setLoadingTriger(false)
        })
      })
    }

  }
} 

export const runOnDisconnect = () => {
  const presenceRef = ref(firebaseRealtimeDatabase, "Users/" + auth.currentUser.uid);

  OnDisconnect(presenceRef).set("Offline");
}

export const getProfilePicture = (UID, onDataReceived) => {
  read_OneValue_from_Database("Users/" + UID + "/profile", onDataReceived)
}