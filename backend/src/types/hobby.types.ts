import { HOBBIES } from '../utils/hobbies';

export type GetAllHobbiesResponse = {
  message: string;
  data?: {
    hobbies: typeof HOBBIES;
  };
};
