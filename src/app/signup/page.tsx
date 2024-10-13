"use client"; // Enable client component features

import { useState, FormEvent } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../utils/firebase'; // Adjust the import path
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const SignUp = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false); // State to control password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false); // State to control confirm password visibility
  const router = useRouter();

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic validation
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        role: 'student', // or adjust according to your app's logic
      });

      // Redirect to dashboard or other page after sign up
      router.push('/student-dashboard');
    } catch (error) {
      setError("Failed to sign up. Please check your credentials and try again.");
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#fff', marginLeft:'5%' }}>
      {/* Left Side: Image and Text */}
      <div style={{ flex: 1, position: 'relative', backgroundColor: '#fff', height: '100%' }}>
        <div style={{ position: 'absolute', top: '15%', left: '20%', transform: 'translate(-50%, -50%)', textAlign: 'left' }}>
          <h1 style={{ color: '#FF7A00', fontSize: '3rem', fontWeight: 'bold' }}>ONLINE</h1>
          <h1 style={{ color: '#000', fontSize: '3rem', fontWeight: 'bold' }}>LEARNING</h1>
        </div>
        <div style={{ backgroundImage: 'url(/assets/images/online-learning.png)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', height: '70%', width: '95%', marginTop: '30%' }} />
      </div>

      {/* Right Side: Sign Up Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px' }}>
        <form onSubmit={handleSignUp} style={{ height:'100%', maxHeight: '800px', width: '100%', maxWidth: '600px', padding: '20px', backgroundColor: '#fff', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', borderRadius: '20px' }}>
          <h2 style={{ color: '#000', fontSize: '2rem', marginBottom: '10px', paddingTop:'120px' }}>Sign Up</h2>
          <p style={{ color: '#000', fontSize: '1rem', marginBottom: '20px' }}>
            Already have an account?{' '}
            <span 
                onClick={() => router.push('./login')} 
                style={{ color: '#FF7A00', textDecoration: 'none', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Log in
            </span>
          </p>

          {/* Error Message Display */}
          {error && (
            <div style={{ color: 'red', marginBottom: '10px', padding: '10px', border: '1px solid red', borderRadius: '5px' }}>
              {error}
            </div>
          )}

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #E5E5E5' }}
          />
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #E5E5E5' }}
          />
          
          {/* Password Input */}
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'} // Toggle between text and password
              placeholder="Create your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #E5E5E5' }}
            />
            <span
              style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
              onMouseEnter={() => setShowPassword(true)} // Show password on hover
              onMouseLeave={() => setShowPassword(false)} // Hide password when not hovering
            >
              👁️
            </span>
          </div>

          {/* Confirm Password Input */}
          <div style={{ position: 'relative' }}>
            <input
              type={showConfirmPassword ? 'text' : 'password'} // Toggle between text and password
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #E5E5E5' }}
            />
            <span
              style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
              onMouseEnter={() => setShowConfirmPassword(true)} // Show confirm password on hover
              onMouseLeave={() => setShowConfirmPassword(false)} // Hide confirm password when not hovering
            >
              👁️
            </span>
          </div>

          <button
            type="submit"
            style={{ width: '100%', padding: '12px', margin: '20px 0', backgroundColor: '#FF7A00', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' }}
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
