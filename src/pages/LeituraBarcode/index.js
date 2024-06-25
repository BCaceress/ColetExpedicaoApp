import React from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';
import {useRoute} from '@react-navigation/native';
import Header from '../../components/LeituraBarcode/Header';
import Status from '../../components/LeituraBarcode/Status';

export default function LeituraBarcode() {
  const route = useRoute();
  const {id} = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <Header name={id} />
      <Status name={id} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
});
