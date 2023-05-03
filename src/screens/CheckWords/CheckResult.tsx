import React from 'react';
import {Alert, StyleSheet, View} from "react-native";
import {useNavigation, useRoute} from "@react-navigation/native";
import {Button, Title} from "react-native-paper";
import {StackNavigationProp} from "@react-navigation/stack";
import {MainStackNavigationParamList} from "../../navigation/AppNavigator";
import {Mode} from "../../model/modelButton";
import {useDatabase} from "@nozbe/watermelondb/hooks";
import {StatisticsModel} from "../../database/models/StatisticsModel";
import {configTest} from "../../config/testConstant";


const CheckResult = () => {
  const database = useDatabase();
  const {navigate} =
    useNavigation<StackNavigationProp<MainStackNavigationParamList>>();
  const route = useRoute();
  const {count} = route.params as {count: number};

  const countResult = (count: number) => {
    if(!count) return null;
    let result = (count/configTest.testCounts)*100
    return `${result}%`
  }

  const CreateNewTestResult = async () => {
    if (count) {
      const newWord = {
        correctAnswers: count,
        wrongAnswers: configTest.testCounts-count,
        date: Date.now(),
      };

      await database.write(async () => {
        await database.get(StatisticsModel.table).create(word => {
          Object.assign(word, newWord);
        });
      });
      navigate('Home')
    } else {
      Alert.alert(
        'Error',
        'Please fill in all fields correctly.',
        [{text: 'OK'}],
        {
          cancelable: false,
        },
      );
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Your test result: {countResult(count)}</Title>
      <Button
        mode={Mode.Contained}
        style={styles.backButton}
        onPress={CreateNewTestResult}
      >
        Back to list
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    marginVertical: 15,
    marginHorizontal: 5
  },
  backButton: {
    width: 200
  }
});

export default CheckResult;
