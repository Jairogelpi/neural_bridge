import { supabase } from '../db/supabase';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SIGNING_KEY || 'neural-bridge-super-secret-2026';

export class AuthService {
    /**
     * Register a new author/user
     */
    static async register(name: string, handle: string, email: string, password: string) {
        // 1. Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // 2. Insert into Supabase
        const { data, error } = await supabase
            .from('authors')
            .insert({
                name,
                handle,
                email,
                password_hash: passwordHash,
                tier: 'community',
                reputation: 0.5,
                public_key: `NB-${crypto.randomUUID()}`
            })
            .select()
            .single();

        if (error) throw new Error(error.message);

        // 3. Generate token
        const token = jwt.sign({ author_id: data.author_id, handle: data.handle }, JWT_SECRET, { expiresIn: '7d' });

        return { author: data, token };
    }

    /**
     * Login an existing user
     */
    static async login(email: string, password: string) {
        // 1. Get user by email
        const { data, error } = await supabase
            .from('authors')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !data) throw new Error('Invalid email or password');

        // 2. Verify password
        const valid = await bcrypt.compare(password, data.password_hash);
        if (!valid) throw new Error('Invalid email or password');

        // 3. Generate token
        const token = jwt.sign({ author_id: data.author_id, handle: data.handle }, JWT_SECRET, { expiresIn: '7d' });

        return { author: data, token };
    }

    /**
     * Middleware to verify JWT
     */
    static authenticate(req: any, res: any, next: any) {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ error: 'Missing authorization header' });

        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
            next();
        } catch (e) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
    }
}
