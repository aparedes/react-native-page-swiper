import React, {
  Component,
  StyleSheet,
  PropTypes,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#C0C0C0',
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
});

export default class Dot extends Component {
  render() {
    return <View style={[styles.button, this.props.style]} />;
  }
}
