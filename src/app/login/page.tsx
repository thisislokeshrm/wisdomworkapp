"use client"; // Add this line to enable client component features

import { useState, FormEvent } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../../utils/firebase'; // Adjusted the import path
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation'; // Change this import

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.role === 'student') {
          router.push('/dashboard/student');
        } else if (userData.role === 'teacher') {
          router.push('/dashboard/teacher');
        } else if (userData.role === 'admin') {
          router.push('/dashboard/admin');
        }
      }
    } catch (error) {
      setError('Failed to log in. Please check your credentials and try again.');
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.role === 'student') {
          router.push('/dashboard/student');
        } else if (userData.role === 'teacher') {
          router.push('/dashboard/teacher');
        } else if (userData.role === 'admin') {
          router.push('/dashboard/admin');
        }
      }
    } catch (error) {
      setError('Failed to log in with Google. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#fff', marginLeft:'5%'}}>
      {/* Left Side: Image and Text */}
      <div style={{ flex: 1, position: 'relative', backgroundColor: '#fff', height: '100%' }}>
        <div style={{ position: 'absolute', top: '15%', left: '20%', transform: 'translate(-50%, -50%)', textAlign: 'left', }}>
          <h1 style={{ color: '#FF7A00', fontSize: '3rem', fontWeight: 'bold' }}>ONLINE</h1>
          <h1 style={{ color: '#000', fontSize: '3rem', fontWeight: 'bold' }}>LEARNING</h1>
        </div>
        <div style={{ backgroundImage: 'url(../../assets/images/online-learning.png)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: '', height: '70%', width: '95%', marginTop: '30%' }} />
      </div>

      {/* Right Side: Login Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px'}}>
        <form onSubmit={handleLogin} style={{ height:'100%', maxHeight: '800px', width: '100%', maxWidth: '600px', padding: '20px', backgroundColor: '#fff', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', borderRadius: '20px' }}>
          <h2 style={{ color: '#000', fontSize: '2rem', marginBottom: '10px', paddingTop:'120px'}}>Log in</h2>
          <p style={{ color: '#000', fontSize: '1rem', marginBottom: '20px' }}>
            Never had a chance to?{' '}
            <span 
                onClick={() => router.push('/signup')} 
                style={{ color: '#FF7A00', textDecoration: 'none', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Register
            </span>
          </p>

          {/* Error Message Display */}
          {error && (
            <div style={{ color: 'red', marginBottom: '10px', padding: '10px', border: '1px solid red', borderRadius: '5px' }}>
              {error}
            </div>
          )}

          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #E5E5E5' }}
          />
          <div style={{ position: 'relative' }}>
            <input
              type="password"
              placeholder="Create your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #E5E5E5' }}
            />
            <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>
              👁️
            </span>
          </div>

          <button
            type="submit"
            style={{ width: '100%', padding: '12px', margin: '20px 0', backgroundColor: '#FF7A00', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' }}
          >
            Log-in
          </button>

          <div style={{ textAlign: 'center', marginBottom: '10px' }}>Or</div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            style={{ width: '100%', padding: '12px', backgroundColor: '#fff', border: '1px solid #E5E5E5', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <img src="../../assets/images/google-logo.png" alt="Google Icon" style={{ width: '20px', marginRight: '10px' }} />
            Sign in with Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
