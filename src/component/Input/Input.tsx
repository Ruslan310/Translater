import React from 'react';
import {TextInput} from 'react-native-paper';
import {StyleSheet} from 'react-native';
import {Mode} from '../../model/modelText';
import COLORS from "../../colors/colors";

type Props = {
  label: string;
  value: string;
  change: (value: string) => void;
  style?: any;
  keyboardType?: KeyboardTypeOptions | undefined;
  typeText?: string;
  mode?: Mode;
};

type KeyboardTypeOptions =
  | 'default'
  | 'email-address'
  | 'numeric'
  | 'phone-pad';

const Input = ({
                 label,
                 value,
                 change,
                 style,
                 keyboardType,
                 mode = Mode.Outlined,
               }: Props) => (
  <TextInput
    label={label}
    value={value}
    onChangeText={e => change(e)}
    style={[style, styles.input]}
    keyboardType={keyboardType}
    mode={mode}
  />
);

const styles = StyleSheet.create({
  input: {
    backgroundColor: COLORS.white100,
  },
});

export default Input;
