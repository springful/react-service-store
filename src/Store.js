import Immutable, { OrderedMap, Set, Map, fromJS } from "immutable";
import invariant from "invariant";

import shallowEqual from "./shallowEqual";

export default class Store {
  constructor(initialState) {
    this.entries = Map(fromJS(initialState));
    this.subscribers = Map();
  }

  set(keyPath, value, opt_id_key) {
    invariant(keyPath && keyPath.length, "You must provide a key path with at least one part");
    const previousValue = this.entries.getIn(keyPath);
    if (previousValue && shallowEqual(value, previousValue)) {
      return;
    }

    this.entries = this.entries.setIn(keyPath, value);
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
    return this.entries.getIn(keyPath);
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
