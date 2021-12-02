from base58 import b58decode_check
from .base import validate_string


def validate_address_search_query(request):
    error, query = validate_string(request.args.get("q"), max_length=90, required=False)
    if error:
        return error, None

    if query is None:
        return None, None
    else:
        return None, query.split()[0]


def validate_address_search_network(request):
    network = request.args.get("network")
    if network is None or network.strip() == "":
        return None, None
    elif network == "testnet":
        return None, True
    elif network == "mainnet":
        return None, False
    else:
        return "Network must be either 'testnet' or 'mainnet'.", None


def validate_address(raw_value, testnet):
    error, value = validate_string(raw_value, max_length=90)
    if error:
        return error, value

    # FIXME this is just a formatting check, not a semantic test.  We
    # should further validate that the address value is appropriate
    # for the given network as well.
    #
    # FIXME this does NOT work for Bech32 addresses which are *not*
    # formatted according to base58check !
    try:
        b58decode_check(value)
        return None, value
    except ValueError as e:
        return "is not a valid bitcoin address.", None
