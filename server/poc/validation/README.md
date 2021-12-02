# User Input Validation

The functions in this directory are used to validate user input to API
endpoints.

The signature of each any validation function is that it returns a
2-tuple of values, the 1st value being the error message during
validation (or `None` if there was none) and the 2nd being the
validated (and possibly transformed) user input (or `None` if there
was none or it shouldn't be trusted/used).
