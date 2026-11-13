// Unsigned preparation only. Deliberately no wallet, RPC, contract or mint method.
export function collectorPreview(edition,chain=null,supplyCap=null){
 if(chain!==null && !['base','ethereum'].includes(chain))throw new Error('Unsupported chain');
 if(supplyCap!==null && (!Number.isSafeInteger(supplyCap)||supplyCap<1))throw new Error('Invalid proposed supply cap');
 return {
  edition_id:edition.edition_id,manifest_sha256:edition.manifest_sha256,source_sha256:edition.source.sha256,
  rights_owner_claimed:edition.rights_owner_claimed,rights_state:'pending',collector_status:'proposal',supply_cap:supplyCap,
  token_rights:'No copyright or commercial license transfers with a token',chain,minted:false
 };
}
export function chainPreparation(provenance){
 if(provenance.minted!==false || !['base','ethereum'].includes(provenance.chain))throw new Error('Unsigned supported-chain preview required');
 return {chain_id:provenance.chain==='base'?8453:1,provenance,transaction:null,signing_enabled:false,mint_enabled:false,auction_enabled:false,readiness:'explicit_approval_and_rights_review_required'};
}
