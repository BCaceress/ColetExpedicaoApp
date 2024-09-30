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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../../services/api';

const Configuracao = () => {
  const [connection, setConnection] = useState('');
  const [leitura, setLeitura] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
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
      await AsyncStorage.setItem('@MyApp:connection', connection);
      await AsyncStorage.setItem('@MyApp:leTodas', JSON.stringify(leitura));
      Alert.alert('Sucesso', 'Configurações salvas com sucesso!', [{ text: 'OK' }]);
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao salvar as configurações.', [{ text: 'OK' }]);
    }
  };

  const testarConexao = async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        AsyncStorage.setItem('@MyApp:connection', connection),
        AsyncStorage.setItem('@MyApp:leTodas', JSON.stringify(leitura)),
      ]);
      const apiInstance = await api();
      const response = await apiInstance.get('/parametros?chave=EMPRESA');
      if (response.status === 200) {
        if (response.data && response.data.valor) {
          Alert.alert('Sucesso', 'Conexão com API realizada!', [{ text: 'OK' }]);
        } else {
          Alert.alert('Erro', 'Dados inválidos na resposta da API.', [{ text: 'OK' }]);
        }
      } else {
        Alert.alert('Erro', 'Favor verificar a conexão API.', [{ text: 'OK' }]);
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro na chamada da API.', [{ text: 'OK' }]);
    } finally {
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
          trackColor={{ false: '#767577', true: '#4CD964' }}
          thumbColor={leitura ? '#FFFFFF' : '#f4f3f4'}
          onValueChange={fnLerTodas}
          value={leitura}
        />
      </View>
      <Text style={styles.label}>Conexão API:</Text>
      <TextInput
        style={styles.inputConexao}
        placeholder="Digite a conexão"
        placeholderTextColor="#999"
        value={connection}
        onChangeText={text => setConnection(text)}
      />

      <View style={styles.viewButton}>
        <TouchableOpacity style={styles.buttonTestar} onPress={testarConexao}>
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <MaterialCommunityIcons name="wifi-strength-outline" size={24} color="white" />
          )}
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
    padding: 20,
    backgroundColor: '#F3F4F6',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
  },
  viewPrincipal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  inputConexao: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    marginBottom: 20,
    color: '#333',
  },
  viewButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonTestar: {
    backgroundColor: '#09A08D',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    width: '25%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonSalvar: {
    backgroundColor: '#09A08D',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    width: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  textSalvar: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Configuracao;
