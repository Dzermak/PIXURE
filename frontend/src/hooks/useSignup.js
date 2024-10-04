import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      // Check if the response is valid before trying to parse
      const responseText = await response.text();
      const json = responseText ? JSON.parse(responseText) : null;

      if (!response.ok) {
        setIsLoading(false);
        setError(json?.error || 'Signup failed. Please try again.');
      } else {
        // Save the user to local storage
        localStorage.setItem('user', JSON.stringify(json));

        // Update the auth context
        dispatch({ type: 'LOGIN', payload: json });

        // Update loading state
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      setError('Something went wrong. Please try again later.');
      console.error('Signup error:', error);
    }
  };

  return { signup, isLoading, error };
};
