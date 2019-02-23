import React, { PureComponent } from "react";
import { View, StatusBar, StyleSheet } from "react-native";
import MainMenu from "./components/menu";
import BouncifyGame from "./game";

export default class Container extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      gameStarted: false,
      lastScore: 0,
      topScore: 0,
      gamesPlayed: 0
    };
  }

  toggleGame = (gameStarted, lastScore, topScore) => {
    this.setState({
      gameStarted
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle={"light-content"} hidden={this.state.gameStarted} animated showHideTransition={"slide"} />
        <MainMenu onPlayGame={_ => this.toggleGame(true)} />
        <BouncifyGame
          visible={this.state.gameStarted}
          onClose={(lastScore, topScore) => this.toggleGame(false, lastScore, topScore)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
