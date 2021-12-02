from unittest.mock import MagicMock, patch
from poc.services import create_list_service, delete_list_service


class TestCreateListService:
    def setup(self):
        self.db_session = MagicMock()
        self.name = "foobar"

    def test_creating(self):
        with patch("poc.services.lists.List") as mock_List:
            mock_list = MagicMock()
            mock_List.return_value = mock_list
            result = create_list_service(name=self.name, db_session=self.db_session)
            mock_List.assert_called_once_with(name=self.name)
            self.db_session.add.assert_called_once_with(mock_list)
            assert result == mock_list


class TestDeleteListService:
    def setup(self):
        self.db_session = MagicMock()
        self.list = MagicMock()

    def test_deleting_without_listings(self):
        self.list.listings = []

        delete_list_service(self.list, db_session=self.db_session)

        delete_call_args = self.db_session.delete.call_args_list
        assert len(delete_call_args) == 1

        assert delete_call_args[0][0] == (self.list,)
        assert delete_call_args[0][1] == {}

    def test_deleting_with_listings(self):
        listing1 = MagicMock()
        listing2 = MagicMock()
        self.list.listings = [listing1, listing2]

        delete_list_service(self.list, db_session=self.db_session)

        delete_call_args = self.db_session.delete.call_args_list
        assert len(delete_call_args) == 3

        assert delete_call_args[0][0] == (listing1,)
        assert delete_call_args[0][1] == {}

        assert delete_call_args[1][0] == (listing2,)
        assert delete_call_args[1][1] == {}

        assert delete_call_args[2][0] == (self.list,)
        assert delete_call_args[2][1] == {}
