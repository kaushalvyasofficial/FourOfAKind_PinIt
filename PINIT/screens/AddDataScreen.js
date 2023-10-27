import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { SelectList } from 'react-native-dropdown-select-list'
import { FontAwesome } from '@expo/vector-icons';
import { useBackHandler } from '@react-native-community/hooks'
const AddDataScreen = ({ navigation }) => {
  const [selected, setSelected] = useState("");
  

  useBackHandler(() => {
    navigation.navigate("Explore");
  });


  const data = [
    { key: '1', value: 'Option1' },
    { key: '2', value: 'Option2' },
    { key: '3', value: 'Option3 ' },
    { key: '4', value: 'Option4' },
  ];

  console.log(selectedDate);

  return (
    <View style={styles.logo}>
      

      <SelectList
        setSelected={val => setSelected(val)}
        data={data}
        save="value"
      />
      <SelectList
        setSelected={val => setSelected(val)}
        data={data}
        save="value"
      />
      <SelectList
        setSelected={val => setSelected(val)}
        data={data}
        save="value"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AddDataScreen;
