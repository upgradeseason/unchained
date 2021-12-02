import PropTypes from "prop-types";

export const listPropTypes = PropTypes.shape({
  id: PropTypes.number,
  name: PropTypes.string,
}).isRequired;
