import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import {FileText, Plus, XCircle} from 'react-native-feather';

export default class FabButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false, // Adicione o estado para controlar a abertura/fechamento do menu
    };
    this.animation = new Animated.Value(0);
  }

  toggleMenu = () => {
    const toValue = this.state.open ? 0 : 1;
    Animated.spring(this.animation, {
      toValue,
      friction: 6,
      useNativeDriver: false,
    }).start();
    this.setState({open: !this.state.open});
  };

  render() {
    const cancelStyle = {
      transform: [
        {
          scale: this.animation,
        },
        {
          translateY: this.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -140],
          }),
        },
      ],
    };
    const confirmationStyle = {
      transform: [
        {
          scale: this.animation,
        },
        {
          translateY: this.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -70],
          }),
        },
      ],
    };
    const rotation = {
      transform: [
        {
          rotate: this.animation.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '45deg'],
          }),
        },
      ],
    };

    return (
      <View style={[styles.container, this.props.style]}>
        <TouchableWithoutFeedback onPress={this.toggleMenu}>
          <Animated.View style={[styles.button, styles.menu, rotation]}>
            <Plus size={25} color="white" />
          </Animated.View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={this.props.onCancelPress}>
          <Animated.View style={[styles.button, styles.submenu2, cancelStyle]}>
            <XCircle size={32} color="white" />
          </Animated.View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={this.props.onConfirmationPress}>
          <Animated.View
            style={[styles.button, styles.submenu, confirmationStyle]}>
            <FileText size={25} color="white" />
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    position: 'absolute',
  },
  button: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowRadius: 10,
    shadowColor: '#09A08D',
    shadowOpacity: 0.3,
    shadowOffset: {
      height: 10,
    },
  },
  menu: {
    backgroundColor: '#09A08D',
  },
  submenu: {
    width: 48,
    height: 48,
    borderRadius: 48 / 2,
    backgroundColor: '#09A08D',
  },
  submenu2: {
    width: 48,
    height: 48,
    borderRadius: 48 / 2,
    backgroundColor: '#FC1723',
  },
});
