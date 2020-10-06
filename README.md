# BouncifyRN

[Ballz](https://itunes.apple.com/us/app/ballz/id1139609950) has enjoyed a lot of use and family competition in
our home. This project is meant to help learn React Native by writting a Ballz-inspired game
with some tweaks and see what happens. This app should never be published to the app store as it's
just for learning purposes. React Native isn't the best gaming plaform, it's probably going
to be terrible. This will be a fun test of the performance improvements coming in [Fabric](https://github.com/react-native-community/discussions-and-proposals/issues/4). Maybe even use fancy
hooks coming in React Native 0.59!

Beware, I'm not responsible for the hours you'll waste playing the game or evolving the game. It's
a tad addictive.

_Update: Feb 8, 2019_

I was able to make a lot more progress than originally anticipated. It's still a very shitty first version, but quite the surprise honestly how far it got quickly. There are so many rough edges left to fill! Used [React Native Game Engine](https://github.com/bberak/react-native-game-engine) as a super light-weight starting point of a game loop. The code is crappy, but it works.

_Update: March 15, 2019_

Holy batman, the memory leaks are insane and it's time for performance work. With a bit of help from Siavash, animations and rebound aiming have been added and the game is almost there and ready for more hours of wasted time.

Original game is on the left and React Native version (source in this repo) on the right.

<p align="center">
    <img src="https://user-images.githubusercontent.com/199530/52727452-44065e00-2f83-11e9-808c-d4709217862b.gif" alt="Original Game" height="450" />
    <img src="https://user-images.githubusercontent.com/199530/54870593-0913f900-4d7f-11e9-96dc-a73e916ca7b7.gif" alt="React Native Version" height="450" />
</p>

## Quick Start iOS

```
git clone https://github.com/jmwind/bouncifyrn.git

cd bouncifyrn

yarn

yarn ios
```

Or you can pick another simulator by running
```
xcrun simctl list

npx react-native run-ios --simulator "iPad Pro (12.9-inch)"
```

## TODOs

This is a play-by-play of the small steps taken from a blank screen to getting an addictive game built and running.

🍄

- [x] Get balls moving around the screen with grade 2 level math
- [x] Define and draw playing surface and limit movement within
- [x] Start ball from bottom on click with tail
- [x] Start angle touch motion calculation and display
- [x] Colision detection on box, bounce off
- [x] Colision angular velocity near object edges (irregular bounces)
- [x] Have balls stop and hide when they hit bottom surface
- [x] Add ball addition hot spots on screen with nice animation
- [x] Colision count and box disappear
- [x] Top score section with ball count and level and layout
- [x] Show ball count beside first ball (on top for now)
- [x] Calculate level and display at top
- [x] Box bounce count calculation and display
- [x] Add box layers and advancing
- [x] Determine end of game when boxes advance to bottom row and add screen and show end screen
- [x] Splash screen and icon
- [x] Start scren
- [x] End of game screen
- [x] Add cheat mode to add / remove balls for testing
- [x] Ball power up hit explosion animation that drops down to floor
- [x] Smooth out aiming movement
- [x] Save high score locally and show in the end screen
- [x] Nice box tile explosion animation
- [x] Add a "bricks" mode where levels are full shapes with pre-set number of balls (good demo mode)
- [x] Add speed-up button that appears after all balls are in play
- [x] Save the two game type scores separately
- [x] Wall rebounding aiming (eg, bounce the aim line off the wall to help with gnarly angles)
- [x] Organize constants as per best practices for React
- [x] Move to 0.59 and use cool hooks!
- [x] Move to the community packages for async and other deprecations
- [x] Get working on Android!! 💪🏼
- [ ] Add level progress indicator and use % complete instead of # of blocks for brick level completion (IN-PROGRESS)
- [ ] Fix all the crappy hard coded sizes and make it work on iPad (flexible layouts) (IN-PROGRESS)
- [ ] Add level progress bonuses and threshold win animations
- [ ] Refactor entities into types
- [ ] Add getting started instructions to the game and a swiped down animation lottie
- [ ] Get with the times, go Typescript!
- [ ] First ball landing spot calculation instead of having the same ball decide on next launch location
- [ ] Animation of powerups to the first ball landing transition
- [ ] Add tests and CI (buildkite and mac stadium?)
- [ ] Automate production builds
- [ ] Path finding algorithm to call the balls "home". Not useful, but fun to try.
