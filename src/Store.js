import Immutable, { OrderedMap, Set, Map, fromJS } from "immutable";
import invariant from "invariant";

export default class Store {
  constructor(initialState) {
    this.entries = Map(fromJS(initialState));
    this.subscribers = Map();
  }

  set(keyPath, value, opt_id_key) {
    let newValue;
    if (Array.isArray(value)) {
      invariant(opt_id_key, "Setting arrays requires supplying a key for uniquely identifying each item in the array");
      newValue = OrderedMap(value.map(item => {
        return [item[opt_id_key], fromJS(item)];
      }));
    } else {
      newValue = fromJS(value);
    }
    const previousValue = this.entries.getIn(keyPath);
    if (Immutable.is(newValue, previousValue)) {
      return;
    }

    this.entries = this.entries.updateIn(keyPath, value => {
      return newValue;
    });
    this.notifySubscribers(keyPath, value, previousValue ? previousValue.toJS() : undefined);
  }

  remove(keyPath) {
    const previousValue = this.entries.getIn(keyPath);
    if (previousValue) {
      this.entries = this.entries.deleteIn(keyPath);
      this.notifySubscribers(keyPath, undefined, previousValue.toJS());
    }
  }

  get(keyPath) {
    const result = this.entries.getIn(keyPath);
    if (result) {
      if (OrderedMap.isOrderedMap(result)) {
        return result.toArray().map(item => item.toJS());
      }
      return result.toJS();
    }
  }

  subscribe(keyPath, handler) {
    const key = this.computeKey(keyPath);
    if (!this.subscribers.has(key)) {
      this.subscribers = this.subscribers.set(key, Set());
    }
    this.subscribers = this.subscribers.update(key, handlers => handlers.add(handler));
  }

  unsubscribe(keyPath, handler) {
    const key = this.computeKey(keyPath);
    this.subscribers = this.subscribers.update(key, handlers => handlers.remove(handler));
  }

  notifySubscribers(keyPath, value, previousValue) {
    const key = this.computeKey(keyPath);
    const subscribers = this.subscribers.get(key, Set()).forEach(handler => {
      handler(keyPath, value, previousValue);
    });
  }

  computeKey(keyPath) {
    return keyPath.join(".");
  }
}
