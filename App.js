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
import { Finger } from "./renderers";
import { MoveFinger, SpawnFinger, DeleteFinger } from "./systems"

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
          1: { position: [40,  200], speed: [1.0, 1.0], direction: [1,1], renderer: <Finger />}, //-- Notice that each entity has a unique id (required)
          2: { position: [100, 200], speed: [1.8, 1.5], direction: [-1,1], renderer: <Finger />} //-- and a renderer property (optional). If no renderer          
        }}>

        <StatusBar hidden={true} />

      </GameEngine>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  }
});
