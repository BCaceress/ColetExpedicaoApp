import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Radio } from 'react-native-feather';
import api from '../../services/api';

const Configuracao = () => {
  const [connection, setConnection] = useState('');
  const [leitura, setLeitura] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Recupera os valores do AsyncStorage
    const fetchData = async () => {
      try {
        const savedConnection = await AsyncStorage.getItem('@MyApp:connection');
        const leTodasEtiquetas = await AsyncStorage.getItem('@MyApp:leTodas');
        setConnection(savedConnection || '');
        if (leTodasEtiquetas !== null) {
          const parsedLeitura = JSON.parse(leTodasEtiquetas);
          setLeitura(parsedLeitura);
        }
      } catch (error) {
        console.error('Erro ao recuperar os dados:', error);
      }
    };

    fetchData();
  }, []);

  const fnSalvar = async () => {
    try {
      // Salva os dados no AsyncStorage
      await AsyncStorage.setItem('@MyApp:connection', connection);
      await AsyncStorage.setItem('@MyApp:leTodas', JSON.stringify(leitura));
      Alert.alert('Sucesso', 'Configurações salvas com sucesso!', [
        { text: 'OK' },
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao salvar as configurações.', [
        { text: 'OK' },
      ]);
    }
  };

  const testarConexao = async () => {
    try {
      setIsLoading(true);
      // Salva os valores no AsyncStorage
      await Promise.all([
        AsyncStorage.setItem('@MyApp:connection', connection),
        AsyncStorage.setItem('@MyApp:leTodas', JSON.stringify(leitura)),
      ]);
      // Faz a chamada à API
      const apiInstance = await api();
      const response = await apiInstance.get('/parametros?chave=EMPRESA');
      if (response.status === 200) {
        if (response.data && response.data.valor) {
          Alert.alert('Sucesso', 'Conexão com API realizada!', [{ text: 'OK' }]);
          setIsLoading(false);
        } else {
          Alert.alert('Erro', 'Dados inválidos na resposta da API.', [{ text: 'OK' }]);
          setIsLoading(false);
        }
      } else {
        Alert.alert('Erro', 'Favor verificar a conexão API.', [{ text: 'OK' }]);
        setIsLoading(false);
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro na chamada da API.', [{ text: 'OK' }]);
      setIsLoading(false);
    }
  };

  const fnLerTodas = () => {
    setLeitura(previousState => !previousState);
  };

  return (
    <View style={styles.container}>
      <View style={styles.viewPrincipal}>
        <Text style={styles.label}>Ler todas etiquetas:</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#49BC99' }}
          thumbColor={leitura ? '#09A08D' : '#f4f3f4'}
          onValueChange={fnLerTodas}
          value={leitura}
        />
      </View>
      <Text style={styles.label}>Conexão API:</Text>
      <TextInput
        style={styles.inputConexao}
        placeholder="Digite a conexão"
        value={connection}
        onChangeText={text => setConnection(text)}
      />

      <View style={styles.viewButton}>
        <TouchableOpacity style={styles.buttonTestar} onPress={testarConexao}>
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (<Radio size={32} color="white" />)}
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSalvar} onPress={fnSalvar}>
          <Text style={styles.textSalvar}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  viewPrincipal: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputConexao: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 10,
    marginBottom: 17,
  },
  viewButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonTestar: {
    backgroundColor: '#09A08D',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 15,
    width: '25%',
  },
  buttonSalvar: {
    backgroundColor: '#09A08D',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 15,
    width: '70%',
  },
  textSalvar: {
    color: 'white',
    fontSize: 19,
    alignSelf: 'center',
    fontWeight: 'bold',
  },
});
export default Configuracao;
