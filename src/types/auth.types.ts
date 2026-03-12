export interface RegisterDto {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role?: 'user' | 'store_owner' | 'freelancer';
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface AuthResponse {
  user: {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  userId: number;
  role: string;
}

export interface RefreshTokenPayload {
  userId: number;
}
