import { Quote } from '../types';
import { athleteQuotes } from './athletes';
import { poetQuotes } from './poets';
import { leaderQuotes } from './leaders';
import { scientistQuotes } from './scientists';
import { businessQuotes } from './business';
import { activistQuotes } from './activists';
import { indianQuotes } from './indian';
import { historicalQuotes } from './historical';
import { modernQuotes } from './modern';
import { bengaliQuotes } from './bengali';

export const allQuotes: Quote[] = [
  ...athleteQuotes,
  ...poetQuotes,
  ...leaderQuotes,
  ...scientistQuotes,
  ...businessQuotes,
  ...activistQuotes,
  ...indianQuotes,
  ...historicalQuotes,
  ...modernQuotes,
  ...bengaliQuotes,
];

export {
  athleteQuotes,
  poetQuotes,
  leaderQuotes,
  scientistQuotes,
  businessQuotes,
  activistQuotes,
  indianQuotes,
  historicalQuotes,
  modernQuotes,
  bengaliQuotes,
};
