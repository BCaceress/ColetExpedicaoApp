import { useRoute } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import Header from '../../components/Header';
import Status from '../../components/Status';

export default function LeituraBarcode() {
  const route = useRoute();
  const { id } = route.params;

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
