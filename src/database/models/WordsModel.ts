import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';
import {tableSchema} from '@nozbe/watermelondb';
import {WORDS} from '../tables';
import {WordsColumns} from '../columns';

class WordsModel extends Model {
  static table = WORDS;

  @field(WordsColumns.word) word!: string;
  @field(WordsColumns.translation) translation!: string;
}

const WordsSchema = tableSchema({
  name: WORDS,
  columns: [
    {name: WordsColumns.word, type: 'string', isOptional: false},
    {name: WordsColumns.translation, type: 'string', isOptional: false},
  ],
});

export {WordsModel, WordsSchema};
