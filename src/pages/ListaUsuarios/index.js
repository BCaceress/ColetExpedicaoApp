import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import api from '../../services/api';

const statusBarHeight = StatusBar.currentHeight
  ? StatusBar.currentHeight + 2
  : 64;

const ListaUsuarios = ({navigation}) => {
  const [users, setUsers] = useState([]);
  const [empresa, setEmpresa] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const apiInstance = await api();
      try {
        // Primeira chamada de API
        const empresaResponse = await apiInstance.get(
          '/parametros?chave=EMPRESA',
        );
        setEmpresa(empresaResponse.data);

        // Segunda chamada de API
        const usersResponse = await apiInstance.get('/expedicao/usuarios');
        setUsers(usersResponse.data);
      } catch (error) {
        console.error('Erro ao obter dados da API:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView>
      <View style={styles.topo}>
        <Text style={styles.boasVindas}>Olá {empresa.valor}</Text>
        <Text style={styles.legenda}>Selecione na lista abaixo o usuário</Text>
      </View>
      <Text style={styles.titulo}>Usuários</Text>
      <FlatList
        data={users}
        keyExtractor={item => item.USRID}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.cartao}
            onPress={() => {
              // router.replace(`/leitura/${item.USRID}`);
              //router.push("../confirmacao");
              navigation.navigate('LeituraBarcode', {id: item.USRID});
            }}>
            <View style={styles.informacoes}>
              <Text style={styles.distancia}>{item.NOME}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  topo: {
    backgroundColor: '#09A08D',
    paddingTop: statusBarHeight,
    paddingStart: 14,
    paddingBottom: 15,
  },
  titulo: {
    fontSize: 19,
    lineHeight: 32,
    marginHorizontal: 16,
    marginTop: 11,
    fontWeight: 'bold',
    color: '#464646',
  },
  boasVindas: {
    marginTop: 24,
    fontSize: 26,
    lineHeight: 42,
    fontWeight: 'bold',
    color: '#fff',
  },
  legenda: {
    fontSize: 16,
    lineHeight: 26,
    color: '#fff',
  },
  cartao: {
    backgroundColor: '#F6F6F6',
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 6,
    flexDirection: 'row',
    elevation: 4,
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  imagem: {
    width: 48,
    height: 48,
    borderRadius: 6,
    marginVertical: 16,
    marginLeft: 16,
  },
  informacoes: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 8,
    marginVertical: 16,
    marginRight: 16,
  },
  nome: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: 'bold',
  },
});
export default ListaUsuarios;
