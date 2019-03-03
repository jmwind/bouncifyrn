import * as React from 'react';
import { Animated, Dimensions, Easing } from 'react-native';
import BoxPiece from './boxpiece';
import utils from '../utils';
import { FLOOR_HEIGHT, BOX_TILE_SIZE } from '../renderers';

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
    }, 50);
  };

  calculateItems = () => {
    const { count, origin, backgroundColor } = this.props;
    const items = [];
    // Pixelize the box tile into small blocks that will be part of
    // explosion
    Array.from(Array(count).keys()).forEach(() => {
      const item = {
        backgroundColor: backgroundColor,
        left: utils.randomValue(origin.x, origin.x + BOX_TILE_SIZE),
        top: utils.randomValue(origin.y, origin.y + BOX_TILE_SIZE),
      };
      items.push(item);
    });

    this.setState({
      items
    });
  };

  animate = () => {
    const { fallSpeed = 750 } = this.props;   
    Animated.timing(this.animation, {
      toValue: 1,
      duration: fallSpeed,
      easing: Easing.linear
    }).start((() => {
      // Clear items after explosion so that associated views are gc'd
      items = [];
      this.setState({items})
    }));
  };

  render() {
    return (
      <React.Fragment>
        {this.state && this.state.items && this.state.items.map((item, index) => {
          const bottom = this.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [item.top, FLOOR_HEIGHT]
          });
          const opacity = this.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0]
          });       
          return (
            <BoxPiece backgroundColor={item.backgroundColor} left={item.left} top={bottom} opacity={opacity} key={index} />
          );
        })}
      </React.Fragment>
    );
  }
}

export default Explosion;