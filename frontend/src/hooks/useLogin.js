import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      // If the response is not OK, check if it's empty or malformed
      const responseText = await response.text();
      const json = responseText ? JSON.parse(responseText) : null;

      if (!response.ok) {
        setIsLoading(false);
        setError(json?.error || 'Login failed. Please try again.');
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
      console.error('Login error:', error);
    }
  };

  return { login, isLoading, error };
};
