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
import { Finger, Floor } from "./renderers";
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
          ball: { type: "ball", position: [40,  200], speed: [3.0, 1.0], direction: [1,1], renderer: <Finger />},
          floor: { height: 75, renderer: <Floor /> }           
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
