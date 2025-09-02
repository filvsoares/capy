function createContext(data) {
  return {
    ...data,
    with: (value) => createContext({ ...data, ...value })
  };
}
export {
  createContext as c
};
