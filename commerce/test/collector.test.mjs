import {test} from 'node:test';import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {collectorPreview,chainPreparation} from '../src/collector.js';
const e=JSON.parse(await readFile('editions/letters-to-the-seeker/edition.json','utf8'));
test('reading edition is uncapped and does not transfer IP',()=>{const p=collectorPreview(e);assert.equal(p.supply_cap,null);assert.equal(p.rights_state,'pending');assert.match(p.token_rights,/No copyright/);});
test('Base and Ethereum adapters return unsigned preparation only',()=>{for(const c of ['base','ethereum']){const p=chainPreparation(collectorPreview(e,c,25));assert.equal(p.transaction,null);assert.equal(p.signing_enabled,false);assert.equal(p.mint_enabled,false);assert.equal(p.auction_enabled,false);}});
test('invalid collector supply or chain is rejected',()=>{assert.throws(()=>collectorPreview(e,'base',0));assert.throws(()=>collectorPreview(e,'other',2));});
