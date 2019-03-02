// @flow strict

import * as React from 'react';
import { StyleSheet, Animated } from 'react-native';

import utils from '../utils';

const colors = [
  '#e67e22',
  '#2ecc71',
  '#3498db',
  '#84AAC2',
  '#E6D68D',
  '#F67933',
  '#42A858',
  '#4F50A2',
  '#A86BB7',
  '#e74c3c',
  '#1abc9c'
];

class BoxPiece extends React.PureComponent {    
  
    constructor(props) {
        super(props);
    }

    render() {
      let width = 4;
      let height = utils.randomValue(6, 12);
      let isRounded = Math.round(utils.randomValue(0, 1)) === 1;
      let backgroundColor = colors[Math.round(utils.randomValue(0, colors.length - 1))];

      const { left, bottom, transform } = this.props;      
      const style = { left, bottom, width, height, backgroundColor, transform };
  
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