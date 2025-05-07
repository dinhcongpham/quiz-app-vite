export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
  role: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  userId: number;
  fullName: string;
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiryDay: Date;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  userId: string;
  token: string;
  password: string;
  confirmPassword: string;
} 