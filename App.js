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
import { Ball, Floor, ScoreBar, BoxTile } from "./renderers";
import { MoveBall, SpawnBall, AimBallsStart, AimBallsRelease } from "./systems"

// TODO: hack to set the first lead ball at right spot on the floor
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
          box2: {row: 1, col: 0, hits: 1, renderer: <BoxTile />}, 
          box21: {row: 1, col: 1, hits: 31, renderer: <BoxTile />}, 
          box22: {row: 1, col: 2, hits: 21, renderer: <BoxTile />}, 
          box23: {row: 1, col: 3, hits: 11, renderer: <BoxTile />}, 
          box3: {row: 2, col: 0, hits: 4, renderer: <BoxTile />}, 
          box4: {row: 3, col: 0, hits: 8, renderer: <BoxTile />}, 
          box5: {row: 4, col: 0, hits: 12, renderer: <BoxTile />}, 
          box6: {row: 5, col: 0, hits: 12, renderer: <BoxTile />}, 
          box7: {row: 6, col: 0, hits: 1, renderer: <BoxTile />},
          box8: {row: 6, col: 1, hits: 1, renderer: <BoxTile />},  
          box9: {row: 6, col: 2, hits: 44, renderer: <BoxTile />},  
          box10: {row: 6, col: 3, hits: 44, renderer: <BoxTile />},  
          box13: {row: 6, col: 6, hits: 33, renderer: <BoxTile />},  
          box14: {row: 6, col: 7, hits: 22, renderer: <BoxTile />},    
          box15: {row: 8, col: 6, hits: 1, renderer: <BoxTile />},  
          box16: {row: 8, col: 7, hits: 44, renderer: <BoxTile />},  
          box17: {row: 8, col: 2, hits: 44, renderer: <BoxTile />},  
          box18: {row: 9, col: 6, hits: 33, renderer: <BoxTile />},  
          box19: {row: 9, col: 7, hits: 22, renderer: <BoxTile />},    
          ball: { type: "ball", color: "blue", state: "stopped", start: [200, ball_start], position: [200,  ball_start], speed: [3.0, 1.0], direction: [1,1], renderer: <Ball />},          
          floor: { height: 125, ball_start: ball_start, renderer: <Floor /> },          
          scorebar: { height: 90, best: 276, balls: 3, balls_in_play: 0, score: 0, renderer: <ScoreBar />}          
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
