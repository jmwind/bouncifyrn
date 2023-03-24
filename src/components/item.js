import React, {PureComponent} from 'react';
import {TouchableWithoutFeedback, StyleSheet} from 'react-native';
import * as Animatable from 'react-native-animatable';

export default class Item extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pressed: false,
    };
    this.text = React.createRef();
  }
  onPressIn = () => {
    if (!this.props.onPress) {
      return;
    }

    this.setState({
      pressed: true,
    });

    this.text.current.transitionTo({
      scale: 0.95,
    });
  };

  onPressOut = () => {
    if (!this.props.onPress) {
      return;
    }

    this.setState({
      pressed: false,
    });

    this.text.current.transitionTo({
      scale: 1,
    });
  };

  getColor = () => ({
    color: this.state.pressed ? 'blue' : 'white',
  });

  render() {
    return (
      <TouchableWithoutFeedback
        onPress={this.props.onPress}
        onPressIn={this.onPressIn}
        onPressOut={this.onPressOut}>
        <Animatable.Text
          style={[styles.item, this.getColor()]}
          ref={this.text}
          textBreakStrategy={'simple'}>
          {this.props.children}
        </Animatable.Text>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    fontSize: 20,
    color: '#FFF',
  },
});
