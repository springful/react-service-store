# react-service-store

A simple state-management framework for React, inspired by [react-redux](https://github.com/reactjs/react-redux).

## Installation

React Service Store requires **React 0.14 or later.**

```
npm install --save react-service-store
```

## How Does It Work?

### `<StoreContext store>`

Makes the store available to all components below it. You can manually set the store on the context, but using this makes it a bit easier.

### `attach(mapKeyPathsToProps)`

Connects a React component to the store. This wraps the component and makes sure it gets updated when the value at a given key path changes.

#### Arguments

* [`mapKeyPathsToProps(ownProps): keyPathsToProps`] \(*Function*): This function gets called any time any of the values at the provided key paths change. It is the responsibility of the user to return a map of property keys to key paths. This framework will ensure that the key paths are turned into the values that exist at those key paths. The resulting object is merged with any other properties passed into the component, and the resulting objects is then set on the wrapped component.

```js
function mapKeyPathsToProps(ownProps) {
  return { todos: ["todos", ownProps.todo_id] }
}

### `Store`

Create a store instance and hold on to it. You can pass this instance into `StoreContext` so that it's available to all components.

#### `set(keyPath, value)`

Any time application state changes, you can update the store by passing in a key path (an array of strings) and a value. If you want components to reflect the store changes, make sure you update the same store instance.

The store provides other methods like `get`, `subscribe`, and so on. These are used by `attach`, but can also be called directly to check the store state and subscribe to changes in it.
