export type RoleType = 'user' | 'admin';

export type UserType = {
  login: string;
  full_name: string;
  role: RoleType;
  job_title: string;
  email: string;
  is_active: boolean;
};

export type UserTypeApi = {
  id: string;
} & UserType;

export type UserTypeModel = {
  id: string;
  login: string;
  fullName: string;
  role: RoleType;
  jobTitle: string;
  email: string;
  isActive: boolean;
};

export const normalizeUserType = (user: UserTypeApi): UserTypeModel => ({
  id: user.id,
  login: user.login,
  fullName: user.full_name,
  role: user.role,
  jobTitle: user.job_title,
  email: user.email,
  isActive: user.is_active,
});

export type CreateUserType = {
  password: string;
} & UserType;
