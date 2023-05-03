import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text} from "react-native";
import {Title, Button} from 'react-native-paper';
import {useDatabase} from '@nozbe/watermelondb/hooks';
import {WordsModel} from '../../database/models/WordsModel';
import {WordsColumns} from '../../database/columns';
import TestWords from './component/TestWords'
import COLORS from "../../colors/colors";
import {Mode} from "../../model/modelButton";
import {configTest} from "../../config/testConstant";

const CheckWords = () => {

  const database = useDatabase();
  const [wordsList, setWordsList] = useState<WordsModel[]>([]);
  const [isTest, setIsStart] = useState<boolean>(false);

  useEffect(() => {
    const subs = database
      .get<WordsModel>(WordsModel.table)
      .query()
      .observeWithColumns([
        WordsColumns.word,
        WordsColumns.translation
      ])
      .subscribe(setWordsList);
    return () => subs.unsubscribe();
  }, [database]);

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Test your knowledge</Title>
      {wordsList.length<configTest.testCounts &&
        <Text style={styles.info}>
          To start the test you need to add at least {configTest.testCounts} words to your dictionary
        </Text>
      }
      <View style={styles.content}>
        {isTest
          ? <TestWords list={wordsList}/>
          : <Button
              onPress={() => setIsStart(true)}
              style={styles.startButton}
              disabled={wordsList.length<configTest.testCounts}
              mode={Mode.Contained}>
              Start test
            </Button>
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10
  },
  title: {
    textAlign: "center",
    marginVertical: 15,
    marginHorizontal: 5
  },
  cartContainer: {
    borderRadius: 4,
    marginHorizontal: 5,
    marginBottom: 10,
  },
  info: {
    marginHorizontal: 20,
    textAlign: "center",
    color: COLORS.pink100
  },
  content: {
    flex: 1,
    marginTop: 20,
    alignItems: "center"
  },
  startButton: {
    width: 200,
  }
});

export default CheckWords;
