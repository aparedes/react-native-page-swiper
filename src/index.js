import React, {
  Animated,
  Component,
  Dimensions,
  PanResponder,
  StyleSheet,
  View,
} from 'react-native';

import Dots from './dots';

const styles = StyleSheet.create({
  page: {flex: 1, overflow: 'hidden'},
  dots: {position: 'absolute', bottom: 50},
});

export default class Swiper extends Component {
  state = {
    index: this.props.index,
    scrollValue: new Animated.Value(this.props.index),
    viewWidth: Dimensions.get('window').width,
  };

  static propTypes = {
    children: React.PropTypes.node.isRequired,
    index: React.PropTypes.number,
    pager: React.PropTypes.bool,
    onPageChange: React.PropTypes.func,
    activeDotColor: React.PropTypes.string,
  };

  static defaultProps = {
    index: 0,
    pager: true,
    onPageChange: () => {},
  };

  componentWillMount() {
    const release = (e, {vx, dx}) => {
      const relativeGestureDistance = dx / this.state.viewWidth;

      let newIndex = this.state.index;

      if (relativeGestureDistance < -0.5 || (relativeGestureDistance < 0 && vx <= -0.5)) {
        newIndex = newIndex + 1;
      } else if (relativeGestureDistance > 0.5 || (relativeGestureDistance > 0 && vx >= 0.5)) {
        newIndex = newIndex - 1;
      }

      this.goToPage(newIndex);
    };

    this._panResponder = PanResponder.create({
      // Claim responder if it's a horizontal pan
      onMoveShouldSetPanResponder: (e, {dx, dy}) => {
        const length = React.Children.count(this.props.children) - 1;

        if (this.state.index === length && dx < 0) {
          return false;
        }

        if (this.state.index === 0 && dx > 0) {
          return false;
        }

        return Math.abs(dx) > Math.abs(dy);
      },

      // Touch is released, scroll to the one that you're closest to
      onPanResponderRelease: release,
      onPanResponderTerminate: release,

      // Dragging, move the view with the touch
      onPanResponderMove: (e, {dx}) => {
        let offsetX = -dx / this.state.viewWidth + this.state.index;

        this.state.scrollValue.setValue(offsetX);
      },
    });
  }

  goToPage(pageNumber) {
    let index = Math.min(pageNumber, this.props.children.length - 1);
    index = Math.max(0, index);

    this.setState({index});

    Animated.spring(this.state.scrollValue, {
      toValue: index,
      friction: this.props.springFriction,
      tension: this.props.springTension,
    }).start();

    this.props.onPageChange(index);
  }

  handleLayout(event) {
    const { width } = event.nativeEvent.layout;

    if (width) {
      this.setState({ viewWidth: width });
    }
  }

  buildCurrentStack() {
    return React.Children.map(this.props.children, (el, i) =>
      React.cloneElement(el, {key: i, style: [el.props.style, styles.page]})
    );
  }

  render() {
    const translateX = this.state.scrollValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -this.state.viewWidth],
    });

    const sceneContainerStyle = {
      width: this.state.viewWidth * this.props.children.length,
      flex: 1,
      flexDirection: 'row',
    };

    const dots = this.props.pager ? (
      <Dots
        active={this.state.index}
        activeColor={this.props.activeDotColor}
        total={this.props.children.length}
        style={[styles.dots, {width: this.state.viewWidth}]} />
    ) : null;

    return (
      <View style={styles.page} onLayout={() => this.handleLayout}>
        <Animated.View
          {...this._panResponder.panHandlers}
          style={[sceneContainerStyle, {transform: [{translateX}]}]}>
          {this.buildCurrentStack()}
        </Animated.View>
        {dots}
      </View>
    );
  }
}
