import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { apiClient } from '../api/apis';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = jwtDecode(token);

      setToken(token);
      setUser(user);
    }

    setIsLoading(false);
  }, []);

  const loginUser = async (data) => {
    try {
      const response = await apiClient.post('/users/login', {
        login: data.login,
        password: data.password,
      });
      if (response.data) {
        // nurodome, kad response.data turi būti tokenas, kuris yra grąžinamas iš serverio, nes jis yra reikalingas, kad prisijungti prie sistemos
        const token = response.data.token;
        // tai ties ta vieta, mes naudojame user state objektą, kad išsaugoti vartotojo duomenis, kurie yra iš tokeno, kai vartotojas prisijungia
        // o viršuje naudojome useEffect() metodą, kad išsaugoti vartotojo duomenis, kurie yra iš tokeno, tai bus pasiekiamas visada, kai atnaujiname puslapį
        const user = jwtDecode(token);
        // Naudojame localStorage.setItem('token', token), tai todėl, kad kai atnaujiname puslapį, tai mes neprarasime prisijungimo duomenų (token ir user)

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setToken(token);
        setUser(user);

        return { token, user };
      } else {
        throw new Error('Response data is undefined');
      }
    } catch (error) {
      console.error('Failed to log in:', error);
      throw error;
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    // siūsime value kaip props į AuthContext.Provider komponentą, kad būtu galima pasiekti duomenis kituose komponentuose globaliai
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated: !!token,
        isAdmin: user?.role === 'admin',
        token,
        user,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
