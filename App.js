/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { PureComponent } from "react";
import { StyleSheet } from "react-native";
import { GameEngine } from "react-native-game-engine";
import { Ball, Floor, ScoreBar, BoxTile, BallPowerUp, FLOOR_HEIGHT, RADIUS } from "./renderers";
import { MoveBall, SpawnBall, AimBallsStart, AimBallsRelease, CreateBallTail } from "./systems"

export default class BouncifyGame extends PureComponent {
  constructor() {
    super();
  }

  render() {
    return (
      <GameEngine
        style={styles.container}
        systems={[MoveBall, SpawnBall, AimBallsStart, AimBallsRelease, CreateBallTail]}
        entities={{
          floor: { height: FLOOR_HEIGHT, renderer: <Floor /> },          
          scorebar: { height: 90, best: 276, state: "stopped", level: 1, balls: 1, new_balls: 0, balls_in_play: 0, score: 0, renderer: <ScoreBar />},          
          box2: {row: 1, col: 0, hits: 1, renderer: <BoxTile />}, 
          box21: {row: 1, col: 1, hits: 2, renderer: <BoxTile />}, 
          box22: {row: 1, col: 2, hits: 2, renderer: <BoxTile />}, 
          box23: {row: 1, col: 7, hits: 1, renderer: <BoxTile />},   
          box_power1: {type: "powerup", row: 1, col: 3, renderer: <BallPowerUp />},
          box_power2: {type: "powerup", row: 1, col: 6, renderer: <BallPowerUp />},      
          ball: { color: "white", state: "stopped", start: [300, FLOOR_HEIGHT - RADIUS*2], position: [300,  FLOOR_HEIGHT - RADIUS*2], speed: [1.0, 1.0], direction: [1,1], renderer: <Ball />}          
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
