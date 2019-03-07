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
      gamesPlayed: 0
    };
  }

  componentDidMount() {
    AsyncStorage.getItem(TOP_SCORE_KEY).then((val) => {
        if(val != null) {
          this.setState({ topScore: parseInt(val) });
        }
    })
}

  toggleGame = (gameStarted, lastScore) => {    
    this.setState({
      gameStarted
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
    const { gamesPlayed, lastScore, topScore, gameStarted } = this.state;
    return (
      <View style={styles.container}>        
        <MainMenu 
          onPlayGame={_ => this.toggleGame(true)} 
          gamesPlayed={gamesPlayed} 
          lastScore={lastScore} 
          topScore={topScore} />
        <BouncifyGame
          visible={gameStarted}
          topScore={topScore}
          onClose={(lastScore) => this.toggleGame(false, lastScore)}
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
