//@ts-ignore
import { require } from "@hyperoracle/zkgraph-lib";
import { Bytes, Block, Event, Address } from "@hyperoracle/zkgraph-lib";

let erc20_addr = Bytes.fromHexString('0x7169D38820dfd117C3FA1f22a697dBA58d90BA06');
let esig_approval = Bytes.fromHexString("0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925");
let dest_address = Bytes.fromHexString('0x7E039D405d2a100414Fe6FC35C0d4BE89ddDa1B8').padStart(32);

export function handleBlocks(blocks: Block[]): Bytes {
  // init output state
  let Approver: Address = Address.zero();

  // #1 can access all (matched) events of the latest block
  let events: Event[] = blocks[0].events;

  // #2 also can access (matched) events of a given account address (should present in yaml first).
  // a subset of 'events'
  let eventsByAcct: Event[] = blocks[0].account(erc20_addr).events;

  // #3 also can access (matched) events of a given account address & a given esig  (should present in yaml first).
  // a subset of 'eventsByAcct'
  let eventsByAcctEsig: Event[] = blocks[0].account(erc20_addr).eventsByEsig(esig_approval)

  // require match event count > 0
  require(eventsByAcctEsig.length > 0)

  // this 2 way to access event are equal effects, alway true when there's only 1 event matched in the block (e.g. block# 2279547 on sepolia).
  require(
    events[0].data == eventsByAcct[0].data
    && events[0].data == eventsByAcctEsig[0].data
  );

  

  // set state to the address of the 1st (matched) event, demo purpose only.
  for (let i = 0; i < events.length; i++) {
    if (
      events[i].address.equals(erc20_addr) &&
      events[i].esig.equals(esig_approval) &&
      events[i].topic2.equals(dest_address)
    ) {
      Approver = Address.fromString(events[i].topic1.toHexString());
      break;
    }
  }

  const ApproverBytes = Bytes.fromHexString(Approver.toHexString());

  return ApproverBytes;
}
