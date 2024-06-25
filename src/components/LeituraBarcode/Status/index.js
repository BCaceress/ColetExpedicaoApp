import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Alert,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  SafeAreaView,
} from 'react-native';
//import {router} from 'expo-router';
import {useNavigation} from '@react-navigation/native';
import PagerView from 'react-native-pager-view';
import {Package, Search} from 'react-native-feather';
import api from '../../../services/api.js';
import FabButton from '../FAB/FabButton.js';
//import SecondType from '../ButtonFAB/secondType.tsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
const {width} = Dimensions.get('window');

export default function Status({name}) {
  const user = name;
  const navigation = useNavigation();
  const [barcode, setBarcode] = useState('');
  const [barcodeList, setBarcodeList] = useState([]);
  const [showContainer, setShowContainer] = useState(false);
  const [etiquetas, setEtiquetas] = useState([]);
  const [contador, setContador] = useState(0);
  const [leTodasEtiquetas, setLeitura] = useState(false);

  useEffect(() => {
    // Recupera os valores do AsyncStorage
    const fetchData = async () => {
      try {
        const leTodasEtiquetas = await AsyncStorage.getItem('@MyApp:leTodas');

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

  const pesquisaBarcode = async () => {
    //Valida a leitura da etiqueta
    if (validarFormato(barcode)) {
      try {
        const apiInstance = await api();
        const response = await apiInstance.get(
          `/expedicao/romaneio?etiqueta=${barcode}`,
        );
        if (response.status === 200) {
          await setBarcodeList(response.data);
          setShowContainer(true);
          await setEtiquetas(response.data.romaneio.etiquetas);
          // alterarCodSituacao();
          //console.log(response.data.romaneio.etiquetas);
          setBarcode('');
        } else {
          Alert.alert('Erro', 'Romaneio não existe.', [{text: 'OK'}]);
          setBarcode('');
        }
      } catch (error) {
        console.error('Erro ao obter dados da API:', error);
        setBarcode('');
      }
    } else {
      Alert.alert('Erro', 'Formato de etiqueta inválido.', [{text: 'OK'}]);
      setBarcode('');
    }
  };

  const pesquisaBarcode2 = async () => {
    //Valida a leitura da etiqueta
    if (validarFormato(barcode)) {
      validaRomaneio();
      setBarcode('');
    } else {
      Alert.alert('Erro', 'Formato de etiqueta inválido.', [{text: 'OK'}]);
    }
  };

  const alterarCodSituacao = async () => {
    //Valida qual etiqueta e altera o valor do codSituacao

    etiquetas.forEach(etiqueta => {
      if (etiqueta.programa + '.' + etiqueta.seq === barcode.substring(0, 9)) {
        if (etiqueta.codSituacao === 0 || etiqueta.codSituacao === 1) {
          etiqueta.codSituacao = 9;
          setContador(prevContador => prevContador + 1);
        } else if (etiqueta.codSituacao === 2 || etiqueta.codSituacao === 3) {
          Alert.alert(
            'Verificar',
            'Esta etiqueta já foi lida em outra coleta, ou o pedido já foi faturado.',
            [{text: 'OK'}],
          );
        } else {
          Alert.alert('Verificar', 'Esta etiqueta já foi lida nesta coleta.', [
            {text: 'OK'},
          ]);
        }
      }
    });
  };

  function validarFormato(texto) {
    const regex = /^[0-9.]{7,11}$/;
    return regex.test(texto);
  }

  const validaRomaneio = async () => {
    //Valida se a etiqueta é igual a do romaneio
    if (barcode.substring(0, 7) == barcodeList.romaneio.romaneio) {
      alterarCodSituacao();
    } else {
      Alert.alert(
        'Verificar',
        'Esta etiqueta não faz parte do romaneio que está sendo coletado.',
        [{text: 'OK'}],
      );
    }
    setBarcode('');
  };

  const funcaoConfirmar = () => {
    if (contador >= 1) {
      navigation.navigate('ConfirmacaoBarcode', {
        contador: contador,
        barcodeList: barcodeList,
        user: user,
      });
    } else {
      Alert.alert('Verificar', 'Nenhuma etiqueta foi lida.', [{text: 'OK'}]);
      navigation.navigate('ConfirmacaoBarcode', {
        contador: contador,
        barcodeList: barcodeList,
        user: user,
      });
    }
  };
  const funcaoCancelar = () => {
    setShowContainer(false);
    setBarcodeList('');
    setBarcode('');
    setContador(0);
    setEtiquetas('');
  };
  const lerTodas = () => {
    Alert.alert(
      'Confirmação',
      'Deseja realmente ler todas as etiquetas?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sim',
          onPress: () => {
            {
              lerTodasEtiquetas();
            }
          },
        },
      ],
      {cancelable: true},
    );
  };
  const lerTodasEtiquetas = async () => {
    const updatedEtiquetas = etiquetas.map(etiqueta => {
      if (etiqueta.codSituacao === 0 || etiqueta.codSituacao === 1) {
        etiqueta.codSituacao = 9;
        setContador(prevContador => prevContador + 1);
      }
      return etiqueta;
    });

    // Atualize o estado com as etiquetas modificadas
    setEtiquetas(updatedEtiquetas);
  };

  return (
    <View>
      {!showContainer ? (
        <View style={styles.viewInput}>
          <Search width={20} height={20} stroke="black" />
          <TextInput
            style={styles.textInput}
            placeholderTextColor="#666"
            showSoftInputOnFocus={false}
            autoFocus
            onChangeText={text => setBarcode(text)}
            placeholder="Inserir etiqueta"
            returnKeyType="next"
            onSubmitEditing={pesquisaBarcode}
            value={barcode}
            blurOnSubmit={false}
          />
        </View>
      ) : (
        <View style={styles.viewInput}>
          <Search size={20} color="#000" />
          <TextInput
            style={styles.textInput}
            placeholderTextColor="#666"
            showSoftInputOnFocus={false}
            autoFocus
            onChangeText={text => setBarcode(text)}
            placeholder="Inserir etiqueta"
            returnKeyType="next"
            onSubmitEditing={pesquisaBarcode2}
            value={barcode}
            blurOnSubmit={false}
          />
        </View>
      )}
      {showContainer ? (
        <View style={styles.container}>
          <PagerView style={styles.pagerView} initialPage={0}>
            <View style={styles.pages} key="1">
              <View style={styles.item}>
                <Text style={styles.itemTitle}>Pedido</Text>
                <View style={styles.content}>
                  <Text style={styles.balance}>
                    {barcodeList.romaneio.pedido}/{barcodeList.romaneio.linha}
                  </Text>
                </View>
              </View>
              <View style={styles.item}>
                <Text style={styles.itemTitle}>Romaneio</Text>
                <View style={styles.content}>
                  <Text style={styles.balance}>
                    {barcodeList.romaneio.romaneio}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.pages} key="2">
              <View style={styles.item}>
                <Text style={styles.itemTitle}>Cliente</Text>
                <View style={styles.content}>
                  <Text style={styles.balance}>
                    {barcodeList.romaneio.codCliente} -{' '}
                    {barcodeList.romaneio.nomeCliente}
                  </Text>
                </View>
              </View>
              <View style={styles.item}>
                <Text style={styles.itemTitle}>Variação</Text>
                <View style={styles.content}>
                  <Text style={styles.balance}>
                    {barcodeList.romaneio.variacao}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.pages} key="3">
              <View style={styles.item}>
                <View style={styles.content}>
                  <Text style={styles.balance}>
                    {barcodeList.romaneio.referencia} -{' '}
                    {barcodeList.romaneio.produto}{' '}
                    {barcodeList.romaneio.descricao}
                  </Text>
                </View>
              </View>
            </View>
          </PagerView>
        </View>
      ) : null}
      <View>
        {showContainer ? (
          <View style={styles.container3}>
            <PagerView initialPage={0}>
              <View style={styles.pages2} key="1">
                <View style={styles.tituloPage}>
                  <Text style={styles.tituloLista}>
                    <Package size={16} stroke="black" /> Coleta atual
                  </Text>
                  <Text style={styles.tituloLista}>
                    {'    '} {contador} de {etiquetas.length}
                  </Text>
                </View>

                <FlatList
                  data={barcodeList.romaneio.etiquetas}
                  keyExtractor={item => item.seq}
                  renderItem={({item}) => {
                    if (item.codSituacao === 9) {
                      return (
                        <View style={styles.listItem}>
                          <Text>
                            {item.programa}.{item.seq}
                          </Text>
                          <Text>Tam. {item.tamanho}</Text>
                          <Text>{item.quantidade} PR</Text>
                        </View>
                      );
                    } else {
                      return null;
                    }
                  }}
                />
              </View>
              <View style={styles.pages2} key="2">
                <View style={styles.tituloPage}>
                  <Text style={styles.tituloLista}>
                    {' '}
                    <Package size={20} color="#000" style={styles.icon} />{' '}
                    Coletas a fazer
                  </Text>
                  {leTodasEtiquetas ? (
                    <TouchableOpacity style={styles.button} onPress={lerTodas}>
                      <Text style={styles.buttonText}> Ler todas</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
                <FlatList
                  data={barcodeList.romaneio.etiquetas}
                  keyExtractor={item => item.seq}
                  renderItem={({item}) => {
                    if (item.codSituacao === 0 || item.codSituacao === 1) {
                      return (
                        <View style={styles.listItem}>
                          <Text>
                            {item.programa}.{item.seq}
                          </Text>
                          <Text>Tam. {item.tamanho}</Text>
                          <Text>{item.quantidade} PR</Text>
                        </View>
                      );
                    } else {
                      return null;
                    }
                  }}
                />
              </View>
              <View style={styles.pages2} key="3">
                <Text style={styles.tituloLista}>
                  {' '}
                  <Package size={20} color="#000" style={styles.icon} /> Coletas
                  anteriores
                </Text>

                <FlatList
                  data={barcodeList.romaneio.etiquetas}
                  keyExtractor={item => item.seq}
                  renderItem={({item}) => {
                    if (item.codSituacao === 2 || item.codSituacao === 3) {
                      return (
                        <View style={styles.listItem}>
                          <Text>
                            {item.programa}.{item.seq}
                          </Text>
                          <Text>Tam. {item.tamanho}</Text>
                          <Text>{item.quantidade} PR</Text>
                        </View>
                      );
                    } else {
                      return null;
                    }
                  }}
                />
              </View>
            </PagerView>
          </View>
        ) : null}
      </View>
      {showContainer ? (
        <FabButton
          style={{bottom: -80, right: 50}}
          onCancelPress={funcaoCancelar}
          onConfirmationPress={funcaoConfirmar}
        />
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  //TextInput
  viewInput: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 10,
    marginBottom: 15,
    paddingStart: 12,
    paddingEnd: 18,
    marginStart: 14,
    marginEnd: 14,
    marginTop: -62,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
  },
  textInput: {
    paddingStart: 7,
    height: 40,
  },
  //
  container: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingStart: 18,
    paddingEnd: 18,
    marginTop: -8,
    marginStart: 14,
    marginEnd: 14,
    borderRadius: 6,
    paddingTop: 12,
    paddingBottom: 6,
    zIndex: 99,
  },
  pagerView: {
    flex: 1,
  },
  tituloPage: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingEnd: 5,
  },

  pages: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginTop: -28,
    paddingTop: 25,
  },
  itemTitle: {
    fontSize: 15,
    color: '#A9A9A9',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balance: {
    fontSize: 16,
    color: '#000',
  },

  //LISTA

  pages2: {
    flexDirection: 'column',
    marginTop: -28,
    paddingTop: 25,
  },
  listItem: {
    padding: 5,
    marginTop: 10,
    backgroundColor: '#d9d9d9',
    borderColor: '#000',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000000',
    shadowRadius: 10,
    shadowOpacity: 1,
    marginStart: 14,
    marginEnd: 14,
  },
  tituloLista: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 14,
    marginRight: 14,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#09A08D',
    borderRadius: 8, // Bordas arredondadas
    paddingHorizontal: 12,
    marginEnd: 10,
    marginTop: 10,
    height: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
  },
});
