export type User = {
  id: number;
  name: string;
  email: string;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
};

export type CurrentUserResponse = {
  user: User;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};
