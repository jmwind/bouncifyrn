import {useState, useEffect} from 'react';
import Utils from './utils';
import {
  useSharedValue,
  withSequence,
  withRepeat,
  withTiming,
  withSpring,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';

const useOpacityPulse = (speed = 50) => {
  const opacity = useSharedValue(0);

  const pulse = () => {
    opacity.value = withSequence(
      withTiming(0.6, {duration: speed}),
      withTiming(0, {duration: speed}),
    );
  };

  return [opacity, pulse];
};

const useWobble = () => {
  const angle = useSharedValue(0);

  const wobble = () => {
    angle.value = withSequence(
      withTiming(-10, {duration: 50}),
      withRepeat(withTiming(10, {duration: 100}), 4, true),
      withTiming(0, {duration: 50}),
    );
  };

  return [angle, wobble];
};

const useWipeUpDown = () => {
  const angle = useSharedValue(0);

  const wobble = () => {
    angle.value = withRepeat(withTiming(30, {duration: 1000}), -1, true);
  };

  return [angle, wobble];
};

const useAnimateRow = (row = 0) => {
  const [rowPosition, setRowPosition] = useState(row);
  const animatedTop = useSharedValue(Utils.rowToTopPosition(row - 1));

  useEffect(() => {
    animatedTop.value = withSpring(Utils.rowToTopPosition(rowPosition), {
      mass: 0.2,
      stiffness: 40,
    });
  }, [rowPosition, animatedTop]);

  return [animatedTop, setRowPosition];
};

const useRadiusPulse = (radius1 = 12, radius2 = 18, delay = 300) => {
  const animatedRadius = useSharedValue(radius1);

  const pulse = () => {
    animatedRadius.value = withRepeat(withTiming(radius2), -1, true);
  };

  const stop = () => {
    cancelAnimation(animatedRadius);
  };

  return [animatedRadius, pulse, stop];
};

const useAnimateDrop = duration => {
  const top = useSharedValue(0);

  const drop = () => {
    top.value = withTiming(1, {
      duration: duration,
      easing: Easing.bounce,
    });
  };

  return [top, drop];
};

const useAnimateCollecting = duration => {
  const top = useSharedValue(0);

  const collect = () => {
    top.value = withTiming(1, {
      duration: duration,
      easing: Easing.linear,
    });
  };

  return [top, collect];
};

export {
  useAnimateRow,
  useOpacityPulse,
  useRadiusPulse,
  useAnimateCollecting,
  useAnimateDrop,
  useWobble,
  useWipeUpDown,
};
