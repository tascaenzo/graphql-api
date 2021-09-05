import Role from 'src/users/user-role';

export default interface AuthInterface {
  iSrevoked: string;
  userId: string;
  role: Role[];
}
