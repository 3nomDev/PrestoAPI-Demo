export class User {
  uid: string;
  name: string;
  email: string;
  created?: string;
  lastLogin?: string;
  token?: string;
  password?: string;
  provider?: string;
  expMinutes?: number;
  photo?: string;
  metadata?: any;
}
