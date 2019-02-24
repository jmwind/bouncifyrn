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
    if(! gameStarted) {
      this.setState({
        gamesPlayed: this.state.gamesPlayed + 1
      });
    }
  };

  render() {
    return (
      <View style={styles.container}>        
        <MainMenu onPlayGame={_ => this.toggleGame(true)} gamesPlayed={this.state.gamesPlayed} />
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
