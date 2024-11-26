export const STAKED_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_STAKED_TOKEN_ADDRESS!;
export const ENARED_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_EARNED_TOKEN_ADDRESS!;
export const STAKING_ADDRESS = process.env.NEXT_PUBLIC_STAKING_ADDRESS!;

export const tokenAbi = [
  // Read-Only Functions
  "function deposited(uint256 pid, address to) view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function userInfo(uint pid, address spender) view returns (uint256)",
  "function poolInfo(uint pid) view returns (uint256)",

  // Authenticated Functions
  "function deposit(uint256 pid, uint256 amount) returns (bool)",
  "function withdraw(uint256 pid, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transfer(address to, uint amount) returns (bool)",

  // Events
]

export const TOKEN_ADDRESS_MAP = {
  11155111: "0x4E71E941878CE2afEB1039A0FE16f5eb557571C8", // 测试链sepolia
  31337: "0x5FbDB2315678afecb367f032d93F642f64180aa3", // 本地链 填C2N-TOKEN的地址
}

export const tokenSymbols = [
  { chainId: 11155111, symbol: 'C2N', address: TOKEN_ADDRESS_MAP[11155111] },
  { chainId: 31337, symbol: 'C2N', address: TOKEN_ADDRESS_MAP[31337] },
]

export const tokenInfos = [
  { chainId: 11155111, symbol: 'C2N', address: TOKEN_ADDRESS_MAP[11155111] },
  { chainId: 31337, symbol: 'C2N', address: TOKEN_ADDRESS_MAP[31337] },
]

export const AIRDROP_CONTRACT = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512" // 本地连 空投Airdrop的地址

export const STAKING_POOL_ID = 0;

// staking address
export const stakingPoolAddress = [
  {
    chainId: 11155111,
    stakingAddress: '',
    depositTokenAddress: '',
    earnedTokenAddress: '',
  },
  {
    chainId: 31337,
    stakingAddress: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
    depositTokenAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    earnedTokenAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  }
]