function escapeRegExp(string) {
  return string.replace(/[-.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

exports.regexWrap = (inputStr) => {
  const escapedInput = `^${escapeRegExp(inputStr)}`;

  return { $regex: escapedInput, $options: "i" };
};
