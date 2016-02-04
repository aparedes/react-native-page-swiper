import React, {
  Component,
  StyleSheet,
  PropTypes,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  button: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 5,
    marginRight: 5,
  },
});

export default class Dot extends Component {
  render() {
    return <View style={[styles.button, this.props.style]} />;
  }
}
