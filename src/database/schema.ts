import {appSchema} from '@nozbe/watermelondb';
import {StatisticsSchema} from './models/StatisticsModel';
import {WordsSchema} from './models/WordsModel';

export default appSchema({
  version: 1,
  tables: [StatisticsSchema, WordsSchema],
});
