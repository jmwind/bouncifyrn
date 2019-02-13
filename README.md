# BouncifyRN

[Ballz](https://itunes.apple.com/us/app/ballz/id1139609950) has enjoyed a lot of family competition in
our home. But the app is getting bloated with ads and I need a new side project. So I'm going to try and re-write
in React Native and see what happens. React Native isn't the best gaming plaform, it's probably going
to be terrible. This will be a fun test of the performance improvements coming in [Fabric](https://github.com/react-native-community/discussions-and-proposals/issues/4).

*Update: Feb 8, 2019*

I was able to make a lot more progress than originally anticipated. It's still a very shitty first version, but quite the surprise honestly how far it got quickly. There are so many rough edges left to fill! Used [React Native Game Engine](https://github.com/bberak/react-native-game-engine) as a super light-weight starting point of a game loop. The code is crappy, but it works.

Original game is on the left and React Native version (source in this repo) on the right.

<p align="center">
    <img src="https://user-images.githubusercontent.com/199530/52727452-44065e00-2f83-11e9-808c-d4709217862b.gif" alt="Single Touch Preview" height="450" />
    <img src="https://user-images.githubusercontent.com/199530/52727460-4799e500-2f83-11e9-83fc-53e4ca5c4907.gif" alt="Multi Touch Preview" height="450" />
</p>

## Quick Start iOS

```
git clone https://github.com/jmwind/bouncifyrn.git

cd bouncifyrn

npm install

react-native link

react-native run-ios
```

## TODOs

What's here is the shitty first 20%. There's a lot left.

- [x] Get balls moving around the screen with grade 2 level math
- [x] Define and draw playing surface and limit movement within
- [x] Start ball from bottom on click with tail
- [x] Start angle touch motion calculation and display
- [x] Colision detection on box, bounce off
- [x] Colision angular velocity near object edges (irregular bounces)
- [x] Have balls stop and hide when they hit bottom surface
- [ ] Add ball addition hot spots on screen with nice animation
- [x] Colision count and box disappear
- [x] Top score section with ball count and level and layout
- [x] Show ball count beside first ball (on top for now)
- [x] Calculate level and display at top
- [x] Box bounce count calculation and display
- [ ] First ball landing spot calculation and animation
- [x] Add box layers and advancing
- [ ] Determine end of game when boxes advance to bottom row and add screen and show end screen
- [ ] Add speed-up button
- [ ] Splash screen and icon
- [ ] Start scren
- [ ] End of game screen
- [x] Add cheat mode to add / remove balls for testing
- [ ] Fix all the crappy hard coded sizes and test on other device sizes
- [ ] Get with the times, go Typescript!
- [ ] Smooth out aiming movement
- [ ] Save high score locally
- [ ] Nice box tile explosion animation
- [ ] Ball power up hit explosion animation that drops down to floor
- [ ] Get working on Android
