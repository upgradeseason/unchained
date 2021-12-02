# End-to-End Testing

We are using Cypress for end-to-end (E2E) testing of this application.

Our philosophy when it comes to this kind of testing is to focus on
the "happy path".

Example: when testing a form, we should fill out all the required
inputs and submit and then make assertions about what we see.

We should **not** test every possible bad form input and edge case --
that would be far too slow in Cypress and should instead be tested at
a lower level with React Testing Library and component-level unit
testing.
