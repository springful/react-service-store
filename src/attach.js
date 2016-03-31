import { Component, PropTypes, createElement } from "react";
import hoistStatics from "hoist-non-react-statics";

import shallowEqual from "./shallowEqual";

const computeMergedProps = (parentProps, storeProps) => {
  return Object.assign({}, parentProps, storeProps);
}

const computeStoreProps = (store, keyPaths) => {
  const results = {};
  for (let key in keyPaths) {
    results[key] = store.get(keyPaths[key]);
  }
  return results;
}

const getDisplayName = (WrappedComponent) => {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export default (mapKeyPathsToProps) => {
  return (WrappedComponent) => {
    class Attach extends Component {
      constructor(props, context) {
        super(props, context);
        this.store = context.store;
        this.handleChange = this.handleChange.bind(this);
        this.state = { mergedProps: this.computeMergedProps() }
      }

      render() {
        return createElement(WrappedComponent, this.state.mergedProps);
      }

      componentDidMount() {
        this.subscribe()
      }

      componentWillUnmount() {
        this.unsubscribe();
      }

      componentWillReceiveProps(nextProps) {
        if (!shallowEqual(nextProps, this.props)) {
          this.setState({
            mergedProps: this.computeMergedProps(nextProps)
          });
        }
      }

      subscribe() {
        const keyPaths = this.computeKeyPaths();
        for (let key in keyPaths) {
          this.store.subscribe(keyPaths[key], this.handleChange);
        }
      }

      unsubscribe() {
        const keyPaths = this.computeKeyPaths();
        for (let key in keyPaths) {
          this.store.unsubscribe(keyPaths[key], this.handleChange);
        }
      }

      computeMergedProps(opt_props) {
        const keyPaths = this.computeKeyPaths();
        return computeMergedProps(opt_props || this.props, computeStoreProps(this.store, keyPaths));
      }

      computeKeyPaths() {
        return mapKeyPathsToProps(this.props);
      }

      handleChange(keyPath, value) {
        this.setState({
          mergedProps: this.computeMergedProps()
        });
      }
    }

    Attach.displayName = `Attach(${getDisplayName(WrappedComponent)})`
    Attach.WrappedComponent = WrappedComponent

    Attach.contextTypes = {
      store: PropTypes.object
    }

    Attach.propTypes = {
      store: PropTypes.object
    }

    return hoistStatics(Attach, WrappedComponent);
  }
}
