# New List Page

The New List Page is where users can create a new list to be appended to the rest of the existing lists. The page contains:

* Title: "Create List"
* Text Input: "Name"
    * The values inputted into the "Name" field should be validated against these rules. If validation fails, show an error message specific to which validation rule was triggered.
        * Field cannot be empty
            * Error message: "The Name field cannot be empty."
        * Max input length of 50 characters (any character type is accepted)
            * Error message: "The Name must be 50 characters or less"
* Submit Button: "Create"
    * Should be disabled when Name field is either empty or has validation errors.
    * Clicking the button or hitting `ENTER` should submit the value entered in the Name field and attempt to create the new list.
        * If a list with the same name already exists, display the following message: "List already exists with that name. Please edit the Name and try again."
        * If there is a non-duplicate submission error from the API, display the following error message: "We are currently unable to create a new list for you. Our team has been notified of the issue and is looking into it. Please try again later."
        * If the new list is created successfully, redirect the user to the List Show page for the new list