import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ArrowLeft } from 'react-native-feather';
import InputSpinner from 'react-native-input-spinner';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../../services/api';
import Styles from './Styles';
Icon.loadFont();

const statusBarHeight = StatusBar.currentHeight
  ? StatusBar.currentHeight + 2
  : 64;
export default function ConfirmacaoBarcode() {
  const [isLoading, setIsLoading] = useState(false);
  const route = useRoute();
  const contador = route.params.contador;
  const barcodeList = route.params.barcodeList;
  const user = route.params.user;
  barcodeList.romaneio.frete = 'P';
  barcodeList.romaneio.volumes = contador;
  barcodeList.romaneio.usuario = user;

  const navigation = useNavigation();
  const handleExit = () => {
    Alert.alert(
      'Retornar',
      'Deseja realmente voltar?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sim',
          onPress: navigation.goBack(),
        },
      ],
      { cancelable: true },
    );
  };

  const enviarDados = async () => {
    const apiInstance = await api();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 100));
    try {
      const response = await apiInstance.post('/expedicao/expedicao', barcodeList);
      if (response.status === 201) {
        setIsLoading(false);
        Alert.alert(
          'Sucesso',
          response.data.mensagem,
          [
            {
              text: 'OK',
              onPress: () => navigation.replace('LeituraBarcode', { id: user }),
            },
          ],
          { cancelable: false }
        );
      } else {
        setIsLoading(false);
        Alert.alert(
          'Erro',
          response.data.mensagem,
          [{ text: 'OK' }],
          { cancelable: false }
        );
      }
    } catch (erro) {
      console.error(erro);
      setIsLoading(false);
      Alert.alert(
        'Erro',
        'Ocorreu um erro ao enviar a ficha. Por favor, tente novamente mais tarde.',
        [{ text: 'OK' }],
        { cancelable: false }
      );
    }
  };
  const listaFrete = [
    { title: '0 - Pago', icon: 'cash-check', id: 'P' },
    { title: '1 - A pagar', icon: 'cash-refund', id: 'A' },
    { title: '2 - Transporte Remetente', icon: 'truck', id: 'R' },
    { title: '3 - Transporte Destinatário', icon: 'truck-delivery', id: 'O' },
    { title: '9 - Sem Transporte', icon: 'truck-remove', id: 'N' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container2}>
        <View style={styles.content}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.buttonUser}
            onPress={handleExit}>
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.username}>
            Romaneio:{' '}
            <Text style={styles.boldText}>{barcodeList.romaneio.romaneio}</Text>
          </Text>
        </View>
      </View>
      <View style={styles.content2}>
        <Text style={styles.textoEsquerda}>
          {barcodeList.romaneio.referencia} - {barcodeList.romaneio.produto}{' '}
          {barcodeList.romaneio.descricao}
        </Text>
      </View>
      <View style={styles.containerCentral}>
        <Text style={styles.titulo}>Deseja gerar as fichas de expedição?</Text>
        <Text style={styles.label}>Selecione o Frete:</Text>
        <SelectDropdown
          data={listaFrete}
          defaultValue={listaFrete[1]}
          onSelect={(selectedItem, index) => {
            barcodeList.romaneio.frete = selectedItem.id;
          }}
          renderButton={(selectedItem, isOpen) => {
            return (
              <View style={styles.dropdownButtonStyle}>
                {selectedItem && (
                  <Icon
                    name={selectedItem.icon}
                    style={styles.dropdownButtonIconStyle}
                  />
                )}
                <Text style={styles.dropdownButtonTxtStyle}>
                  {(selectedItem && selectedItem.title) || 'Selecione o Frete'}
                </Text>
                <Icon
                  name={isOpen ? 'chevron-up' : 'chevron-down'}
                  style={styles.dropdownButtonArrowStyle}
                />
              </View>
            );
          }}
          renderItem={(item, index, isSelected) => {
            return (
              <View
                style={{
                  ...styles.dropdownItemStyle,
                  ...(isSelected && { backgroundColor: '#D2D9DF' }),
                }}>
                <Icon name={item.icon} style={styles.dropdownItemIconStyle} />
                <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
          dropdownStyle={styles.dropdownMenuStyle}
        />
        <Text style={styles.label}>Quantidade de Volumes:</Text>
        <View style={Styles.col}>
          <InputSpinner
            style={Styles.spinner}
            value={contador}
            min={0}
            max={contador}
            step={1}
            fontSize={18}
            color={'#09A08D'}
            background={'#fff'}
            rounded={false}
            showBorder={true}
            editable={false}
            onChange={num => {
              barcodeList.romaneio.volumes = num;
            }}
          />
        </View>
      </View>
      <View style={styles.containerInferior}>
        <TouchableOpacity style={styles.btConfirmar}
          onPress={() => {
            enviarDados();
          }}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.txtConfirmar}>
              Confirmar
            </Text>)}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container2: {
    backgroundColor: '#09A08D',
    paddingTop: statusBarHeight,
    flexDirection: 'row',
    paddingStart: 16,
    paddingEnd: 16,
    paddingBottom: 65,
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
  content2: {
    flexDirection: 'row',
    marginTop: -50,
    marginStart: 14,
  },
  textoEsquerda: {
    color: '#fff',
    fontSize: 19,
    fontWeight: 'bold',
  },
  buttonUser: {
    width: 35,
    height: 35,
    backgroundColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35 / 2,
  },
  containerCentral: {
    flex: 1,
    marginTop: 28,
    marginStart: 14,
    marginEnd: 14,
  },
  titulo: {
    fontSize: 19,
    lineHeight: 32,
    fontWeight: 'bold',
    color: '#464646',
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    marginTop: 20,
  },
  containerInferior: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  //Dropdown
  dropdownButtonStyle: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    elevation: 4,
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#464646',
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#464646',
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  //button confirmar
  btConfirmar: {
    padding: 10,
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#09A08D',
    marginTop: 80,
  },
  txtConfirmar: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 19,
    fontWeight: 'bold',
  },
});
