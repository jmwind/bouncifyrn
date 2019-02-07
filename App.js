/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { PureComponent } from "react";
import { AppRegistry, StyleSheet, StatusBar } from "react-native";
import { GameEngine } from "react-native-game-engine";
import { Finger, Floor, ScoreBar } from "./renderers";
import { MoveFinger, SpawnFinger } from "./systems"

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
          floor: { height: 125, renderer: <Floor /> },
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
