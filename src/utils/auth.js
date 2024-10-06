// src/utils/auth.js

import { auth } from './firebase'; // Adjust the import based on your setup
import { createUserWithEmailAndPassword } from 'firebase/auth';

// Sign-in function
export const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential; // Return the userCredential if needed
  } catch (error) {
    console.error("Error signing in: ", error.code, error.message); // Log error code and message
    throw new Error("Failed to sign in: " + error.message); // Provide more detailed error
  }
};
// Sign-up function
export const signUpUser = async (email, password, role) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential; // Return the userCredential if needed
  } catch (error) {
    console.error("Error signing up: ", error.message);
    throw new Error("Failed to sign up");
  }
};
