// @flow strict

import * as React from 'react';
import { Animated, Dimensions, Easing } from 'react-native';
import BoxPiece from './boxpiece';
import utils from '../utils';

const TOP_MIN = 0.7;

class Explosion extends React.PureComponent {  
  animation = new Animated.Value(0);

  constructor(props) {
      super(props);
      this.state = {
        items: []
      }
    }

  componentDidMount = () => {
    this.calculateItems();
    setTimeout(() => {
      this.animate()
    }, 100);
  };

  calculateItems = () => {
    const { count } = this.props;
    const items = [];

    Array.from(Array(count).keys()).forEach(() => {
      const item = {
        leftDelta: utils.randomValue(0, 1),
        topDelta: utils.randomValue(TOP_MIN, 1),
        swingDelta: utils.randomValue(0.2, 1),
        speedDelta: {
          rotateX: utils.randomValue(0.3, 1),
          rotateY: utils.randomValue(0.3, 1),
          rotateZ: utils.randomValue(0.3, 1)
        }
      };
      items.push(item);
    });

    this.setState({
      items
    });
  };

  animate = () => {
    const { explosionSpeed = 350, fallSpeed = 3000 } = this.props;   
    Animated.timing(this.animation, {
      toValue: 2,
      duration: fallSpeed,
      easing: Easing.cubic
    }).start();
  };

  render() {
    const { origin } = this.props;
    const { height, width } = Dimensions.get('window');

    return (
      <React.Fragment>
        {this.state && this.state.items && this.state.items.map((item, index) => {
          const left = this.animation.interpolate({
            inputRange: [0, 1, 2],
            outputRange: [origin.x, item.leftDelta * width, item.leftDelta * width]
          });
          const bottom = this.animation.interpolate({
            inputRange: [0, 1, 1 + item.topDelta, 2],
            outputRange: [origin.y, item.topDelta * height, 0, 0]
          });
          const rotateX = this.animation.interpolate({
            inputRange: [0, 2],
            outputRange: ['0deg', `${item.speedDelta.rotateX * 360 * 10}deg`]
          });
          const rotateY = this.animation.interpolate({
            inputRange: [0, 2],
            outputRange: ['0deg', `${item.speedDelta.rotateY * 360 * 5}deg`]
          });
          const rotateZ = this.animation.interpolate({
            inputRange: [0, 2],
            outputRange: ['0deg', `${item.speedDelta.rotateZ * 360 * 2}deg`]
          });
          const translateX = this.animation.interpolate({
            inputRange: [0, 0.4, 1.2, 2],
            outputRange: [0, -(item.swingDelta * 30), (item.swingDelta * 30), 0]
          })
          const transform = [{rotateX}, {rotateY}, {rotateZ}, {translateX}];

          return (
            <BoxPiece left={left} bottom={bottom} transform={transform} key={index} />
          );
        })}
      </React.Fragment>
    );
  }
}

export default Explosion;