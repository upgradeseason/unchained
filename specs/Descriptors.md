# Descriptors
An output descriptor is a human readable string that represents an output script (a scriptPubKey) and everything needed in order to solve for that script. 

## Descriptors Page

The Descriptors Page is where users can view all of the descriptors they've created and how many lists each descriptor is currently on. It should contain the following information:

* Page title: "Descriptors" 
* List of Descriptors
    * Each Descriptor in the list should contain the following:
        * The descriptor string
        * The total BTC value of all addresses for the descriptor
        * The network type of the descriptor (Mainnet or Testnet)
        * The number of lists the descriptor is on ("1 list" if only on one list, "{x} lists" if on more than 1)
        * A link to the [Descriptor Detail Page](./#descriptor-detail-page) for the given descriptor. Clicking on the descriptor should take the user to the linked descriptor Detail Page.
* If there is an error when retrieving the descriptors from the API, show the following error message: "We are unable to retrieve your descriptors at this time. The team has been notified. Please try again later."

## Descriptor Detail Page
The Descriptor Detail page is where users can view and edit details about individual descriptors. It should contain:

* The descriptor string
* The total BTC value of all addresses for the descriptor
* The network type of the descriptor (Mainnet or Testnet)
* The number of Lists this descriptor is on
* A button for deleting the descriptor
    * Clicking the "Delete" button should remove the descriptor from all Lists that it is on and delete it from the database. After clicking the button, if there is no error, redirect the user to the [Descriptors Page](./#descriptors-page)
    * If there is an error from the API when attempting to delete the descriptor, show the following error message "We are unable to delete this descriptor right now. The team has been notified and is looking into it. Please try again later."
* A [table of the Lists](#lists-table) that the descriptor is currently on
* If there is an error from the API when retrieving details of the descriptor, display the following error message: "We are unable to retrieve the descriptor details right now. The team has been notified and is looking into it. Please try again later."

### Lists Table
The Lists Table is where users can view which Lists the given descriptor is on and choose to view individual List details or delete the descriptor from a given list. It should follow this structure:

  List              | Actions         
  ------------------|------------------------------
  Text: List Name   | Button: View + Button: Delete 
  Text: List Name   | Button: View + Button: Delete 
  Text: List Name   | Button: View + Button: Delete      

* Clicking the "View" button should take the user to the [List Detail Page](./ListDetailPage) for the given List
* Clicking the "Delete" button should delete the descriptor from the given List and remove the List from the Lists Table.
    * If the descriptor is only on 1 List, after Deleting the descriptor the user should be redirected to the [Descriptors Page](./#descriptors-page)
    * If there is an error from the API when attempting to delete the descriptor, display the following error message: "We are unable to delete this descriptor from {List name} right now. The team has been notified and is looking into it. Please try again later."

## Creating new Descriptors from the List Detail Page

A separate table for viewing current descriptors and adding a descriptor should be added to the List Detail Page. It should function the same as the Address Table.
  