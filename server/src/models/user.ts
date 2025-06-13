import models from './index';

interface IUser {
  id: string;
  name: string;
  email: string;
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
UserSchema.syncDB((err: Error | null) => {
  if (err) throw err;
  console.log('User table synced');
});

export const User = models.instance.User as {
  new (data: IUser): IUser & { save: (cb: (err?: Error) => void) => void };
  findOne: (query: Partial<IUser>, callback: (err: Error | null, user?: IUser) => void) => void;
};
