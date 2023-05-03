import {columnName} from '@nozbe/watermelondb';

export const StatisticsColumns = {
  correctAnswers: columnName('correct_answers'),
  wrongAnswers: columnName('wrong_answers'),
  date: columnName('date'),
};

export const WordsColumns = {
  word: columnName('title'),
  translation: columnName('translation'),
};
