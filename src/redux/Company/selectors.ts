import { RootState } from '../store';
import { Company } from './slices';

export const getCompany = (state: RootState): Company => state.company.company;
