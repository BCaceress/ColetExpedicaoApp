import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import api from '../../services/api';

const statusBarHeight = StatusBar.currentHeight ? StatusBar.currentHeight + 2 : 64;

const ListaUsuarios = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [empresa, setEmpresa] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    const apiInstance = await api();
    try {
      const empresaResponse = await apiInstance.get('/parametros?chave=EMPRESA');
      const usersResponse = await apiInstance.get('/expedicao/usuarios');
      setEmpresa(empresaResponse.data);
      setUsers(usersResponse.data);
    } catch (error) {
      console.error('Erro ao obter dados da API:', error);
      setError('Erro ao carregar dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.cartao}
      onPress={() => navigation.replace('LeituraBarcode', { id: item.USRID })}
    >
      <View style={styles.informacoes}>
        <Text style={styles.nome}>{item.NOME}</Text>
      </View>
    </TouchableOpacity>
  ), [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topo}>
        <Text style={styles.boasVindas}>Olá, {empresa.valor}</Text>
        <Text style={styles.legenda}>Selecione na lista abaixo o usuário</Text>
      </View>
      <Text style={styles.titulo}>Usuários</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#09A08D" style={styles.loader} />
      ) : error ? (
        <View style={styles.emptyContainer}>
          <Text>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={item => item.USRID.toString()}
          renderItem={renderItem}
          initialNumToRender={10}
          windowSize={5}
          contentContainerStyle={users.length === 0 && styles.emptyContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  topo: {
    backgroundColor: '#09A08D',
    paddingTop: statusBarHeight,
    paddingStart: 16,
    paddingBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  titulo: {
    fontSize: 22,
    lineHeight: 32,
    marginHorizontal: 16,
    marginTop: 16,
    fontWeight: 'bold',
    color: '#464646',
  },
  boasVindas: {
    marginTop: 10,
    fontSize: 28,
    lineHeight: 42,
    fontWeight: 'bold',
    color: '#fff',
  },
  legenda: {
    fontSize: 16,
    lineHeight: 24,
    color: '#fff',
  },
  cartao: {
    backgroundColor: '#FFFFFF',
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  emptyContainer: {
    marginHorizontal: 16,
    fontSize: 26,
    fontWeight: 'bold',
    color: '#999',
    textAlign: 'center',
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  informacoes: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  nome: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: '#333',
  },
  loader: {
    marginTop: 20,
  },
});

export default ListaUsuarios;
