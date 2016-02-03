import React, {
  Component,
  StyleSheet,
  View,
} from 'react-native';

import Dot from './dot';

const styles = StyleSheet.create({
  dots: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default class Dots extends Component {
  static propTypes = {
    total: React.PropTypes.number.isRequired,
    active: React.PropTypes.number.isRequired,
    style: View.propTypes.style,
  };

  static defaultProps = {
    total: 0,
    active: -1,
  };

  render() {
    const { total, active, color, activeColor } = this.props;
    const range = Array.from(new Array(total), (x, i) => i);

    return (
      <View style={[styles.dots, this.props.style]}>
        {range.map(i =>
          <Dot key={i} color={i === active ? activeColor : color}/>
        )}
      </View>
    );
  }
}
