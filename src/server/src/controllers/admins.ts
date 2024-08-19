import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { AdminUser } from '../models/admin.js';
import { DatabaseService } from '../services/databaseService.js';
import passport from 'passport';
import { responseToGet, responseToPost } from '../utils/middleware.js';

export function login(req: Request, res: Response): void {
  if (req.user && typeof req.user === 'object' && 'username' in req.user) {
    req.session.save((err) => {
      if (err) {
        res.status(500).json({ message: 'Error saving session' });
      } else {
        res.json({ message: 'Login successful', user: { username: req.user?.username } });
      }
    });
  } else {
    res.status(500).json({ message: 'Invalid user data' });
  }
}

export function logout(req: Request, res: Response): void {
  req.logout((err) => {
    if (err) {
      res.status(500).json({ message: 'Error logging out' });
    } else {
      res.json({ message: 'Logout successful' });
    }
  });
}

interface RegisterRequestBody {
  username: string;
  password: string;
}

function isValidRegisterRequestBody(body: unknown): body is RegisterRequestBody {
  return (
    typeof body === 'object' &&
    body !== null &&
    'username' in body &&
    'password' in body &&
    true &&
    true
  );
}

export async function register(req: Request, res: Response): Promise<void> {
  if (!isValidRegisterRequestBody(req.body)) {
    res.status(400).json({ message: 'Invalid request body' });
    return;
  }

  const { username, password } = req.body;

  try {
    const databaseService = await DatabaseService.getInstance();
    const adminRepo = databaseService.getRepository(AdminUser);

    const existingUser = await adminRepo.findOne({ where: { username } });
    if (existingUser) {
      res.status(400).json({ message: 'Username already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = adminRepo.create({ username, password: hashedPassword });
    await adminRepo.save(newUser);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user' });
  }
}

export async function initialRegister(req: Request, res: Response): Promise<void> {
  const databaseService = await DatabaseService.getInstance();
  const userAlreadyCreated = await databaseService.hasUser();

  if (userAlreadyCreated) {
    res.status(400).json({ message: 'User is already created' });
    return;
  }

  await register(req, res);
}

export async function hasUser(req: Request, res: Response): Promise<void> {
  const databaseService = await DatabaseService.getInstance();
  const userAlreadyCreated = await databaseService.hasUser();

  if (userAlreadyCreated) {
    res.status(200).json({ exists: true, message: 'User already exists' });
  } else {
    res.status(404).json({ exists: false, message: 'No user found' });
  }
}

interface AuthInfo {
  message: string;
}

export function authenticateMiddleware(req: Request, res: Response, next: NextFunction) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  passport.authenticate(
    'local',
    (err: Error | null, user: AdminUser | false, info: AuthInfo | undefined) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || 'Authentication failed' });
      }
      req.logIn(user, (loginErr) => {
        if (loginErr) {
          return next(loginErr);
        }
        return login(req, res);
      });
    }
  )(req, res, next);
}

export function checkAuth(req: Request, res: Response) {
  if (req.isAuthenticated()) {
    res.json({ user: { username: (req.user as AdminUser).username } });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
}

export async function getAdminUser(req: Request, res: Response) {
  await responseToGet(req, res, AdminUser);
}

export async function postAdminUser(req: Request, res: Response) {
  await responseToPost(req, res, AdminUser);
}

export async function changePassword(req: Request, res: Response): Promise<void> {
  const { newPassword } = req.body as { newPassword: string };
  const userId = (req.user as AdminUser).id;

  try {
    const databaseService = await DatabaseService.getInstance();
    const adminRepo = databaseService.getRepository(AdminUser);
    const user = await adminRepo.findOne({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await adminRepo.save(user);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error changing password' });
  }
}
