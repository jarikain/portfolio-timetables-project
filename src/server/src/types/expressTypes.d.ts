import { AdminUser } from '../models/admin.js';

declare global {
  namespace Express {
    interface User extends AdminUser {}
  }
}
