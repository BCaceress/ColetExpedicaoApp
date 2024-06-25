import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Login from './pages/Login';
import Configuracao from './pages/Configuracao';
import ListaUsuarios from './pages/ListaUsuarios';
import LeituraBarcode from './pages/LeituraBarcode';
import ConfirmacaoBarcode from './pages/ConfirmacaoBarcode';

const Stack = createStackNavigator();

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#09A08D',
          },
          headerTintColor: '#fff',
        }}>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerTitle: '',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Configuracao"
          component={Configuracao}
          options={{
            headerTitle: 'Configurações',
          }}
        />
        <Stack.Screen
          name="ListaUsuarios"
          component={ListaUsuarios}
          options={{
            headerTitle: '',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="LeituraBarcode"
          component={LeituraBarcode}
          options={{
            headerTitle: '',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ConfirmacaoBarcode"
          component={ConfirmacaoBarcode}
          options={{
            headerTitle: '',
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
