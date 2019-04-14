import React, { PureComponent } from "react";
import { View, StyleSheet, AsyncStorage } from "react-native";
import MainMenu from "./components/menu";
import BouncifyGame from "./game";
import { Constants } from "./constants";

const TOP_SCORE_KEY = "topScore";
const TOP_SCORE_BRICKS_KEY = "topScoreBricks";

export default class Container extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      gameStarted: false,
      lastScore: 0,
      topScore: 0,
      topScoreBricks: 0,
      gamesPlayed: 0,
      mode: Constants.MODE_LINES
    };
  }

  componentDidMount() {
    AsyncStorage.getItem(TOP_SCORE_KEY).then((val) => {
        if(val != null) {
          this.setState({ topScore: parseInt(val) });
        }
    });
    AsyncStorage.getItem(TOP_SCORE_BRICKS_KEY).then((val) => {
      if(val != null) {
        this.setState({ topScoreBricks: parseInt(val) });
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
      if(mode == Constants.MODE_LINES && lastScore > this.state.topScore) {
        this.setState({
          topScore: lastScore
        });
        AsyncStorage.setItem(TOP_SCORE_KEY, lastScore.toString());
      } else if(mode == Constants.MODE_BRICKS && lastScore > this.state.topScoreBricks) {
        this.setState({
          topScoreBricks: lastScore
        });
        AsyncStorage.setItem(TOP_SCORE_BRICKS_KEY, lastScore.toString());
      }
    }
  };

  render() {
    const { gamesPlayed, lastScore, topScore, topScoreBricks, gameStarted, mode } = this.state;
    return (
      <View style={styles.container}>        
        <MainMenu 
          onPlayGame={(new_mode) => this.toggleGame(true, lastScore, new_mode)} 
          gamesPlayed={gamesPlayed} 
          lastScore={lastScore} 
          topScore={topScore}
          topScoreBricks={topScoreBricks} />
        <BouncifyGame
          visible={gameStarted}
          topScore={mode == Constants.MODE_LINES ? topScore : topScoreBricks}
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
