import { User } from '@/models/user.ts';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export const comparePassword = async (password: string, hashedPassword: string) => {
  return bcryptjs.compare(password, hashedPassword);
};

export const hashPassword = async (password: string) => {
  const salt = await bcryptjs.genSalt(10); // salt rounds
  return bcryptjs.hash(password, salt);
};

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      user: {
        id: user.id,
        username: user.username,
      },
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

export const getUserByToken = async (
  userId: string,
  userName: string,
  userEmail: string
): Promise<any> => {
  return new Promise((resolve, reject) => {
    User.findOne(
      {
        id: userId,
        username: userName.toLowerCase(),
        email: userEmail.toLowerCase(),
      },
      (error, user) => {
        if (error) return reject(error);
        resolve(user);
      }
    );
  });
};

export const getUserByName = async (userName: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    User.findOne({ username: userName.toLowerCase() }, (error, user) => {
      if (error) return reject(error);
      resolve(user);
    });
  });
};

export const getUserByEmail = async (userEmail: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    User.findOne({ email: userEmail.toLowerCase() }, (error, user) => {
      if (error) return reject(error);
      resolve(user);
    });
  });
};

export const createUser = async (
  userName: string,
  userEmail: string,
  userPassword: string
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const newUser = new User({
      id: uuidv4(),
      username: userName.toLowerCase(),
      email: userEmail.toLowerCase(),
      password: userPassword,
    });

    newUser.save((error: Error) => {
      if (error) return reject(error);
      resolve(newUser);
    });
  });
};

// In Cassandra, cannot delete by non-primary fields
export const deleteUserById = async (userId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    User.delete({ id: userId }, (error: Error | null) => {
      if (error) return reject(error);
      resolve();
    });
  });
};
