import * as React from 'react';
import { StyleSheet, Animated } from 'react-native';
import utils from '../utils';

// Box piece when exploding
class BoxPiece extends React.PureComponent {    
  
    constructor(props) {
        super(props);
    }

    render() {
      const { backgroundColor, left, top, bottom, transform, opacity, width, height } = this.props;      
      const style = { left, top, bottom, width, height, opacity, backgroundColor, transform, width, height };  
      return (
        <Animated.View style={[styles.piece, style]} />
      );
    }
  }
  
  const styles = StyleSheet.create({
    piece: {
      position: 'absolute'
    }
  });
  
  export default BoxPiece;