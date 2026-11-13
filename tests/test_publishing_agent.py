import importlib.util,json,pathlib,tempfile,unittest
ROOT=pathlib.Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('agent',ROOT/'tools/publishing_agent.py');agent=importlib.util.module_from_spec(spec);spec.loader.exec_module(agent)
class PublishingAgentTests(unittest.TestCase):
 def test_nine_capabilities_and_durable_idempotency(self):
  with tempfile.TemporaryDirectory() as d:
   a=agent.PublishingAgent(ROOT/'editions/letters-to-the-seeker/edition.json',pathlib.Path(d)/'runs.sqlite')
   runs=[a.execute(c) for c in agent.CAPABILITIES]
   self.assertEqual(len(runs),9);first=a.execute('canon_intelligence');self.assertEqual(first['run_id'],runs[0]['run_id']);self.assertEqual(a.db.execute('SELECT COUNT(*) FROM runs').fetchone()[0],9)
   self.assertTrue(all(r['release_authority'] is False for r in runs))
 def test_canon_hash_mismatch_fails_closed(self):
  with tempfile.TemporaryDirectory() as d:
   p=pathlib.Path(d)/'wrong-canon.md';p.write_text('invented canon')
   with self.assertRaises(ValueError):agent.PublishingAgent(ROOT/'editions/letters-to-the-seeker/edition.json',pathlib.Path(d)/'runs.sqlite',p)
 def test_skipped_stages_rejected(self):
  with self.assertRaises(ValueError):agent.transition('DRAFT','STAGED',[],'hash')
 def test_unverified_or_wrong_hash_approval_rejected(self):
  with self.assertRaises(ValueError):agent.transition('HUMAN_APPROVAL','STAGED',[{'scope':s,'manifest_sha256':'different','trusted_operator_verified':True} for s in ('rights','editorial','price','sandbox')],'hash')
 def test_project_state_uses_optimistic_revision(self):
  with tempfile.TemporaryDirectory() as d:
   a=agent.PublishingAgent(ROOT/'editions/letters-to-the-seeker/edition.json',pathlib.Path(d)/'state.sqlite')
   self.assertEqual(a.advance('PREVIEW','HUMAN_APPROVAL',1),'HUMAN_APPROVAL')
   with self.assertRaises(ValueError):a.advance('PREVIEW','HUMAN_APPROVAL',1)
 def test_runner_cannot_release(self):
  with self.assertRaises(ValueError):agent.transition('STAGED','RELEASED',[],'hash')
 def test_source_and_manifest_hash_integrity(self):
  p=ROOT/'editions/letters-to-the-seeker/edition.json';e=json.loads(p.read_text());self.assertEqual(agent.digest(p.with_name('source.md').read_bytes()),e['source']['sha256']);expected=e.pop('manifest_sha256');self.assertEqual(agent.digest(e),expected)
