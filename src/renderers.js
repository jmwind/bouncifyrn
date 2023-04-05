/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, Dimensions, Animated} from 'react-native';
import {Svg, Circle, G, Path, Text as SVGText} from 'react-native-svg';
import {Canvas} from '@shopify/react-native-skia';
import Utils from './utils';
import {Config, FLOOR_BOX_POSITION} from './config';
import * as Animatable from 'react-native-animatable';
import Explosion from './components/explosion';
import {
  useAnimateCollecting,
  useAnimateDrop,
  useAnimateRow,
  useOpacityPulse,
  useRadiusPulse,
  useWipeUpDown,
  useWobble,
} from './hooks';
import {interpolate} from 'react-native-reanimated';

function Ball(props) {
  const x = props.position.x - Config.RADIUS / 2;
  const y = props.position.y - Config.RADIUS / 2;
  return (
    <Canvas
      style={[styles.ball, {left: x, top: y, backgroundColor: props.color}]}
    />
  );
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
function Floor(props) {
  const {total_hits, current_hits} = props;
  const percent_hit = Math.trunc((current_hits * 100) / total_hits);
  const percent_hit_animated = new Animated.Value(percent_hit);
  const size = 125;
  const margin = 15;
  const strokeWidth = 20;
  const radius = (size - strokeWidth - margin) / 2;
  const circumference = radius * 2 * Math.PI;
  const angle = percent_hit_animated.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 2 * Math.PI],
  });

  return (
    <View style={[styles.floorcontainer, {top: props.height}]}>
      {current_hits > 0 && (
        <View
          style={[
            styles.floor,
            {height: Dimensions.get('window').height - props.height - margin},
          ]}>
          <Svg width={size} height={size}>
            <Circle
              stroke="#265BF6"
              strokeWidth={strokeWidth}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
            />
            <AnimatedCircle
              stroke="#404040"
              strokeWidth={strokeWidth}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              strokeDashoffset={Animated.multiply(angle, radius)}
              strokeDasharray={`${circumference} ${circumference}`}
            />
            <SVGText
              x={size / 2}
              y={size / 2}
              dx="-.5em"
              dy="+.3em"
              fontSize="18"
              textAnchor="middle"
              stroke="white"
              fill="white">
              {/* Ugly hack: percent sign overlaps with single digit text and not with multi */}
              {percent_hit}
              {percent_hit < 10 && ' %'}
              {percent_hit >= 10 && '%'}
            </SVGText>
          </Svg>
        </View>
      )}
    </View>
  );
}

