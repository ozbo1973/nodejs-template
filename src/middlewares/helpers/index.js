const updatesAllowed = (fields, allowed) => {
  const updates = Object.keys(fields);
  const isAllowed = updates.every((update) => allowed.includes(update));
  return updates, isAllowed;
};

module.exports = {
  updatesAllowed,
};
