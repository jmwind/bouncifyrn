# BouncifyRN

[Ballz](https://itunes.apple.com/us/app/ballz/id1139609950) has enjoyed a lot of family competition in
our home. But the app is getting bloated and I need a new side project. So I'm going to try and re-write
in React Native and see what happens. React Native isn't the best gaming plaform, it's probably going
to be terrible. But it will also be a fun test of the performance improvements coming in [Fabric](https://github.com/react-native-community/discussions-and-proposals/issues/4).

![Ballz img](https://is3-ssl.mzstatic.com/image/thumb/Purple111/v4/38/e0/de/38e0ded6-96be-9593-830c-3e5a11dcc44c/pr_source.png/300x0w.png)

## Quick Start iOS

```
git clone https://github.com/jmwind/bouncifyrn.git

cd bouncifyrn

npm install

react-native link

react-native run-ios
```

## TODOs

- [x] Get balls moving around the screen with grade 2 level math
- [] Define and draw playing surface and limit movement within
- [] Start ball from bottom on click with tail
- [] Start angle touch motion calculation and display
- [] Colision detection on box, bounce off
- [] Colision angular velocity near object edges (irregular bounces)
- [] Have balls stop and hide when they hit bottom surface
- [] Add ball addition hot spots on screen
- [] Colision count and box disappear
- [] Top score section with ball count and level
- [] Box bounce count calculation and display
- [] First ball landing spot calculation and animation
- [] Add box layers and advancing
