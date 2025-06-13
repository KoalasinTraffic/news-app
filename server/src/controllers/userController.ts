import {
  comparePassword,
  createUser,
  generateAccessToken,
  getUserByEmail,
  getUserByName,
  getUserByToken,
  hashPassword,
} from '@/services/userService.ts';
import { NextFunction, Request, Response } from 'express';

// Confirm user from token matches database
export const getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log('SERVER getUser');
  try {
    // req.user is set by middleware authUser
    if (req.user) {
      const userObject = await getUserByToken(req.user.id, req.user.username, req.user.email);
      if (userObject) {
        console.log(`user '${userObject.username}' found`);
        // TODO: convert userObject to an actual UserObject before sending to client
        res.status(200).json({ user: userObject }); // TODO: prevent password from being sent to client
        return;
      }
    }
    console.log('Unauthorized access');
    res.status(401).json({ message: 'Unauthorized access.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Read and authenticate user
export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log('SERVER loginUser');
  try {
    const { username, password } = req.body;
    // Verify frontend checks
    if (username.length === 0 || password.length === 0) {
      res.status(400).json({ message: 'All fields are required.' });
      return;
    }
    // Check if account exists
    const userObject = await getUserByName(username);
    if (userObject) {
      const isMatch = await comparePassword(password, userObject.password);
      if (isMatch) {
        res.status(200).json({ token: generateAccessToken(userObject) });
        console.log('login success');
        return;
      }
    }
    res.status(401).json({ message: 'Invalid credentials.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Create new user
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log('SERVER registerUser');
  try {
    const { username, password, confirmPassword, email } = req.body;
    // Verify frontend checks
    if (
      username.length === 0 ||
      password.length === 0 ||
      password !== confirmPassword ||
      email.length === 0
    ) {
      res.status(400).json({ message: 'All fields are required.' });
      return;
    }
    // Check if accounts exist
    const userExists = await getUserByName(username);
    if (userExists) {
      res.status(400).json({ message: 'Username already taken.' });
      return;
    }
    const emailExists = await getUserByEmail(email);
    if (emailExists) {
      res.status(400).json({ message: 'Email already registered.' });
      return;
    }
    // Create account
    const hashedPassword = await hashPassword(password);
    const userObject = await createUser(username, email, hashedPassword);
    if (userObject) {
      res.status(200).json({ token: generateAccessToken(userObject) });
      console.log('registration success');
      return;
    }
    res.status(500).json({ message: 'Server error.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};