function ScoreBar(props) {
  const {height, best, level, balls_in_play, balls} = props;
  let ball_count = balls === balls_in_play ? balls : balls - balls_in_play;
  const [offset, start] = useWipeUpDown();
  const wwidth = Dimensions.get('window').width;
  const wheight = Dimensions.get('window').height;
  const svgWidth = 40;

  useEffect(() => {
    start();
  }, []);

  return (
    <View style={[styles.scorebar, {height: height}]}>
      <View style={styles.bestcontainer}>
        <Text style={styles.besttitle}>Best</Text>
        <Text style={styles.bestscore}>{best}</Text>
      </View>
      <View style={styles.levelcontainer}>
        <Text style={styles.besttitle}>Level</Text>
        <Text style={styles.currentscore}>{level}</Text>
      </View>
      <View style={styles.ballscontainer}>
        <Text style={styles.besttitle}>Balls</Text>
        <Text style={styles.currentscore}>{ball_count}</Text>
      </View>
      {balls_in_play === 0 && level === 1 && (
        <Animated.View
          style={[
            // eslint-disable-next-line react-native/no-inline-styles
            {
              position: 'absolute',
              top: wheight - 150 + offset.value,
              left: wwidth / 2 - svgWidth / 2,
            },
          ]}>
          <Svg
            width={svgWidth}
            height={svgWidth}
            x="0"
            y="0"
            viewBox="0 0 1000 1000"
            enable-background="new 0 0 1000 1000">
            <G transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)">
              <Path
                fill="white"
                d="M1534.8,4971c-156.4-85.9-153.4-64.4-156.4-1917.1v-1730l-181,171.8c-144.2,138-202.4,174.8-279.1,174.8c-135,0-211.6-49.1-263.8-171.8c-67.5-162.6-9.2-254.6,469.3-723.9c576.7-570.5,518.4-573.6,1119.6,30.7c432.5,432.5,454,460.1,454,573.6c-3.1,131.9-39.9,199.4-144.2,254.6c-135,73.6-220.8,43-411-135l-181-174.8l-6.1,1757.6l-9.2,1754.5l-101.2,89C1737.2,5020.1,1648.3,5035.4,1534.8,4971z"
              />
              <Path
                fill="white"
                d="M4160.4,4971c-187.1-52.2-374.2-181-503.1-349.7c-190.2-251.5-193.2-273-193.2-2095V879.2l-190.2-138C2550.1,222.7,2175.8-449,2175.8-1228.1c0-2226.9,2070.4-3920,4282-3496.8c1438.6,273,2558.1,1411,2855.7,2892.5c46,223.9,52.1,450.9,55.2,1417.1V735l-101.2,208.6c-211.6,429.4-705.5,647.2-1125.7,496.9c-67.5-24.5-125.8-46-128.8-46c-3.1,0-21.5,49.1-39.9,107.4c-61.3,190.2-254.6,398.8-463.2,503c-162.6,82.8-223.9,95.1-423.3,95.1c-165.6,0-273-18.4-368.1-64.4l-138-61.3l-153.4,153.4c-260.7,257.7-585.9,352.7-898.7,269.9l-159.5-43l-9.2,969.3l-9.2,969.3l-85.9,174.8C5062.2,4879,4592.9,5093.7,4160.4,4971z M4596,4388.2c181-95.1,171.8,67.5,187.1-2653.2c15.3-2699.2,9.2-2594.9,174.8-2668.6c116.6-52.1,214.7-39.9,306.7,39.9l85.9,73.6l15.3,1233.1l15.3,1233.1l113.5,104.3c95.1,85.9,138,104.3,254.6,104.3c116.6,0,159.5-18.4,254.6-104.3l113.5-104.3l15.3-1233.1L6148-820.1l85.9-73.6c150.3-128.8,383.4-67.5,447.9,113.5c21.4,64.4,33.7,438.6,33.7,1076.6c0,1088.9,3,1110.4,202.4,1205.4c125.8,58.3,208.6,58.3,337.4-3.1c205.5-98.1,211.7-122.7,220.8-1276l9.2-1033.7l92-79.7c125.8-104.3,254.6-101.2,368.1,12.2l89,89v696.3c0,766.8,15.3,846.6,181,944.7c104.3,61.3,294.4,67.5,395.7,9.2c39.9-21.5,98.2-79.7,131.9-128.8c55.2-82.8,58.3-153.4,58.3-1134.9c0-794.4-12.3-1110.4-46-1309.7c-199.4-1141.1-1045.9-2073.5-2177.8-2401.7c-392.6-113.5-987.7-134.9-1395.6-49.1c-595,122.7-1067.4,374.2-1506,797.5c-613.5,588.9-920.2,1294.4-926.3,2122.6c-3.1,303.6,9.2,380.3,73.6,552.1c98.1,254.6,254.6,493.8,469.3,705.5l171.8,165.6v-484.6v-484.6l88.9-89c95.1-95.1,196.3-110.4,319-55.2c165.6,73.6,159.5-30.7,174.8,2665.5c9.2,1374.2,27.6,2518.3,42.9,2539.7C4178.8,4412.7,4436.5,4471,4596,4388.2z"
              />
            </G>
          </Svg>
        </Animated.View>
      )}
    </View>
  );
}

function AimLine(props) {
  const {start, end} = props;
  const drawLength = 1.0; // Ratio of aim vector to display
  const numCircles = 25;
  let delta = Utils.getPointsDeltas(start, end);
  let length = Utils.getDistance(start, end);
  if (length === 0) {
    return null;
  }
  let RADIUS = Config.RADIUS;
  let width = Dimensions.get('window').width;
  let height = Dimensions.get('window').height;
  let radius = Math.min(
    (RADIUS * 2) / 3,
    Math.max(RADIUS / 2, (RADIUS * length) / (height / 2)),
  );

  let circles = Array(numCircles)
    .fill()
    .map((_, i) => {
      let new_start = props.start;
      let spacing = delta.x / numCircles;

      // check screen upper and sound bounds and bounce the aim line off the surface
      let x = new_start.x + spacing * i * drawLength;
      if (x > width) {
        x -= (x - width) * 2;
      }
      if (x < 0) {
        x += -x * 2;
      }
      let y = new_start.y + (delta.y / numCircles) * i * drawLength;
      if (y < Config.SCOREBOARD_HEIGHT) {
        y -= (y - Config.SCOREBOARD_HEIGHT) * 2;
      }
      return <Circle key={i} cx={x} cy={y} r={radius} fill="white" />;
    });

  return (
    <View>
      <Svg width={width} height={height}>
        {circles}
      </Svg>
    </View>
  );
}

function SpeedUpButton(props) {
  const {speed, row, column, available} = props;
  return (
    available && (
      <View
        style={[
          styles.boxcontainer,
          {
            top: Utils.rowToTopPosition(row) + Config.BOX_TILE_SPACE,
            left: Utils.colToLeftPosition(column) + +Config.BOX_TILE_SPACE,
          },
        ]}>
        <Animatable.Text
          style={styles.speedupbutton}
          animation="swing"
          iterationCount="infinite"
          direction="alternate">
          {speed}x
        </Animatable.Text>
      </View>
    )
  );
}

