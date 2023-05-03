import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, Alert} from 'react-native'
import {Card, Paragraph, FAB, Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigationParamList} from '../../navigation/AppNavigator';
import {StackNavigationProp} from '@react-navigation/stack';
import COLORS from '../../colors/colors'
import {useDatabase} from '@nozbe/watermelondb/hooks';
import {WordsModel} from '../../database/models/WordsModel';
import {WordsColumns} from "../../database/columns";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {RectButton} from 'react-native-gesture-handler';
import IconSVG from '../../component/IconSVG/IconSVG'


const Home = () => {
  const database = useDatabase();
  const [wordsList, setWordsList] = useState<WordsModel[]>([]);
  const {navigate} =
    useNavigation<StackNavigationProp<MainStackNavigationParamList>>();


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

  const handleRemoveTransaction = (id: string) => {
    let message = 'Are you sure you want to delete this word?';
    Alert.alert(
      'Delete word',
      message,
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'OK', onPress: () => deleteRow(id)},
      ],
      {cancelable: false},
    );
  };

  const deleteRow = async (id: string) => {
    const fetchedWord = await database
      .get<WordsModel>(WordsModel.table)
      .find(id);

    if (fetchedWord) {
      await database.write(async () => {
        await fetchedWord.markAsDeleted(); // syncable
        await fetchedWord.destroyPermanently(); // permanent delete
      });
    }
  };

  const RightButtons = ({id}: { id: string }) => {
    return (
      <RectButton
        style={styles.deleteButton}
        onPress={() => handleRemoveTransaction(id)}>
        <IconSVG type="trash" size={90}/>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </RectButton>
    );
  };

  let prevOpenedRow: any;
  let row: Array<any> = [];
  let closeRow = (index: any) => {
    if (prevOpenedRow && prevOpenedRow !== row[index]) {
      prevOpenedRow.close();
    }
    prevOpenedRow = row[index];
  };

  return (
    <>
      <View style={styles.container}>
        <Button
          onPress={() => navigate('CheckWords')}
          style={styles.startButton}
          mode='contained'>
          Go to test
        </Button>
        <FlatList
          keyExtractor={item => item.id}
          data={wordsList}
          renderItem={({item, index}) => (
            <Swipeable
              key={item.id}
              ref={ref => (row[index] = ref)}
              onSwipeableWillOpen={() => closeRow(index)}
              friction={2}
              renderRightActions={() => <RightButtons id={item.id}/>}
              overshootRight={false}>
              <Card
                onPress={() => navigate('EditWords', {id: item.id})}
                style={styles.cartContainer}>
                <Card.Content style={styles.card}>
                  <Paragraph>
                    {item.word}
                  </Paragraph>
                  <Paragraph style={styles.cardTranslation}>
                    {item.translation}
                  </Paragraph>
                </Card.Content>
              </Card>
            </Swipeable>
          )}
        />
      </View>
      <FAB
        color={COLORS.black100}
        style={styles.addWord}
        size='small'
        icon="plus"
        onPress={() => navigate('CreateWords')}
      />
    </>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10
  },
  title: {
    marginVertical: 15,
    marginHorizontal: 5
  },
  cartContainer: {
    borderRadius: 4,
    marginHorizontal: 5,
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: COLORS.white100,
  },
  cardTranslation: {
    color: COLORS.grey80,
  },
  addWord: {
    borderRadius: 50,
    position: 'absolute',
    backgroundColor: COLORS.white100,
    margin: 20,
    right: 0,
    top: 0
  },
  deleteButtonText: {
    fontSize: 10,
    color: COLORS.white100,
    fontWeight: '700',
  },
  deleteButton: {
    width: 60,
    borderRadius: 4,
    backgroundColor: COLORS.pink100,
    marginBottom: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButton: {
    width: 120,
    marginVertical: 15,
    marginHorizontal: 5
  }
});

export default Home;
