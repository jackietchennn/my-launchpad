farm:
	@npx hardhat compile
#	@npx hardhat run --network local scripts/deployment/deploy_boba_token.ts
	@npx hardhat run --network local scripts/deployment/deploy_c2n_token.ts
	@npx hardhat run --network local scripts/deployment/deploy_c2n_airdrop.ts
	@npx hardhat run --network local scripts/deployment/deploy_c2n_farm.ts
staking:
	@npx hardhat compile
	@npx hardhat run --network local scripts/deployment/deploy_boba_token.ts
	@npx hardhat run --network local scripts/deployment/deploy_c2n_token.ts
	@npx hardhat run --network local scripts/deployment/deploy_airdrop_c2n.ts
	@npx hardhat run --network local scripts/deployment/deploy_farm.ts
	@npx hardhat run --network local scripts/deployment/deploy_singletons.ts
ido:
	@npx hardhat compile
	@npx hardhat run --network local scripts/deployment/deploy_boba_token.ts
	@npx hardhat run --network local scripts/deployment/deploy_c2n_token.ts
	@npx hardhat run --network local scripts/deployment/deploy_airdrop_c2n.ts
	@npx hardhat run --network local scripts/deployment/deploy_singletons.ts
	@npx hardhat run --network local scripts/deployment/deploy_mock_token.ts
# singletons:
# 	@npx hardhat run --network local scripts/deployment/deploy_singletons.ts
# mocktoken:
# 	@npx hardhat run --network local scripts/deployment/deploy_mock_token.ts
sales:
	@npx hardhat run --network local scripts/deployment/deploy_sales.ts
deposit:
	@npx hardhat run --network local scripts/deployment/depositToken.ts
node:
	@npx hardhat node
runtest:
	@npx hardhat test
upgrades:
	@npx hardhat run --network local scripts/deployment/upgrades.ts