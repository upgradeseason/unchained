from json import loads, dumps
from unittest.mock import patch, MagicMock
from poc.app import APP


@patch("poc.controllers.lists.List.search")
class TestIndexLists:
    def test_with_no_query(self, mock_search):
        list1 = MagicMock()
        list2 = MagicMock()
        serialized_list1 = dict(foo="bar")
        serialized_list2 = dict(foo="baz")
        list1.serialize.return_value = serialized_list1
        list2.serialize.return_value = serialized_list2
        mock_search.return_value = [list1, list2]
        with APP.test_client() as client:
            response = client.get("/lists")
            assert loads(response.data) == dict(
                lists=[serialized_list1, serialized_list2], status=200
            )
            mock_search.assert_called_once_with(None)

    def test_with_query(self, mock_search):
        list1 = MagicMock()
        list2 = MagicMock()
        serialized_list1 = dict(foo="bar")
        serialized_list2 = dict(foo="baz")
        list1.serialize.return_value = serialized_list1
        list2.serialize.return_value = serialized_list2
        mock_search.return_value = [list1, list2]
        with APP.test_client() as client:
            response = client.get("/lists?q=foobar+baz")
            assert loads(response.data) == dict(
                lists=[serialized_list1, serialized_list2], status=200
            )
            mock_search.assert_called_once_with(["foobar", "baz"])


@patch("poc.controllers.lists.DB.session.commit")
@patch("poc.controllers.lists.create_list_service")
@patch("poc.controllers.lists.validate_new_list")
class TestCreateList:
    def setup(self):
        self.data = dict(name="foobar")

    def test_with_errors(
        self, mock_validate_new_list, mock_create_list_service, mock_commit
    ):
        error = "some error"
        mock_validate_new_list.return_value = error, None
        with APP.test_client() as client:
            response = client.post(
                "/lists",
                data=dumps(self.data),
                content_type="application/json",
                headers={"Accept": "application/json"},
            )
            assert loads(response.data) == dict(error=error, status=400)

            mock_validate_new_list.assert_called_once_with(self.data)
            mock_create_list_service.assert_not_called()
            mock_commit.assert_not_called()

    def test_without_errors(
        self, mock_validate_new_list, mock_create_list_service, mock_commit
    ):
        mock_validate_new_list.return_value = None, self.data
        list = MagicMock()
        list.id = 123
        mock_create_list_service.return_value = list
        with APP.test_client() as client:
            response = client.post(
                "/lists",
                data=dumps(self.data),
                content_type="application/json",
                headers={"Accept": "application/json"},
            )
            assert loads(response.data) == dict(id=list.id, status=200)
            mock_validate_new_list.assert_called_once_with(self.data)
            mock_create_list_service.assert_called_once_with(**self.data)
            mock_commit.assert_called_once_with()


@patch("poc.controllers.lists.List.fetch")
class TestShowList:
    def test_unknown_list(self, mock_fetch):
        mock_fetch.return_value = None
        with APP.test_client() as client:
            response = client.get("/lists/123")
            assert loads(response.data) == dict(error="List not found.", status=404)
            mock_fetch.assert_called_once_with("123")

    def test_known_list(self, mock_fetch):
        list = MagicMock()
        serialized_list = dict(foo="bar")
        list.serialize_with_listings.return_value = serialized_list
        mock_fetch.return_value = list
        with APP.test_client() as client:
            response = client.get("/lists/123")
            assert loads(response.data) == dict(list=serialized_list, status=200)
            mock_fetch.assert_called_once_with("123")


@patch("poc.controllers.lists.DB.session.commit")
@patch("poc.controllers.lists.delete_list_service")
@patch("poc.controllers.lists.List.fetch")
class TestDeleteList:
    def test_unknown_list(self, mock_fetch, mock_delete_list_service, mock_commit):
        mock_fetch.return_value = None
        with APP.test_client() as client:
            response = client.delete("/lists/123")
            assert loads(response.data) == dict(error="List not found.", status=404)
            mock_fetch.assert_called_once_with("123")
            mock_delete_list_service.assert_not_called()
            mock_commit.assert_not_called()

    def test_known_list(self, mock_fetch, mock_delete_list_service, mock_commit):
        list = MagicMock()
        mock_fetch.return_value = list
        with APP.test_client() as client:
            response = client.delete("/lists/123")
            assert loads(response.data) == dict(status=200)
            mock_fetch.assert_called_once_with("123")
            mock_delete_list_service.assert_called_once_with(list)
            mock_commit.assert_called_once_with()
