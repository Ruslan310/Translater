import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from "react-native";
import {WordsModel} from "../../../database/models/WordsModel";
import {ActivityIndicator, Card, Title, Text} from 'react-native-paper';
import COLORS from "../../../colors/colors";
import {useNavigation} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack";
import {MainStackNavigationParamList} from "../../../navigation/AppNavigator";
import {configTest} from "../../../config/testConstant";


const TestWords = ({list}: { list: WordsModel[] }) => {
  const {navigate} =
    useNavigation<StackNavigationProp<MainStackNavigationParamList>>();
  const [currentWord, setCurrentWord] = useState<WordsModel>();
  const [randomIndex, setRandomIndex] = useState<number[]>([]);
  const [randomTranslation, setRandomTranslation] = useState<WordsModel[]>([]);
  const [selectedWord, setSelectedWord] = useState<WordsModel>();
  const [startTest, setStartTest] = useState<number>(0);
  const [rightAnswer, setRightAnswer] = useState<number>(0);

  const rand = () => Math.floor(Math.random() * list.length);
  const randWith = (index: number, count: number) => {
    const indexList = [];
    while (indexList.length < count) {
      const randomIndex = Math.floor(Math.random() * list.length);
      if (randomIndex !== index && indexList.lastIndexOf(randomIndex) === -1) {
        indexList.push(randomIndex);
      }
    }
    return indexList;
  };

  const nextSelect = (item:WordsModel) => {
    setSelectedWord(item)
    item.id === currentWord?.id && setRightAnswer(rightAnswer+1)
    setTimeout(() => {
      if(startTest===configTest.testCounts-1) {
        navigate('CheckResult', {count: rightAnswer})
        return
      }
      let index = randomIndex[startTest]
      setStartTest(startTest+1)
      setCurrentWord(undefined)
      setSelectedWord(undefined)

      setCurrentWord(list[index])
      getRandomWords(index)
    }, 1000)
  }

  const getRandomWords = (index: number) => {
    if(list && !list.length) return;
    let randomWords = []
    let indexList = randWith(index, configTest.countWrongWords)
    for(let i=0; i<configTest.countWrongWords; i++) {
      let num = indexList[i]
      randomWords.push(list[num])
    }
    randomWords.push(list[index])
    randomWords.sort(() => Math.random() - 0.5);
    setRandomTranslation(randomWords)
  }

  useEffect(() => {
    let index = rand()
    let randomIndex = randWith(index, configTest.testCounts-1)
    setCurrentWord(list[index])
    setRandomIndex(randomIndex)
    getRandomWords(index)
  }, [])

  return (
    <View style={styles.container}>
      <ActivityIndicator
        size='large'
        animating={!currentWord}
        style={styles.loader}
      />
      <Card>
        <Card.Content style={styles.currentCart}>
          <Title style={styles.currentWord}>
            {currentWord && currentWord.word}
          </Title>
        </Card.Content>
      </Card>

      <View style={styles.selectContent}>
        <FlatList
          keyExtractor={item => item.id}
          data={randomTranslation}
          renderItem={({item}) => (
            <Card
              onPress={() => !selectedWord && nextSelect(item)}
              style={styles.cartContainer}>
              <Card.Content style={[
                styles.card,
                item.id === selectedWord?.id && currentWord?.id === selectedWord?.id && styles.rightChoice,
                item.id === selectedWord?.id && currentWord?.id !== selectedWord?.id && styles.wrongChoice,
              ]}>
                <Text style={styles.cardItem}>
                  {item.translation}
                </Text>
              </Card.Content>
            </Card>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10
  },
  loader: {
    top: '40%'
  },
  currentWord: {
    fontSize: 20,
    textAlign: "center",
    textDecorationLine: "underline",
    fontWeight: '700',
    color: COLORS.white100
  },
  selectContent: {
    marginTop: 30
  },
  cartContainer: {
    borderRadius: 4,
    marginHorizontal: 5,
    marginBottom: 12,
  },
  card: {
    paddingVertical: 10,
    borderRadius: 4,
    backgroundColor: COLORS.white100,
  },
  rightChoice: {
    backgroundColor: COLORS.guidance,
  },
  wrongChoice: {
    backgroundColor: COLORS.pink100,
  },
  currentCart: {
    paddingVertical: 12,
    borderRadius: 4,
    backgroundColor: COLORS.blueNavy70,
  },
  cardItem: {
    fontSize: 18,
    textAlign: "center"
  }
});

export default TestWords;
