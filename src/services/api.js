import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = async () => {
  try {
    // Obtenha a URL base do async storage (substitua pela sua lógica real)
    const baseURL = await AsyncStorage.getItem('@MyApp:connection');

    // Crie a instância do Axios com a URL base dinâmica
    const instance = axios.create({
      baseURL,
    });

    return instance;
  } catch (error) {
    console.error('Erro ao obter a URL base:', error);
    return null;
  }
};

export default api;
