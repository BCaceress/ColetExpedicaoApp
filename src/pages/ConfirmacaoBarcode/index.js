import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import api from '../../services/api';
import {ArrowLeft} from 'react-native-feather';
import InputSpinner from 'react-native-input-spinner';
import SelectDropdown from 'react-native-select-dropdown';
import Styles from './Styles';
import {useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
Icon.loadFont();

const statusBarHeight = StatusBar.currentHeight
  ? StatusBar.currentHeight + 2
  : 64;
export default function ConfirmacaoBarcode() {
  const route = useRoute();
  const contador = route.params.contador;
  const barcodeList = route.params.barcodeList;
  const user = route.params.user;
  barcodeList.romaneio.frete = '1';
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
          onPress: () => {
            {
              navigation.goBack();
            }
          },
        },
      ],
      {cancelable: true},
    );
  };

  const funcaoConfirmar = () => {
    Alert.alert(
      'Confirmação',
      'Deseja realmente confirmar?',
      [
        {
          text: 'Não',
          style: 'cancel',
        },
        {
          text: 'Sim',
          onPress: () => {
            {
              enviarDados();
            }
          },
        },
      ],
      {cancelable: true},
    );
  };

  const enviarDados = async () => {
    const apiInstance = await api();
    try {
      const resposta = await apiInstance.post(
        '/expedicao/expedicao',
        barcodeList,
      );
      Alert.alert(
        'Sucesso',
        'Ficha gerada com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => {
              {
                //  router.replace(`/leitura/${user}`);
                navigation.replace('LeituraBarcode', {id: user});
              }
            },
          },
        ],
        {cancelable: false},
      );
    } catch (erro) {
      console.error(erro);
    }
  };
  const emojisWithIcons = [
    {title: '0 - Pago', icon: 'cash-check', id: '0'},
    {title: '1 - A pagar', icon: 'cash-refund', id: '1'},
    {title: '2 - Transporte Remetente', icon: 'truck', id: '2'},
    {title: '3 - Transporte Destinatário', icon: 'truck-delivery', id: '3'},
    {title: '9 - Sem Transporte', icon: 'truck-remove', id: '9'},
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
          data={emojisWithIcons}
          defaultValue={emojisWithIcons[1]}
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
                  ...(isSelected && {backgroundColor: '#D2D9DF'}),
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
        <TouchableOpacity
          style={{
            padding: 10,
            width: '100%',
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#09A08D',
            marginTop: 80,
          }}
          onPress={() => {
            funcaoConfirmar();
          }}>
          <Text
            style={{
              color: 'white',
              textAlign: 'center',
              color: '#fff',
              fontSize: 19,
              fontWeight: 'bold',
            }}>
            Confirmar
          </Text>
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
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 6,
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
});
