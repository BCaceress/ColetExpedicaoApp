import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import {
  CheckCircle,
  FileText,
  Package,
  Search,
  XCircle,
} from 'react-native-feather';
import { FloatingAction } from 'react-native-floating-action';
import PagerView from 'react-native-pager-view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../../services/api.js';

export default function Status({ name }) {
  const user = name;
  const navigation = useNavigation();
  const [barcode, setBarcode] = useState('');
  const [barcodeList, setBarcodeList] = useState([]);
  const [showContainer, setShowContainer] = useState(false);
  const [etiquetas, setEtiquetas] = useState([]);
  const [contador, setContador] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [leTodasEtiquetas, setLeitura] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const refPagerView = useRef(null);
  const [modalType, setModalType] = useState(null);

  const moveToPage = (index) => {
    requestAnimationFrame(() => refPagerView.current?.setPage(index));
  };

  useEffect(() => {
    // Recupera os valores do AsyncStorage
    const fetchData = async () => {
      try {
        const lerTodas = await AsyncStorage.getItem('@MyApp:leTodas');
        if (lerTodas !== null) {
          const parsedLeitura = JSON.parse(lerTodas);
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
          setBarcodeList(response.data);
          setShowContainer(true);
          await setEtiquetas(response.data.romaneio.etiquetas);
          // alterarCodSituacao();
          const todosValoresValidos = response.data.romaneio.etiquetas.every((etiqueta) => {
            const valor = etiqueta.codSituacao;
            return valor === 3;
          });
          if (todosValoresValidos) {
            Alert.alert(`Romaneio: ${JSON.stringify(response.data.romaneio.romaneio)}`, 'Não há etiquetas a coletar para este romaneio.', [{ text: 'OK' }]);
          }
          setBarcode('');
        } else {
          Alert.alert('Erro', 'Romaneio não existe.', [{ text: 'OK' }]);
          setBarcode('');
        }
      } catch (error) {
        console.error('Erro ao obter dados da API:', error);
        setBarcode('');
      }
    } else {
      Alert.alert('Erro', 'Formato de etiqueta inválido.', [{ text: 'OK' }]);
      setBarcode('');
    }
  };

  const abrirModal = (type) => {
    setModalType(type);
    setModalVisible(true);
  };

  const pesquisarNoModal = () => {
    if (validarFormato(barcode)) {
      pesquisaBarcode();
      setModalVisible(false);
    } else {
      Alert.alert('Erro', 'Formato de etiqueta inválido.', [{ text: 'OK' }]);
    }
  };

  const pesquisarNoModal2 = () => {
    if (validarFormato(barcode)) {
      pesquisaBarcode2();
      setModalVisible(false);
    } else {
      Alert.alert('Erro', 'Formato de etiqueta inválido.', [{ text: 'OK' }]);
    }
  };

  const pesquisaBarcode2 = async () => {
    //Valida a leitura da etiqueta
    if (validarFormato(barcode)) {
      validaRomaneio();
      setBarcode('');
    } else {
      Alert.alert('Erro', 'Formato de etiqueta inválido.', [{ text: 'OK' }]);
    }
  };

  const etiquetasMap = {};
  etiquetas.forEach(etiqueta => {
    etiquetasMap[etiqueta.programa + '.' + etiqueta.seq] = etiqueta;
  });

  const alterarCodSituacao = async () => {
    const secondDotIndex = barcode.lastIndexOf(".");
    const result = barcode.substring(0, secondDotIndex);
    if (etiquetasMap[result]) {
      const etiqueta = etiquetasMap[result];
      if (etiqueta.codSituacao === 0 || etiqueta.codSituacao === 1 || etiqueta.codSituacao === 2) {
        etiqueta.codSituacao = 9;
        setContador(prevContador => prevContador + 1);
      } else if (etiqueta.codSituacao === 3) {
        Alert.alert(
          'Verificar',
          'Esta etiqueta já foi lida em outra coleta, ou o pedido já foi faturado.',
          [{ text: 'OK' }],
        );
      } else {
        Alert.alert('Verificar', 'Esta etiqueta já foi lida nesta coleta.', [
          { text: 'OK' },
        ]);
      }
    }
  };

  function validarFormato(texto) {
    const regex = /^[0-9.]{4,14}$/;
    return regex.test(texto);
  }

  const validaRomaneio = async () => {
    //Valida se a etiqueta é igual a do romaneio
    const firstDotIndex = barcode.indexOf(".");
    const result = barcode.substring(0, firstDotIndex);
    if (result == barcodeList.romaneio.romaneio) {
      alterarCodSituacao();
    } else {
      Alert.alert(
        'Verificar',
        'Esta etiqueta não faz parte do romaneio que está sendo coletado.',
        [{ text: 'OK' }],
      );
    }
    setBarcode('');
  };

  function funcaoConfirmar() {
    if (contador >= 1) {
      navigation.navigate('ConfirmacaoBarcode', {
        contador: contador,
        barcodeList: barcodeList,
        user: user,
      });
    } else {
      Alert.alert('Verificar', 'Nenhuma etiqueta foi lida.', [{ text: 'OK' }]);
    }
  }
  function funcaoCancelar() {
    setShowContainer(false);
    setBarcodeList('');
    setBarcode('');
    setContador(0);
    setIsLoading(false);
    moveToPage(0);
    setEtiquetas([]);
  }
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
          onPress: lerTodasEtiquetas,
        },
      ],
      { cancelable: true },
    );
  };
  const lerTodasEtiquetas = async () => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 100));
      const updatedEtiquetas = etiquetas.map(etiqueta => {
        if (etiqueta.codSituacao === 0 || etiqueta.codSituacao === 1) {
          etiqueta.codSituacao = 9;
          setContador(prevContador => prevContador + 1);
        }
        return etiqueta;
      });
      setEtiquetas(updatedEtiquetas);
      setIsLoading(false);
      moveToPage(0);

    } catch (error) {
      console.error('Erro:', error);
      setIsLoading(false);
    }
  };

  const actions = [
    {
      text: 'Ler Todas Etiquetas',
      icon: <CheckCircle width={25} height={25} stroke="white" />,
      name: 'bt_leTodas',
      color: '#0000FF',
      position: 1,
    },
    {
      text: 'Cancelar Processo',
      icon: <XCircle width={25} height={25} stroke="white" />,
      name: 'bt_cancel',
      color: '#FF0000',
      position: 2,
    },

    {
      text: 'Gerar Fichas de Expedição',
      icon: <FileText width={25} height={25} stroke="white" />,
      name: 'bt_confirmation',
      color: '#008000',
      position: 3,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View>
        {!showContainer ? (
          <View style={styles.containerViewInput}>
            <View style={styles.viewInput}>
              <Search size={10} stroke="black" />
              <TextInput
                style={styles.textInput}
                placeholderTextColor="#666"
                showSoftInputOnFocus={false}
                autoFocus={true}
                onChangeText={text => setBarcode(text)}
                placeholder="Inserir etiqueta"
                returnKeyType="next"
                onSubmitEditing={pesquisaBarcode}
                value={barcode}
                blurOnSubmit={false}
              />

            </View>
            <TouchableOpacity style={styles.buttonTeclado} onPress={() => abrirModal('default')}>
              <Icon name="keyboard" size={28} color="#000" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.containerViewInput}>
            <View style={styles.viewInput}>
              <Search size={10} color="#000" />
              <TextInput
                style={styles.textInput}
                placeholderTextColor="#666"
                showSoftInputOnFocus={false}
                autoFocus={true}
                onChangeText={text => setBarcode(text)}
                placeholder="Inserir etiqueta"
                returnKeyType="next"
                onSubmitEditing={pesquisaBarcode2}
                value={barcode}
                blurOnSubmit={false}
              />
            </View>
            <TouchableOpacity style={styles.buttonTeclado} onPress={() => abrirModal('alternative')}>
              <Icon name="keyboard" size={28} color="#000" />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setBarcode('');
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Inserir Etiqueta</Text>
              <TouchableOpacity onPress={() => {
                setModalVisible(false);
                setBarcode('');
              }}>
                <Icon name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.textInputModal}
              placeholder="Digite manualmente a etiqueta"
              keyboardType="numeric"
              autoFocus={true}
              onChangeText={text => {
                const regex = /^[0-9.]*$/;
                if (regex.test(text)) {
                  setBarcode(text);
                }
              }}
              value={barcode}
            />
            <TouchableOpacity style={styles.searchButton} onPress={modalType === 'default' ? pesquisarNoModal : pesquisarNoModal2}>
              <Text style={styles.buttonText}>Pesquisar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
      {showContainer ? (
        <PagerView style={styles.pager} initialPage={0} ref={refPagerView}>
          <View style={styles.pages2} key="1">
            <View style={styles.tituloPage}>
              <Text style={styles.tituloLista}>
                <Package width={22} height={22} stroke="black" /> Coleta atual
              </Text>
              <Text style={styles.tituloLista}>
                {'    '} {contador} de {etiquetas.length}
              </Text>
            </View>
            {isLoading ? (
              <ActivityIndicator size="large" color="#09A08D" />
            ) : (
              <FlatList
                data={barcodeList.romaneio.etiquetas.filter(item => item.codSituacao === 9)}
                keyExtractor={item => item.seq}
                renderItem={({ item }) => (
                  <View style={styles.listItem}>
                    <Text style={styles.textoLista}>
                      {item.programa}.{item.seq}
                    </Text>
                    <Text style={styles.textoLista}>Tam. {item.tamanho}</Text>
                    <Text style={styles.textoLista}>{item.quantidade} PR</Text>
                  </View>
                )}
              />
            )}
          </View>
          <View style={styles.pages2} key="2">
            <View style={styles.tituloPage}>
              <Text style={styles.tituloLista}>
                {' '}
                <Package
                  width={22}
                  height={22}
                  color="#000"
                  style={styles.icon}
                />{' '}
                Coletas a fazer
              </Text>
              {leTodasEtiquetas ? (
                <TouchableOpacity style={styles.button} onPress={lerTodas}>
                  <Text style={styles.buttonText}> Ler todas</Text>
                </TouchableOpacity>
              ) : null}
            </View>
            {isLoading ? (
              <ActivityIndicator size="large" color="#09A08D" />
            ) : (
              <FlatList
                data={barcodeList.romaneio.etiquetas.filter(item => item.codSituacao === 0 || item.codSituacao === 1 || item.codSituacao === 2)}
                keyExtractor={item => item.seq}
                renderItem={({ item }) => (
                  <View style={styles.listItem}>
                    <Text style={styles.textoLista}>
                      {item.programa}.{item.seq}
                    </Text>
                    <Text style={styles.textoLista}>Tam. {item.tamanho}</Text>
                    <Text style={styles.textoLista}>{item.quantidade} PR</Text>
                  </View>
                )}
              />
            )}
          </View>
          <View style={styles.pages2} key="3">
            <Text style={styles.tituloLista}>
              {' '}
              <Package
                width={22}
                height={22}
                color="#000"
                style={styles.icon}
              />{' '}
              Coletas anteriores
            </Text>
            <FlatList
              data={barcodeList.romaneio.etiquetas.filter(item => item.codSituacao === 3)}
              keyExtractor={item => item.seq}
              renderItem={({ item }) => (
                <View style={styles.listItem}>
                  <Text style={styles.textoLista}>
                    {item.programa}.{item.seq}
                  </Text>
                  <Text style={styles.textoLista} >Tam. {item.tamanho}</Text>
                  <Text style={styles.textoLista}>{item.quantidade} PR</Text>
                </View>
              )}
            />
          </View>
        </PagerView>
      ) : null
      }
      {
        showContainer ? (
          <FloatingAction
            actions={actions.filter(action => {
              if (action.name === 'bt_leTodas') {
                return leTodasEtiquetas;
              }
              return true;
            })}
            color="#09A08D"
            onPressItem={item => {
              switch (item) {
                case 'bt_leTodas':
                  lerTodas();
                  break;
                case 'bt_cancel':
                  funcaoCancelar();
                  break;
                case 'bt_confirmation':
                  funcaoConfirmar();
                  break;
                default:
              }
            }}
          />
        ) : null
      }
    </SafeAreaView >
  );
}
const styles = StyleSheet.create({
  safeArea: { flex: 1, width: '100%' },
  // TextInput
  containerViewInput: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -67,
    marginLeft: 14,
    marginEnd: 14,
  },
  viewInput: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    flex: 1,
    marginEnd: 10,
  },
  buttonTeclado: {
    backgroundColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#000',
    elevation: 2,
  },
  textInput: {
    paddingStart: 7,
    height: 40,
    flex: 1,
    color: '#000'
  },

  container: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingStart: 12,
    paddingEnd: 12,
    marginTop: -20,
    marginStart: 14,
    marginEnd: 14,
    borderRadius: 6,
    paddingTop: 12,
    paddingBottom: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowRadius: 10,
    shadowOpacity: 1,
  },
  pagerView: {
    flex: 1,
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

  // LISTA
  pages2: {
    flexDirection: 'column',
    marginTop: -28,
    paddingTop: 25,
    paddingBottom: 40,
  },
  listItem: {
    padding: 5,
    marginTop: 8,
    backgroundColor: '#d9d9d9',
    borderColor: '#000',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 5,
    borderWidth: 1,
    shadowRadius: 10,
    shadowOpacity: 1,
    marginStart: 14,
    marginEnd: 14,

  },
  textoLista: {
    color: '#000'
  },
  tituloPage: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingEnd: 5,
  },
  tituloLista: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 14,
    marginRight: 14,
    marginTop: 10,
    color: '#000'
  },
  button: {
    backgroundColor: '#09A08D',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginEnd: 10,
    marginTop: 10,
    height: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  searchButton: {
    backgroundColor: '#09A08D',
    borderRadius: 7,
    paddingVertical: 15,
    marginTop: 20,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  textInputModal: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 5,
    marginTop: 7,
    color: '#000'
  },
});
