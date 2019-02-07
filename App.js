/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { PureComponent } from "react";
import { StyleSheet, Dimensions } from "react-native";
import { GameEngine } from "react-native-game-engine";
import { Ball, Floor, ScoreBar, AimLine } from "./renderers";
import { MoveBall, SpawnBall, AimBallsStart, AimBallsRelease } from "./systems"

const screen = Dimensions.get("window");
const ball_start = 674;

export default class BouncifyGame extends PureComponent {
  constructor() {
    super();
  }

  render() {
    return (
      <GameEngine
        style={styles.container}
        systems={[MoveBall, SpawnBall, AimBallsStart, AimBallsRelease]}
        entities={{
          ball: { type: "ball", color: "red", state: "stopped", start: [200, ball_start], position: [200,  ball_start], speed: [3.0, 1.0], direction: [1,1], renderer: <Ball />},
          floor: { height: 125, ball_start: ball_start, renderer: <Floor /> },
          scorebar: {height: 90, best: 276, balls: 1, score: 0, renderer: <ScoreBar />}
          //aimline: { start: [200, ball_start], end: [100, ball_start - 100], renderer: <AimLine />}           
        }}>
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
