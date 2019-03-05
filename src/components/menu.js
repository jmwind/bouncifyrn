import React, { PureComponent } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Platform,
  StyleSheet
} from "react-native";
import Button from "./button";
import Item from "./item";
import * as Animatable from "react-native-animatable";


export default class MainMenu extends PureComponent {
  render() {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        >
        {
          this.props.gamesPlayed == 0 &&
          <Animatable.Text 
            style={styles.title} animation="slideInDown" 
            iterationCount="infinite" direction="alternate">Bouncify
          </Animatable.Text>
        }
        {
          this.props.gamesPlayed > 0 &&
          <View style={styles.textContainer}>
            <Animatable.Text 
              style={styles.lastScore} animation="pulse" 
              iterationCount="infinite" direction="alternate">Your Score
            </Animatable.Text>
            <Animatable.Text 
              style={styles.lastScore} animation="pulse" 
              iterationCount="infinite" direction="alternate">{this.props.lastScore}
            </Animatable.Text>
            <Animatable.Text 
              style={styles.score} animation="pulse" 
              iterationCount="infinite" direction="alternate">Best
            </Animatable.Text>
            <Animatable.Text 
              style={styles.score} animation="pulse" 
              iterationCount="infinite" direction="alternate">{this.props.topScore}
            </Animatable.Text>
          </View>
        }
        <Button onPress={this.props.onPlayGame}>{this.props.gamesPlayed ? 'Restart' : 'Play'}</Button>
        <Item
          onPress={_ =>
            Linking.openURL(
              "https://github.com/jmwind/bouncifyrn"
            )}
        >
          ❤️ @jmwind 🙃
        </Item>               
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000"
  },
  contentContainer: {
    maxWidth: 400,
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignSelf: "center",
    alignItems: "center"
  },
  title: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    fontSize: 70,
    color: "#FFF"
  },
  score: {
    marginTop: 3,
    marginBottom: 3,
    marginLeft: 30,
    marginRight: 30,
    fontSize: 24,
    color: "#FFF"
  },
  lastScore: {
    marginTop: 3,
    marginBottom: 3,
    marginLeft: 30,
    marginRight: 30,
    fontSize: 52,
    color: "#FFF"
  },
  textContainer: {      
      alignItems: 'center'
  }
});
