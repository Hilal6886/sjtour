import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase'; 

export default function useAdmin() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
      const user={...currentUser}
        setUser(user);
        const userRef = doc(db, 'users', user.uid);
        getDoc(userRef)
        .then((doc) => {
          if (doc.exists) {
            const userData = doc.data();
            user.isAdmin=userData.admin
            localStorage.setItem("USER",JSON.stringify(user||{}))
              if (userData && userData.admin) {
                setIsAdmin(true);
              } else {
                setIsAdmin(false);
              }
            }
          })
          .catch((error) => {
            console.log('Error fetching user data:', error);
          });
      } else {
        localStorage.removeItem("USER")
        setUser(null);
        setIsAdmin(false);
      }
    });
  
    return () => unsubscribe();
  }, []);
  

  return isAdmin;
}
