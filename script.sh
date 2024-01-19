# Test script for zkGraph

# Update `zkgraph.config.ts` with your own parameters first!
# Then run `sh test.sh`

npm run compile &&
npm run exec -- 5083544 &&
npm run prove -- --inputgen 5083544 0000000000000000000000001b17e8cd06b4911aad344884dd8968d879fbb5d0 &&
npm run prove -- --test 5083544 0000000000000000000000001b17e8cd06b4911aad344884dd8968d879fbb5d0