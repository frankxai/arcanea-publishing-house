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
    def test_invalid_metadata(self):
        for key, value in (("title", " "), ("rights_owner", None), ("price_eur", float("nan")),
                           ("price_eur", float("inf")), ("edition_id", 123)):
            with self.subTest(key=key, value=value):
                self.assertTrue(validate(self.root, {**self.manifest, key: value}))
        self.assertTrue(validate(self.root, []))

    def test_single_copy_supply(self):
        single = {**self.manifest, "edition_type": "one-of-one", "max_supply": 2}
        self.assertTrue(validate(self.root, single))
        self.assertEqual(validate(self.root, {**single, "max_supply": 1}), [])

    def test_output_cannot_replace_source(self):
        import json
        import subprocess
        gate = pathlib.Path(__file__).resolve().parents[1] / "tools" / "edition_release_gate.py"
        manifest = self.root / "edition.json"
        manifest.write_text(json.dumps(self.manifest))
        for source in (manifest, self.root / "book.md"):
            original = source.read_bytes()
            result = subprocess.run([sys.executable, str(gate), str(manifest), "--out", str(source)],
                                    capture_output=True, text=True)
            self.assertNotEqual(result.returncode, 0)
            self.assertEqual(source.read_bytes(), original)

    def test_state_machine(self):
        self.assertEqual(STATES[0], "IDEA")
        self.assertEqual(STATES[-1], "MEASURED")

if __name__ == "__main__":
    unittest.main()
