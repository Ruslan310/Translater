import React from 'react';
import {StyleProp, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
  type?: string;
  style?: StyleProp<ViewStyle>;
}

const HeaderBackButton = ({style, type='arrow-left'}: Props) => {
  const navigation = useNavigation();
  const goBack = () => {
    navigation.goBack();
  };

  return (
    <TouchableOpacity onPress={goBack}>
      <MaterialCommunityIcons
        style={[styles.main, style]}
        size={24}
        name={type}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  main: {
    marginLeft: 20
  }
});

export default HeaderBackButton;
