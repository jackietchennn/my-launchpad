export const STAKED_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_STAKED_TOKEN_ADDRESS!;

export const ENARED_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_EARNED_TOKEN_ADDRESS!;

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