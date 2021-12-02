# Controllers & API Routes

The controller files in this directory implement the API of this
application.

Controllers always return JSON responses.  They are written to first
validate user input (using [validation functions](../validation)) and
then, if necessary, call [services](../services) to mutate data.

The complete API of this application follows.

## Lists

### `GET /lists`

Returns a list of lists.

Example output:

```
{
  "status": 200,
  "lists": [
    {
	  "id": 7,
	  "name": List 1,
	  "address_count": 0,
    },
    {
	  "id": 22,
	  "name": List 2,
	  "address_count": 3,
    },
    ...
  ]
}
```

### `POST /lists`

Create a new list.

Example input:

```
{
  "name": "List 3"
}
```

Example output:

```
{
  "status": 200,
  "id": 73
}  
```

### `GET /lists/<id>`

Return the list with the given `id`.

Example output:

```
{
  "status": 200,
  "list": {
    "id": 22,
	"name": List 2,
	"addresses": [
      {
	    "value": "1abc...,
	    "testnet": false
	  },
      {
	    "value": "3def...,
	    "testnet": false
	  },
      ...
    ]
  }
}
```

### `DELETE /lists/<id>`

Delete the list with the given `id`.

```
{
  "status": 200
}
```


## Addresses

### `GET /addresses`

Returns a list of addresses.

Example output:

```
{
  "status": 200,
  "addresses": [
    {
	  "value": "1abc...",
	  "testnet": false,
	  "list_count": 1,
    },
    {
	  "value": "3def...",
	  "testnet": false,
	  "list_count": 3,
    },
    ...
  ]
}
```

### `GET /addresses/<value>`

Return the address with the given `value`.

Example output:

```
{
  "status": 200,
  "address": {
    "value": "1abc...",
	"testnet": false,
	"lists": [
      {
	    "id": 7,
	    "name": "List 1"
	  },
      {
	    "id": 22,
	    "name": "List 2"
	  },
      ...
    ]
  }
}
```

### `DELETE /addresses/<value>`

Delete the address with the given `value`.

```
{
  "status": 200
}
```

## Address Listings

### `POST /lists/<id>/addresses/<value>`

Associate the address with the given `value` with the list with the given `id`.

If the address does not already exist, it will be created.  In this
case, the request body may further include data to specify the network
of the address.  If such a request body is not provided, the network
will be assumed to be `testnet`.

If the address is already on the list, this returns a 400 error.

Example input (not required):

```
{
  "testnet": false,
}
```

Example output:

```
{
  "status": 200
}
```

### `POST /lists/<id>/addresses/<value>`

No longer associate the address with the given `value` with the list with the given `id`.

If the address is not already associated with the list, this returns a 400 error.

Example output:

```
{
  "status": 200
}
```
