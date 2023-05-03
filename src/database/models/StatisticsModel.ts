import {Model, tableSchema} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';
import {STATISTICS} from '../tables';
import {StatisticsColumns} from '../columns';


class StatisticsModel extends Model {
  static table = STATISTICS;

  @field(StatisticsColumns.correctAnswers) correctAnswers!: number;
  @field(StatisticsColumns.wrongAnswers) wrongAnswers!: number;
  @field(StatisticsColumns.date) date!: number;
}

const StatisticsSchema = tableSchema({
  name: STATISTICS,
  columns: [
    {name: StatisticsColumns.correctAnswers, type: 'number', isOptional: false},
    {name: StatisticsColumns.wrongAnswers, type: 'number', isOptional: false},
    {name: StatisticsColumns.date, type: 'number', isOptional: false},
  ],
});

export {StatisticsModel, StatisticsSchema};
