import { UserRegistrationData } from './auth.model';

export interface AuthResponse {

  auth: {
    data: UserRegistrationData[];
  };

  total: number;

  pagination: {

    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
    total_visible: number;
    itemsPerPage: number;
  };
}
