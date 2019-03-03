import * as React from 'react';
import { StyleSheet, Animated } from 'react-native';
import utils from '../utils';

class BoxPiece extends React.PureComponent {    
  
    constructor(props) {
        super(props);
    }

    render() {
      let width = 6;
      let height = 6;
      let isRounded = Math.round(utils.randomValue(0, 1)) === 1;
      const { backgroundColor, left, top ,bottom, transform, opacity } = this.props;      
      const style = { left, top, bottom, width, height, opacity, backgroundColor, transform };  
      return (
        <Animated.View style={[styles.piece, isRounded && styles.rounded, style]} />
      );
    }
  }
  
  const styles = StyleSheet.create({
    piece: {
      position: 'absolute'
    },
    rounded: {
      borderRadius: 100
    }
  });
  
  export default BoxPiece;