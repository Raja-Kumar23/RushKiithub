import { auth, googleProvider } from './firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { subAdmins } from '@/data/sub-admins';

const allowedEmails = [
  // KIIT Admin
  '23053769@kiit.ac.in',
  // Additional allowed emails
 
  'sahrajakumar0223@gmail.com',
  'babbbbubhaiya@gmail.com',
  'anoooopgupta798@gmail.com',
  'kiithub025@gmail.com'
];

export const isValidEmail = (email) => {
  return email.endsWith('@kiit.ac.in') || allowedEmails.includes(email);
};

export const getUserRole = async (email) => {
  if (email === '23053769@kiit.ac.in') {
    return 'admin';
  }
  
  if (allowedEmails.includes(email)) {
    return 'admin';
  }
  
  // Check if user is a sub-admin
  const subAdmin = subAdmins.find(sa => sa.email === email);
  if (subAdmin) {
    return 'sub-admin';
  }
  
  return 'student';
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    if (!isValidEmail(user.email)) {
      await signOut(auth);
      throw new Error('Access denied. Only KIIT students (@kiit.ac.in) and authorized users can access this system.');
    }
    
    return result;
  } catch (error) {
    throw error;
  }
};

export const logout = () => signOut(auth);