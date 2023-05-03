import React, {useState} from 'react';
import {StyleSheet, View, Alert} from "react-native";
import Input from '../../component/Input/Input'
import {useDatabase} from '@nozbe/watermelondb/hooks';
import SaveBottomComponent from '../../component/SaveBottomComponent/SaveBottomComponent'
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StackScreenProps} from '@react-navigation/stack';
import {MainStackNavigationParamList} from '../../navigation/AppNavigator';
import {WordsModel} from "../../database/models/WordsModel";

type Props = StackScreenProps<MainStackNavigationParamList, 'CreateWords'>;

const CreateWords = ({navigation: {goBack}}: Props) => {

  const {bottom} = useSafeAreaInsets();
  const database = useDatabase();
  const [word, setWord] = useState('');
  const [translation, setTranslation] = useState('');

  const isDisabledSave = word === '' || translation === ''
  const validateFields = () => {
    return !(word === '' || translation === '');
  };

  const createNewWord = async () => {
    if (validateFields()) {
      const newWord = {
        word,
        translation
      };

      await database.write(async () => {
        await database.get(WordsModel.table).create(word => {
          Object.assign(word, newWord);
        });
      });
      goBack();
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
        presSave={createNewWord}
        pressCancel={() => goBack()}
        isDisabledSubmit={isDisabledSave}
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

export default CreateWords;
