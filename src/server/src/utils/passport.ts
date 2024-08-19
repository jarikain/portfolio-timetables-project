import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { AdminUser } from '../models/admin.js';
import { DatabaseService } from '../services/databaseService.js';

export function configurePassport() {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const databaseService = await DatabaseService.getInstance();
        const adminRepo = databaseService.getRepository(AdminUser);
        const user = await adminRepo.findOne({ where: { username } });

        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.serializeUser((user: AdminUser, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const databaseService = await DatabaseService.getInstance();
      const adminRepo = databaseService.getRepository(AdminUser);
      const user = await adminRepo.findOne({ where: { id } });
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}
