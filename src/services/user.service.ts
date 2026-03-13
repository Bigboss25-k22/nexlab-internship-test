import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import { StoreOwner } from '../entities/StoreOwner';
import { Freelancer } from '../entities/Freelancer';
import { NotFoundError } from '../utils/errors';

export interface UserProfileResponse {
  fullName: string;
  email: string;
  phone: string;
  birthDate: Date | null;
  gender: string | null;
  avatar: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  // Role-specific data
  ownerCode?: string;
  freelancerAddress?: {
    houseNumber: string | null;
    street: string | null;
    ward: string | null;
    district: string | null;
    city: string | null;
  };
}

export class UserService {
  private userRepository = AppDataSource.getRepository(User);
  private storeOwnerRepository = AppDataSource.getRepository(StoreOwner);
  private freelancerRepository = AppDataSource.getRepository(Freelancer);

  async getUserProfile(userId: string): Promise<UserProfileResponse> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Base user data (excluding password, id, isVerified)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, id, isVerified, ...userWithoutSensitiveData } = user;
    const profile: UserProfileResponse = {
      ...userWithoutSensitiveData,
    };

    // Get role-specific data
    if (user.role === 'owner') {
      const storeOwner = await this.storeOwnerRepository.findOne({
        where: { userId: user.id },
      });
      if (storeOwner) {
        profile.ownerCode = storeOwner.ownerCode;
      }
    } else if (user.role === 'freelancer') {
      const freelancer = await this.freelancerRepository.findOne({
        where: { userId: user.id },
      });
      if (freelancer) {
        profile.freelancerAddress = {
          houseNumber: freelancer.houseNumber,
          street: freelancer.street,
          ward: freelancer.ward,
          district: freelancer.district,
          city: freelancer.city,
        };
      }
    }

    return profile;
  }
}
