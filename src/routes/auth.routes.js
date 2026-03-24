import { Router } from 'express';
import { registerUser, loginUser, logoutUser } from '#controllers/auth.controller';
import { requireJson } from '#middleware/requireJson';
import { requireAuth } from '#middleware/requireAuth';

export const authRouter = Router();

authRouter.post('/register', requireJson, registerUser);
authRouter.post('/login', requireJson, loginUser);
authRouter.post('/logout', requireAuth, logoutUser);
