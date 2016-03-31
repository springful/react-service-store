import { Component, PropTypes, Children } from "react"

export default class StoreContext extends Component {
  getChildContext() {
    return { store: this.store }
  }

  constructor(props, context) {
    super(props, context);

    this.store = props.store;
  }

  render() {
    const { children } = this.props
    return Children.only(children);
  }
}

StoreContext.propTypes = {
  store: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired
}

StoreContext.childContextTypes = {
  store: PropTypes.object.isRequired
}
