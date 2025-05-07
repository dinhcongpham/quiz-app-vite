export interface User {
  id: number;
  email: string;
  fullName: string;
  role: string;
}

export interface ChangeUserNameDto {
  userId: number;
  fullName: string;
}

export interface ChangeUserPasswordDto {
  userId: number;
  oldPassword: string;
  newPassword: string;
} 