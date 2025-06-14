import models from './index';

interface IUser {
  id: string;
  username: string;
  email: string;
  password: string;
}

const UserSchema = models.loadSchema('User', {
  table_name: 'users',
  fields: {
    id: 'uuid',
    username: 'text',
    email: 'text',
    password: 'text',
  },
  key: ['id'],
});

// Sync DB schema
UserSchema.syncDB((error: Error | null) => {
  if (error) throw error;
  console.log('User table synced');
});

export const User = models.instance.User as {
  new (data: IUser): IUser & { save: (cb: (error?: Error) => void) => void };
  findOne: (query: Partial<IUser>, callback: (error: Error | null, user?: IUser) => void) => void;
};
