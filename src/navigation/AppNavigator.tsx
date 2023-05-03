import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import CreateWords from '../screens/Home/CreateWords'
import CheckResult from '../screens/CheckWords/CheckResult'
import CheckWords from '../screens/CheckWords/CheckWords'
import EditWords from '../screens/Home/EditWords'
import Home from '../screens/Home/Home'
import HeaderBackButton from '../component/HeaderBackButton/HeaderBackButton';
import {StatisticsModel} from "../database/models/StatisticsModel";
import {useDatabase} from '@nozbe/watermelondb/hooks';
import { Badge } from 'react-native-paper';
import COLORS from "../colors/colors";
import {StyleSheet} from "react-native";

export type MainStackNavigationParamList = {
  Main: undefined;
  Home: undefined;
  CreateWords: undefined;
  EditWords: {id: string};
  CheckResult: {count: number};
  CheckWords: undefined;
};

const Stack = createStackNavigator<MainStackNavigationParamList>();

const AppNavigator = () => {
  const database = useDatabase();
  const [statistics, setStatistics] = useState<StatisticsModel[]>([]);

  useEffect(() => {
    database
      .get<StatisticsModel>(StatisticsModel.table)
      .query()
      .observe()
      .subscribe(setStatistics);
  }, [database]);


  const calculatePercentage = () => {
    if (statistics.length === 0) {
      return '0%';
    }
    const totalCorrectAnswers = statistics.reduce((acc, curr) => acc + curr?.correctAnswers, 0);
    const totalWrongAnswers = statistics.reduce((acc, curr) => acc + curr?.wrongAnswers, 0);
    const totalAnswers = totalCorrectAnswers + totalWrongAnswers;
    const percentage = (totalCorrectAnswers / totalAnswers) * 100;
    return percentage.toFixed(2) + '%';
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
      >
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            title: 'Home',
            headerRight: () => (
              <Badge size={25} style={styles.statistics}>
                {calculatePercentage()}
              </Badge>
            ),
          }}
        />
        <Stack.Screen
          options={{
            title: 'Create Words',
            headerLeft: () => <HeaderBackButton />,
          }}
          name="CreateWords"
          component={CreateWords}
        />
        <Stack.Screen
          options={{
            title: 'Check Result',
            headerLeft: () => null,
          }}
          name="CheckResult"
          component={CheckResult}
        />
        <Stack.Screen
          options={{
            title: 'Edit Words',
            headerLeft: () => <HeaderBackButton />,
          }}
          name="EditWords"
          component={EditWords}
        />
        <Stack.Screen
          options={{
            title: 'Check Words',
            headerLeft: () => <HeaderBackButton />,
          }}
          name="CheckWords"
          component={CheckWords}
        />
      </Stack.Navigator>

    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  statistics: {
    backgroundColor: COLORS.blueNavy70,
    marginHorizontal: 20
  }
});

export default AppNavigator;
