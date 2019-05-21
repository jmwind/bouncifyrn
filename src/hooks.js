import { useState, useEffect, useRef, useCallback } from "react";
import Utils from "./utils";
import { Animated, Easing } from "react-native";

const useAnimatedValue = (initialValue) => {
    const ref = useRef(new Animated.Value(initialValue))
    return ref.current
}

const useOpacityPulse = (speed = 50) => {
    const opacity = useAnimatedValue(0);

    const pulse = () => {
        Animated.sequence([
            Animated.timing(opacity, {toValue: 0.6, easing: Easing.linear, duration: speed}),
            Animated.timing(opacity, {toValue: 0, easing: Easing.linear, duration: speed})
        ]).start();
    }

    return [opacity, pulse];
}

const useAnimateRow = (row = 0) => {
    const [rowPosition, setRowPosition] = useState(row);    
    const animatedTop = useAnimatedValue(Utils.rowToTopPosition(row - 1));

    useEffect(() => {
        Animated.spring(animatedTop, {
            toValue: Utils.rowToTopPosition(rowPosition),                
            bounciness: 18,
            speed: 8
          }).start();       
    }, [rowPosition]);
    
    return [animatedTop, setRowPosition];
}

function useAnimatedValueListener(handler, element = global){
    // Create a ref that stores handler
    const savedHandler = useRef();
    
    // Update ref.current value if handler changes.
    useEffect(() => {
      savedHandler.current = handler;
    }, [handler]);
  
    useEffect(() => {
        // Make sure element supports addEventListener
        const isSupported = element && element.addListener;
        if (!isSupported) return;
        
        const eventListener = event => savedHandler.current(event);    
        element.addListener(eventListener);
        
        return () => {
          element.removeListener(eventListener);
        };
      },
      [element]
    );
  };

const useRadiusPulse = (radius1 = 14, radius2 = 12, delay = 100) => {
    const animatedRadius = useAnimatedValue(radius1);
    const radius = useRef(radius1);

    const handler = useCallback(
        ({ value }) => {
          radius.current = value;
        }
    );
    
    useAnimatedValueListener(handler, animatedRadius);    

    const pulse = () => {
        Animated.loop(
            Animated.sequence([
              Animated.timing(animatedRadius, {
                toValue: radius1,
                duration: delay,
                ease: Easing.linear,
                useNativeDriver: true
              }),
              Animated.timing(animatedRadius, {
                toValue: radius2,
                duration: delay,
                ease: Easing.linear,
                useNativeDriver: true
              })
            ])
          ).start(); 
    }

    useEffect(() => {
        pulse();            
    }, []);

    return radius.current;
}

const useAnimateDrop = (duration) => {  
    const top = useAnimatedValue(0);
    
    const drop = () => {
        Animated.timing(top, {
            toValue: 1,
            easing: Easing.back(),
            duration: duration,
          }).start();
    }

    return [top, drop];
}

const useAnimateCollecting = (duration1, duration2) => {
    const top = useAnimatedValue(0);

    const collect = () => {
        Animated.timing(top, {
            toValue: 1,
            easing: Easing.linear,
            duration: Utils.randomValueRounded(duration1, duration2)
        }).start();        
    }

    return [top, collect];
}

export { useAnimateRow, useOpacityPulse, useRadiusPulse, useAnimateCollecting, useAnimateDrop };