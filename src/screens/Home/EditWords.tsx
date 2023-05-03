import React, {useEffect, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {View, StyleSheet} from "react-native";
import Input from "../../component/Input/Input";
import SaveBottomComponent from "../../component/SaveBottomComponent/SaveBottomComponent";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useDatabase} from "@nozbe/watermelondb/hooks";
import {WordsModel} from "../../database/models/WordsModel";
import {StackScreenProps} from "@react-navigation/stack";
import {MainStackNavigationParamList} from "../../navigation/AppNavigator";

type Props = StackScreenProps<MainStackNavigationParamList, 'EditWords'>;

const EditWords = ({navigation: {goBack}}: Props) => {

  const route = useRoute();
  const {id} = route.params as {id: string};
  const {bottom} = useSafeAreaInsets();
  const database = useDatabase();
  const [currentWord, setCurrentWord] = useState<WordsModel | null>(null);
  const [word, setWord] = useState('');
  const [translation, setTranslation] = useState('');

  const isDisabledSave =
    word !== currentWord?.word ||
    translation !== currentWord?.translation

  useEffect(() => {
    const fetchData = async () => {
      const fetchedWord = await database
        .get<WordsModel>(WordsModel.table)
        .find(id);
      setCurrentWord(fetchedWord);
      setWord(fetchedWord.word);
      setTranslation(fetchedWord.translation);
    };
    fetchData();
  }, [database, id]);

  const EditNewWord = async () => {
    if (currentWord) {
      await database.write(async () => {
        await currentWord.update(el => {
          el.word = word;
          el.translation = translation;
        });
      });
      setCurrentWord(null);
      goBack();
    }
  };

  if (!currentWord) {
    return null;
  }

  return (
    <View style={styles.container}>

      <View style={styles.content}>
        <Input
          label='Word'
          value={word}
          change={setWord}
          style={styles.content}
        />
        <Input
          label='Translation'
          value={translation}
          change={setTranslation}
          style={styles.content}
        />

      </View>
      <SaveBottomComponent
        style={{paddingBottom: bottom + 10}}
        presSave={EditNewWord}
        pressCancel={() => goBack()}
        isDisabledSubmit={!isDisabledSave}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between"
  },
  content: {
    margin: 10
  },
  input: {
    marginVertical: 20
  }
});

export default EditWords;
