import React, { useState, useEffect } from "react";
import Animated, {
  useSharedValue,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import BoxPiece from './boxpiece';
import { Config } from '../config';

function Explosion(props) {
  const animation = useSharedValue(0);
  const [items, setItems] = useState([]);
  
  calculateItems = () => {
    const { count, origin, backgroundColor } = props;
    const new_items = [];
    // Pixelize the box tile into small blocks that will be part of
    // explosion
    Array.from(Array(count).keys()).forEach(() => {
      const item = {
        backgroundColor: backgroundColor,
        left: utils.randomValue(origin.x - 35, origin.x + Config.BOX_TILE_SIZE + 15),
        top: utils.randomValue(origin.y - 35, origin.y + Config.BOX_TILE_SIZE + 15),
        width: utils.randomValue(2, 10),
        height: utils.randomValue(2, 10)
      };
      new_items.push(item);
    });
    setItems(new_items);
  };  

  useEffect(() => {
    calculateItems();   
    animation.value = withTiming(1, {
      duration: 300,
      easing: Easing.linear}) 
    return () => {
      setItems([]);
    };
  }, []);

  return (
    <React.Fragment>
      {items && items.map((item, index) => {
        const bottom = interpolate(animation.value, [0, 1], [item.top, item.top + 100]);        
        const opacity = interpolate(animation.value, [0, 1], [1, 0]);
        return (
          <BoxPiece 
            backgroundColor={item.backgroundColor} 
            left={item.left} 
            height={item.height} 
            width={item.width} 
            top={bottom} 
            opacity={opacity} 
            key={index} />
        );
      })}
    </React.Fragment>
  );
}

export default Explosion;