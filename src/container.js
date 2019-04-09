import React, { PureComponent } from "react";
import { View, StyleSheet, AsyncStorage } from "react-native";
import MainMenu from "./components/menu";
import BouncifyGame from "./game";

const TOP_SCORE_KEY = "topScore";

export default class Container extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      gameStarted: false,
      lastScore: 0,
      topScore: 0,
      gamesPlayed: 0,
      mode: "regular"
    };
  }

  componentDidMount() {
    AsyncStorage.getItem(TOP_SCORE_KEY).then((val) => {
        if(val != null) {
          this.setState({ topScore: parseInt(val) });
        }
    })
}

  toggleGame = (gameStarted, lastScore, mode) => {    
    this.setState({
      gameStarted,
      mode
    });
    if(! gameStarted) {
      this.setState({
        gamesPlayed: this.state.gamesPlayed + 1,
        lastScore: lastScore
      });
      if(lastScore > this.state.topScore) {
        this.setState({
          topScore: lastScore
        });
        AsyncStorage.setItem(TOP_SCORE_KEY, lastScore.toString());
      }
    }
  };

  render() {
    const { gamesPlayed, lastScore, topScore, gameStarted, mode } = this.state;
    return (
      <View style={styles.container}>        
        <MainMenu 
          onPlayGame={(new_mode) => this.toggleGame(true, lastScore, new_mode)} 
          gamesPlayed={gamesPlayed} 
          lastScore={lastScore} 
          topScore={topScore} />
        <BouncifyGame
          visible={gameStarted}
          topScore={topScore}
          mode={mode}
          onClose={(lastScore) => this.toggleGame(false, lastScore, mode)}
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
