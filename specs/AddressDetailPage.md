## Address Detail Page
The Address Detail page is where users can view and edit details about individual addresses. It should contain:

* The address string
* The BTC value of the address
* The network type of the address (Mainnet or Testnet)
* The number of Lists this address is on
* A button for deleting the address
    * Clicking the "Delete" button should remove the address from all Lists that it is on and delete it from the database. After clicking the button, if there is no error, redirect the user to the [Addresses Page](./AddressesPage)
    * If there is an error from the API when attempting to delete the address, show the following error message "We are unable to delete this address right now. The team has been notified and is looking into it. Please try again later."
* A [table of the Lists](#lists-table) that the address is currently on
* If there is an error from the API when retrieving details of the address, display the following error message: "We are unable to retrieve the address details right now. The team has been notified and is looking into it. Please try again later."

### Lists Table
The Lists Table is where users can view which Lists the given Address is on and choose to view individual List details or delete the Address from a given list. It should follow this structure:

  List              | Actions         
  ------------------|------------------------------
  Text: List Name   | Button: View + Button: Delete 
  Text: List Name   | Button: View + Button: Delete 
  Text: List Name   | Button: View + Button: Delete      

* Clicking the "View" button should take the user to the [List Detail Page](./ListDetailPage) for the given List
* Clicking the "Delete" button should delete the address from the given List and remove the List from the Lists Table.
    * If the address is only on 1 List, after Deleting the address the user should be redirected to the [Addresses Page](./AddressesPage)
    * If there is an error from the API when attempting to delete the address, display the following error message: "We are unable to delete this address from {List name} right now. The team has been notified and is looking into it. Please try again later."
