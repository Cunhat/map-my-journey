import { Check, Pencil, Trash2, X } from "lucide-react-native";
import React, { Component, PropsWithChildren } from "react";
import { Animated, StyleSheet, Text, View, I18nManager } from "react-native";

import { RectButton } from "react-native-gesture-handler";

import Swipeable from "react-native-gesture-handler/Swipeable";

type SwipeableRowProps = {
  onDelete: () => void;
  onEdit: () => void;
  onVisited: () => void;
  visited: boolean;
};

export default class SwipeableRow extends Component<
  PropsWithChildren<SwipeableRowProps>
> {
  private renderRightAction = (
    text: string,
    color: string,
    x: number,
    progress: Animated.AnimatedInterpolation<number>,
    action: () => void,
    visited: boolean
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
          {text === "delete" ? (
            <Trash2 height={24} width={24} className="text-white" />
          ) : text === "visited" ? (
            !visited ? (
              <Check height={24} width={24} className="text-white" />
            ) : (
              <X height={24} width={24} className="text-white" />
            )
          ) : (
            <Pencil height={24} width={24} className="text-white" />
          )}
        </RectButton>
      </Animated.View>
    );
  };

  private renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    _dragAnimatedValue: Animated.AnimatedInterpolation<number>,
    onDelete: () => void,
    onEdit: () => void,
    onVisited: () => void,
    visited: boolean
  ) => (
    <View
      style={{
        width: 200,
        flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
      }}
    >
      {this.renderRightAction(
        "visited",
        visited ? "#dd2c00" : "#16a34a",
        50,
        progress,
        onVisited,
        visited
      )}
      {this.renderRightAction("edit", "#ffab00", 50, progress, onEdit, visited)}
      {this.renderRightAction(
        "delete",
        "#dd2c00",
        50,
        progress,
        onDelete,
        visited
      )}
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
            this.props.onEdit,
            this.props.onVisited,
            this.props.visited
          )
        }
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
