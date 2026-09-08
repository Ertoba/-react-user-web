// Keep style-only props off the underlying DOM while retaining MUI's defaults.
export const omitStyleProps = (...names) => (prop) =>
  !['ownerState', 'theme', 'sx', 'as', ...names].includes(prop);
