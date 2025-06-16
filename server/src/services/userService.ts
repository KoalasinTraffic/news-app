import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';

export const comparePassword = async (password: string, hashedPassword: string) => {
  return bcryptjs.compare(password, hashedPassword);
};

export const hashPassword = async (password: string) => {
  const salt = await bcryptjs.genSalt(10); // salt rounds
  return bcryptjs.hash(password, salt);
};

export const generateAccessToken = (user: any) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }
  return jwt.sign(
    {
      user: {
        username: user.username,
      },
    },
    secret,
    { expiresIn: '1d' }
  );
};

// Cassandra is optimized for searching by primary key
export const getUserById = async (userId: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    User.findOne(
      {
        username: userId.toLowerCase(),
      },
      (error, user) => {
        if (error) return reject(error);
        resolve(user);
      }
    );
  });
};

export const createUser = async (
  userName: string,
  userEmail: string,
  userPassword: string
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const newUser = new User({
      username: userName.toLowerCase(),
      email: userEmail.toLowerCase(),
      password: userPassword,
    });

    newUser.save((error: Error | undefined) => {
      if (error) return reject(error);
      resolve(newUser);
    });
  });
};

// In Cassandra, cannot delete by non-primary fields
export const deleteUserById = async (userId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    User.delete(
      {
        username: userId.toLowerCase(),
      },
      (error: Error | null) => {
        if (error) return reject(error);
        resolve();
      }
    );
  });
};
