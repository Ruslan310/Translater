import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import {Provider as PaperProvider} from 'react-native-paper';
import {WordsModel} from "./src/database/models/WordsModel";
import {StatisticsModel} from "./src/database/models/StatisticsModel";
import schema from './src/database/schema';
import {Database} from '@nozbe/watermelondb';

const adapter = new SQLiteAdapter({
  schema,
  jsi: true,
  onSetUpError: error => {
    console.log('onSetUpError', error);
  },
});

const database = new Database({
  adapter,
  modelClasses: [WordsModel, StatisticsModel],
});


const App = () => (
  <DatabaseProvider database={database}>
    <PaperProvider>
      <AppNavigator/>
    </PaperProvider>
  </DatabaseProvider>
)

export default App;
