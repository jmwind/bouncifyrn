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
        <Animatable.Text style={styles.title} animation="slideInDown" iterationCount="infinite" direction="alternate">Bouncify</Animatable.Text>
        <Button onPress={this.props.onPlayGame}>Play</Button>
        <Item
          onPress={_ =>
            Linking.openURL(
              "https://github.com/jmwind/bouncifyrn"
            )}
        >
          Shopify React Native Experiment
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
  }
});