function BoxTile(props) {
  const [exploding, setExploding] = useState(false);
  const [animateTop, setRow] = useAnimateRow(props.row);
  const [animateOpacity, startOpacityPulse] = useOpacityPulse(50);
  const [angle, startWobble] = useWobble();
  const [initalized, setInitialized] = useState(false);

  useEffect(() => {
    setRow(props.row);
    setInitialized(true);
  }, [props.row]);

  useEffect(() => {
    setExploding(props.explode);
  }, [props.explode]);

  useEffect(() => {
    startOpacityPulse();
    if (initalized) {
      startWobble();
    }
  }, [props.hits]);

  const {hits, col, row} = props;
  const color = Utils.hitsToColor(hits);
  const x = Utils.colToLeftPosition(col);
  const y = Utils.rowToTopPosition(row);
  const opacity = interpolate(animateOpacity.value, [0, 1], [1, 0]);
  const top = animateTop.value;
  if (exploding) {
    return (
      <Explosion backgroundColor={color} count={35} origin={{x: x, y: y}} />
    );
  } else {
    return (
      <Animated.View
        style={[
          styles.boxcontainer,
          {
            backgroundColor: color,
            top: top,
            width: Config.BOX_TILE_SIZE,
            height: Config.BOX_TILE_SIZE,
            left: x,
            opacity: opacity,
            transform: [{rotateZ: `${angle.value}deg`}],
          },
        ]}>
        <Text style={styles.boxtext}>{hits}</Text>
      </Animated.View>
    );
  }
}

function BallPowerUp(props) {
  const [rowAnimationTop, setRow] = useAnimateRow(props.row);
  const [dropAnimationTop, setDrop] = useAnimateDrop(1200);
  const [collectingAnimationTop, setCollecting] = useAnimateCollecting(
    Utils.randomValueRounded(800, 1400),
  );
  const [radius, startPulse, stopPulse] = useRadiusPulse(11, 15, 400);

  useEffect(() => {
    setRow(props.row);
  }, [props.row, setRow]);

  useEffect(() => {
    if (props.falling) {
      stopPulse();
      setDrop();
    }
  }, [props.falling]);

  useEffect(() => {
    if (props.collecting) {
      setCollecting();
    }
  }, [props.collecting]);

  useEffect(() => {
    startPulse();
  }, []);

  const {col, row, falling, collecting} = props;
  let color = !falling ? 'white' : '#8CB453';
  let leftPosition = Utils.colToLeftPosition(col);
  let opacity = 1;
  const BOX_MIDDLE = Config.BOX_TILE_SIZE / 2;
  const TOP = Utils.rowToTopPosition(row);
  const FLOOR = Config.FLOOR_HEIGHT - Config.BOX_TILE_SIZE / 2 - 7;

  // Top position will change based on state of the power-up
  let topPosition = rowAnimationTop.value;
  if (collecting) {
    topPosition = interpolate(
      collectingAnimationTop.value,
      [0, 1],
      [FLOOR_BOX_POSITION, FLOOR_BOX_POSITION - 600],
    );
    opacity = interpolate(collectingAnimationTop.value, [0, 1], [1, 0]);
  } else if (falling) {
    topPosition = interpolate(dropAnimationTop.value, [0, 1], [TOP, FLOOR]);
  }
  return (
    <Animated.View
      style={[
        styles.boxcontainer,
        {
          top: topPosition,
          left: leftPosition,
          opacity: opacity,
        },
      ]}>
      <Svg height={Config.BOX_TILE_SIZE} width={Config.BOX_TILE_SIZE}>
        {!props.falling && (
          <Circle
            cx={BOX_MIDDLE}
            cy={BOX_MIDDLE}
            r={radius.value}
            stroke={color}
            strokeWidth="3"
            fill="#202020"
          />
        )}
        {!props.collecting && (
          <Circle
            cx={BOX_MIDDLE}
            cy={BOX_MIDDLE}
            r="8"
            stroke={color}
            fill={color}
          />
        )}
        {props.collecting && (
          <SVGText
            dx={BOX_MIDDLE}
            dy={BOX_MIDDLE}
            stroke={color}
            fill={color}
            opacity={opacity}>
            +1
          </SVGText>
        )}
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  ball: {
    borderColor: '#CCC',
    borderWidth: 0,
    borderRadius: 8,
    width: Config.RADIUS * 2,
    height: Config.RADIUS * 2,
    position: 'absolute',
  },
  floor: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  floorcontainer: {
    position: 'absolute',
    left: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: '#363636',
  },
  boxcontainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  boxtext: {
    color: '#262626',
    fontSize: 16,
  },
  scorebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    width: Dimensions.get('window').width,
    backgroundColor: '#363636',
  },
  bestcontainer: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 5,
    justifyContent: 'flex-end',
  },
  levelcontainer: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 5,
    justifyContent: 'flex-end',
  },
  ballscontainer: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 5,
    justifyContent: 'flex-end',
  },
  besttitle: {
    fontSize: 10,
    color: 'white',
  },
  bestscore: {
    fontSize: 20,
    color: 'white',
  },
  currentscore: {
    fontSize: 22,
    color: 'white',
  },
  ballpowerupcontainer: {
    position: 'absolute',
    left: 100,
    top: 100,
    alignItems: 'center',
    backgroundColor: '#202020',
  },
  ballpowerup: {
    position: 'absolute',
    flex: 1,
  },
  speedupbutton: {
    color: 'white',
    fontSize: 22,
  },
});

export {Ball, Floor, ScoreBar, AimLine, BoxTile, BallPowerUp, SpeedUpButton};
