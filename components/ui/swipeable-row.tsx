import React, { Component, PropsWithChildren } from "react";
import { Animated, StyleSheet, Text, View, I18nManager } from "react-native";

import { RectButton } from "react-native-gesture-handler";

import Swipeable from "react-native-gesture-handler/Swipeable";

type SwipeableRowProps = {
  onDelete: () => void;
  onEdit: () => void;
};

export default class SwipeableRow extends Component<
  PropsWithChildren<SwipeableRowProps>
> {
  private renderRightAction = (
    text: string,
    color: string,
    x: number,
    progress: Animated.AnimatedInterpolation<number>,
    action: () => void
  ) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });
    const pressHandler = () => {
      action();
      this.close();
    };

    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <RectButton
          style={[styles.rightAction, { backgroundColor: color }]}
          onPress={pressHandler}
        >
          <Text style={styles.actionText}>{text}</Text>
        </RectButton>
      </Animated.View>
    );
  };

  private renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    _dragAnimatedValue: Animated.AnimatedInterpolation<number>,
    onDelete: () => void,
    onEdit: () => void
  ) => (
    <View
      style={{
        width: 150,
        flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
      }}
    >
      {this.renderRightAction("Edit", "#ffab00", 150, progress, onEdit)}
      {this.renderRightAction("Delete", "#dd2c00", 150, progress, onDelete)}
    </View>
  );

  private swipeableRow?: Swipeable;

  private updateRef = (ref: Swipeable) => {
    this.swipeableRow = ref;
  };

  private close = () => {
    this.swipeableRow?.close();
  };

  render() {
    const { children } = this.props;
    return (
      <Swipeable
        ref={this.updateRef}
        friction={2}
        enableTrackpadTwoFingerGesture
        rightThreshold={40}
        renderRightActions={(progressAnimatedValue, dragAnimatedValue) =>
          this.renderRightActions(
            progressAnimatedValue,
            dragAnimatedValue,
            this.props.onDelete,
            this.props.onEdit
          )
        }
        // onSwipeableOpen={(direction) => {
        //   console.log(`Opening swipeable from the ${direction}`);
        // }}
        // onSwipeableClose={(direction) => {
        //   console.log(`Closing swipeable to the ${direction}`);
        // }}
      >
        {children}
      </Swipeable>
    );
  }
}

const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    backgroundColor: "#497AFC",
    justifyContent: "center",
  },
  actionText: {
    color: "white",
    fontSize: 16,
    backgroundColor: "transparent",
    padding: 10,
  },
  rightAction: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});
