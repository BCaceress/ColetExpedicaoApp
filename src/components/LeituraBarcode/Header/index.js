import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {LogOut} from 'react-native-feather';
import {useNavigation} from '@react-navigation/native';

const statusBarHeight = StatusBar.currentHeight
  ? StatusBar.currentHeight + 0
  : 64;

export default function Header({name}) {
  const navigation = useNavigation();
  const handleExit = () => {
    Alert.alert(
      'Confirmação',
      'Deseja realmente sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          onPress: () => {
            // Navegue para a tela anterior
            //  navigation.goBack();
            navigation.replace('ListaUsuarios');
          },
        },
      ],
      {cancelable: true},
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.buttonUser}
          onPress={handleExit}>
          <LogOut size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.username}>
          Olá, <Text style={styles.boldText}>{name}</Text>!{' '}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#09A08D',
    paddingTop: statusBarHeight,
    flexDirection: 'row',
    paddingStart: 16,
    paddingEnd: 16,
    paddingBottom: 72,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  username: {
    fontSize: 18,
    color: '#Fff',
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  buttonUser: {
    width: 35,
    height: 35,
    backgroundColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35 / 2,
  },
});
