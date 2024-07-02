import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
//import {router} from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import api from '../../services/api.js';
const Login = ({ navigation }) => {
  const [estaConectado, setEstaConectado] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  const fetchData = async () => {
    const apiInstance = await api();
    try {
      // Primeira chamada de API
      await apiInstance.get('/parametros?chave=EMPRESA');
      setEstaConectado(true);
    } catch (error) {
      // console.error("Erro ao obter dados da API:", error);
      setEstaConectado(false);
    }
  };

  const navegarProximaPagina = async () => {
    if (estaConectado) {
      // Se a conexão com a API for bem-sucedida, navegue para a próxima página.

      navigation.replace('ListaUsuarios');
    } else {
      // Se a conexão com a API falhar, mostre um alerta.
      Alert.alert('Erro', 'Não foi possível conectar com a API.');

      fetchData();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerLogo}>
        <Image
          source={require('../../assets/logo_verde.png')}
          style={styles.img}
        />
      </View>
      <View style={styles.containerCentro}>
        <Text style={styles.txtTitulo}>
          Boas vindas ao app
          <Text style={styles.txtTituloColet}> Expedição</Text>
        </Text>
        <Text style={styles.txtsubTitulo}>
          Clique no botão abaixo para acessar.
        </Text>
        <TouchableOpacity
          style={styles.btnEntrar}
          onPress={navegarProximaPagina}>
          <Text style={styles.btnEntrarTxt}> Entrar </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.containerInferior}>
        <Text style={styles.versao}>Versão 1.24.0207</Text>
        <TouchableOpacity
          style={styles.btnConfig}
          onPress={() => {
            navigation.navigate('Configuracao');
          }}>
          <Text style={styles.btnConfigTxt}> Configurações </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerLogo: {
    flex: 1,
    justifyContent: 'center',
    marginTop: '16%',
  },
  button: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
  },
  buttonText: {
    fontSize: 20,
    alignSelf: 'center',
  },
  img: {
    width: 290,
    height: 290,
  },
  containerCentro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
  },
  txtTitulo: {
    color: '#000',
    fontSize: 19,
    fontWeight: 'bold',
  },
  txtTituloColet: {
    color: '#09A08D',
    fontSize: 20,
    fontWeight: 'bold',
  },
  txtsubTitulo: {
    color: '#4C5958',
    fontSize: 13,
    marginTop: 6,
  },
  versao: {
    color: '#4C5958',
    fontSize: 13,
    marginBottom: 6,
  },
  btnEntrar: {
    width: '90%',
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#09A08D',
    borderRadius: 6,
    marginTop: 28,
  },
  btnEntrarTxt: {
    color: '#fff',
    fontSize: 19,
    fontWeight: 'bold',
  },
  containerInferior: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  btnConfig: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#999',
  },
  btnConfigTxt: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default Login;
