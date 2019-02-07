/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { PureComponent } from "react";
import { AppRegistry, StyleSheet, StatusBar, Dimensions } from "react-native";
import { GameEngine } from "react-native-game-engine";
import { Finger, Floor, ScoreBar, RADIUS } from "./renderers";
import { MoveFinger, SpawnFinger } from "./systems"

const screen = Dimensions.get("window");
const ball_start = 674;

export default class BestGameEver extends PureComponent {
  constructor() {
    super();
  }

  render() {
    return (
      <GameEngine
        style={styles.container}
        systems={[MoveFinger, SpawnFinger]}
        entities={{
          ball: { type: "ball", state: "stopped", position: [200,  ball_start], speed: [3.0, 1.0], direction: [1,1], renderer: <Finger />},
          floor: { height: 125, ball_start: ball_start, renderer: <Floor /> },
          scorebar: {height: 90, best: 276, balls: 1, score: 0, renderer: <ScoreBar />}           
        }}>

        <StatusBar />

      </GameEngine>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000"
  }
});
