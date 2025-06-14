import axios from 'axios';
import { createContext, useContext } from 'react';

import {
  checkLogin,
  checkRegister,
  delToken,
  getToken,
  isUserObject,
  processError,
  setToken,
} from './utils.ts';

interface AuthContextProps {
  authLoad: () => Promise<any>; // returns string or userObject
  authLogin: (username: string, password: string) => Promise<string>;
  authLogout: () => Promise<void>;
  authRegister: (
    username: string,
    password: string,
    confirmPassword: string,
    email: string
  ) => Promise<string>;
  isAuth: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Verify authentication
  const authLoad = async (): Promise<any> => {
    console.log('CLIENT authLoad');
    try {
      const token = await getToken();
      if (token) {
        axios.defaults.headers.common['x-auth-token'] = token;
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user`);
        delete axios.defaults.headers.common['x-auth-token'];
        if (res.data.user) {
          if (isUserObject(res.data.user)) {
            return res.data.user; // returns userObject
          }
        }
      }
      await authLogout();
      return undefined; // called frequently
    } catch (error) {
      await authLogout();
      return processError(error);
    }
  };

  // Log in
  const authLogin = async (username: string, password: string): Promise<string> => {
    console.log('CLIENT authLogin');
    try {
      const errorMessage = checkLogin(username, password);
      if (errorMessage !== 'success') {
        return errorMessage;
      }
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/login`,
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (res.data.token) {
        await setToken(res.data.token);
        const userObject = await authLoad();
        if (userObject) {
          return 'success';
        }
      }
      throw new Error('Log in failed.');
    } catch (error) {
      return processError(error);
    }
  };

  // Log out
  const authLogout = async (): Promise<void> => {
    try {
      await delToken();
    } catch (error) {
      console.error(error);
    }
  };

  // Sign up
  const authRegister = async (
    username: string,
    password: string,
    confirmPassword: string,
    email: string
  ): Promise<string> => {
    console.log('CLIENT authRegister');
    try {
      const errorMessage = checkRegister(username, password, confirmPassword, email);
      if (errorMessage !== 'success') {
        return errorMessage;
      }
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/register`,
        { username, password, confirmPassword, email },
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (res.data.token) {
        await setToken(res.data.token);
        const userObject = await authLoad();
        if (userObject) {
          return 'success';
        }
      }
      throw new Error('Registration failed.');
    } catch (error) {
      return processError(error);
    }
  };

  // Get authentication token
  const isAuth = async (): Promise<boolean> => {
    console.log('CLIENT isAuth');
    try {
      const token = await getToken();
      if (token) {
        return true;
      }
    } catch (error) {
      console.error(error);
    }
    await authLogout();
    return false;
  };

  return (
    <AuthContext.Provider value={{ authLoad, authLogin, authLogout, authRegister, isAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
