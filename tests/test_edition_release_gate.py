import pathlib
import tempfile
import unittest
import sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "tools"))
from edition_release_gate import validate, STATES

class GateTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = pathlib.Path(self.tmp.name)
        (self.root / "book.md").write_text("# Original book\nHello world.", encoding="utf-8")
        self.manifest = dict(edition_id="arcanea-first-edition", title="First Edition", manuscript="book.md", rights_owner="Arcanea", rights_approved=True, editorial_approved=True, release_approved=True, price_eur=19, currency="EUR", edition_type="digital")
    def tearDown(self):
        self.tmp.cleanup()
    def test_valid(self):
        self.assertEqual(validate(self.root, self.manifest), [])
    def test_rights_gate(self):
        self.manifest["rights_approved"] = False
        self.assertTrue(validate(self.root, self.manifest))
    def test_traversal(self):
        self.manifest["manuscript"] = "../secrets.txt"
        self.assertTrue(validate(self.root, self.manifest))
    def test_collector_supply(self):
        self.manifest["edition_type"] = "collector"
        self.assertTrue(validate(self.root, self.manifest))
        self.manifest["max_supply"] = 100
        self.assertEqual(validate(self.root, self.manifest), [])
    def test_state_machine(self):
        self.assertEqual(STATES[0], "IDEA")
        self.assertEqual(STATES[-1], "MEASURED")

if __name__ == "__main__":
    unittest.main()
