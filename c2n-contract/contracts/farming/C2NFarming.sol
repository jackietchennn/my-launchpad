// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract C2NFarming is Ownable {
    using Math for uint256;
    using SafeERC20 for IERC20;

    /**
     * 1. define `UserInfo` struct
     *      struct UserInfo {
     *          uint256 amount;
     *          uint256 rewardDebt;
     *      }
     * 2. define `PoolInfo` struct
     *      struct PoolInfo {
     *          IERC20 lpToken;
     *          uint256 totalDeposits;
     *          uint256 allocationPoint;
     *          uint256 accountERC20PerShare;
     *          uint256 lastRewardTimestamp;
     *      }
     * 3. define basic state for farming staking
     *      `erc20Token`
     *      `rewardPerSecond`
     *      `totalRewards`
     *      `paidOut`
     *      `poolInfo`
     *      `userInfo`
     *      `totalAllocationPoint`
     *      `startTimestamp`
     *      `endTimestamp`
     * 4. define Event
     *      `Deposit`
     *      `Withdraw`
     *      `EmergencyWithdraw`
     * 
     * constructor(IERC20 _erc20Token, uint256 _rewardPerSenond, uint256 _startTimestamp) public {}
     * function fund(uint256 _amount) public {}
     * 
     * // pool operation
     * function add(IERC20 _lpToken, uint256 _allocationPoint, bool _withUpdate) public onlyOwner {}
     * function set(uint256 _pid, uint256 _allocationPoint, bool _withUpdate) public onlyOwner {}
     * function poolLength() public view returns (uint256) {}
     * function massUpdatePools() public {}
     * function updatePool(uint256 _pid) public {}
     * 
     * // query operation of balance or reward
     * function deposited(uint _pid, address user) external view returns (uint256) {}
     * function pending(uint256 _pid) view returns (uint256) {}
     * function totalPending() view returns (uint256) {}
     * 
     * // io operation of user amount
     * function deposit(uint256 _pid, uint256 _amount) public {}
     * function withdraw(uint256 _pid, uint256 _amount) public {}
     * function emergencyWithdraw(uint256 _pid, uint256 _amount) public {}
     * function erc20Transfer(address _to, uint256 _amount) internal {}
     */

    // Info of each user
    struct UserInfo {
        // How many LP token the user has provided
        uint256 amount;
        // Reward Debt
        uint256 rewardDebt;
    }

    // Info of each pool
    struct PoolInfo {
        // lpToken address
        IERC20 lpToken;
        // allocation point for this pool
        uint256 allocationPoint;
        // total lpToken deposited
        uint256 totalDeposits;
        // latest reward timestamp
        uint256 lastRewardTimestamp;
        // accumulated erc20s per share
        uint256 accumulatedERC20PerShare;
    }

    event Deposit(address indexed user, uint256 poolId, uint256 amount);
    event Withdraw(address indexed user, uint256 poolId, uint256 amount);
    event EmergencyWithdraw(address indexed user, uint256 poolId, uint256 amount);

    // Address of the ERC20 token contract
    IERC20 public erc20Token;
    // Total rewards add to farm
    uint256 public totalRewards;
    // Total rewards paidout
    uint256 public paidOut;
    // Total allocation points to accumulate rewards for each pool 
    uint256 public totalAllocationPoint;
    // Rewards per second
    uint256 public rewardPerSecond;
    // farm start time
    uint256 public startTimestamp;
    // farm end time
    uint256 public endTimestamp;
    // collection of pools
    PoolInfo[] public poolInfo;
    // mapping from poolId to userInfo
    mapping(uint256 pid => mapping(address => UserInfo)) public userInfo;

    constructor(IERC20 _erc20Token, uint256 _rewardPerSecond, uint256 _startTimestamp) 
        Ownable(_msgSender()) 
    {
        erc20Token = _erc20Token;
        rewardPerSecond = _rewardPerSecond;
        startTimestamp = _startTimestamp;
        endTimestamp = _startTimestamp;
    }
    function fund(uint256 _amount) public {
        require(block.timestamp < endTimestamp, "Farm: too late, the farm has closed.");
        totalRewards = totalRewards + _amount;
        endTimestamp += _amount / rewardPerSecond;
        erc20Token.safeTransferFrom(msg.sender, address(this), _amount);
    }
    function add(IERC20 _lpToken, uint256 _allocationPoint, bool _withUpdate) public onlyOwner {
        if (_withUpdate) {
            massUpdatePools();
        }

        totalAllocationPoint = totalAllocationPoint + _allocationPoint;
        // 添加新成员时，需要使用 `PoolInfo` struct 包裹新成员
        poolInfo.push(PoolInfo({
            lpToken: _lpToken,
            allocationPoint: _allocationPoint,
            lastRewardTimestamp: block.timestamp > startTimestamp ? block.timestamp : startTimestamp,
            totalDeposits: 0,
            accumulatedERC20PerShare: 0
        }));
    }
    function set(uint256 _pid, uint256 _allocationPoint, bool _withUpdate) public onlyOwner {
        if (_withUpdate) {
            massUpdatePools();
        }

        totalAllocationPoint = totalAllocationPoint - poolInfo[_pid].allocationPoint + _allocationPoint;
        poolInfo[_pid].allocationPoint = _allocationPoint;
    }
    function poolLength() public view returns (uint256) {
        return poolInfo.length;
    }
    function massUpdatePools() public {
        uint256 _poolLength = poolInfo.length;

        for (uint256 pid = 0; pid < _poolLength; pid++) {
            updatePool(pid);
        }
    }
    function updatePool(uint256 _pid) public {
        PoolInfo storage pool = poolInfo[_pid];
        uint256 lastTimestamp = block.timestamp < endTimestamp ? block.timestamp : endTimestamp;

        if (lastTimestamp <= pool.lastRewardTimestamp) {
            return;
        }

        uint256 lpSupply = pool.totalDeposits;

        if (lpSupply == 0) {
            pool.lastRewardTimestamp = lastTimestamp;
            return;
        }

        uint256 nrOfSecond = lastTimestamp - pool.lastRewardTimestamp;
        uint256 erc20Rewards = nrOfSecond * rewardPerSecond * pool.allocationPoint / totalAllocationPoint;

        pool.accumulatedERC20PerShare = pool.accumulatedERC20PerShare + (erc20Rewards * 1e36 / lpSupply);
        pool.lastRewardTimestamp = lastTimestamp;
    }
    function deposited(uint256 _pid, address _user) external view returns (uint256) {
        return userInfo[_pid][_user].amount;
    }
    function pending(uint256 _pid) public view returns (uint256) {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        uint256 accumulatedERC20PerShare = pool.accumulatedERC20PerShare;
        uint256 lpSupply = pool.totalDeposits;

        if (block.timestamp > pool.lastRewardTimestamp && lpSupply != 0) {
            uint256 lastTimestamp = block.timestamp < endTimestamp ? block.timestamp : endTimestamp;
            uint256 timestampToCompare = pool.lastRewardTimestamp < endTimestamp ? pool.lastRewardTimestamp : endTimestamp;
            uint256 nrOfSecond = lastTimestamp - timestampToCompare;
            uint256 erc20Rewards = nrOfSecond * rewardPerSecond * pool.allocationPoint / totalAllocationPoint;
            accumulatedERC20PerShare = accumulatedERC20PerShare + (erc20Rewards * 1e36 / lpSupply);
        }

        return (user.amount * accumulatedERC20PerShare / 1e36) - user.rewardDebt;
    }
    function totalPending() public view returns (uint256) {
        if (block.timestamp <= startTimestamp) {
            return 0;
        }

        uint256 lastTimestamp = block.timestamp < endTimestamp ? block.timestamp : endTimestamp;

        return (rewardPerSecond * (lastTimestamp - startTimestamp)) - paidOut;
    }
    function deposit(uint256 _pid, uint256 _amount) public {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];

        updatePool(_pid);

        if (user.amount > 0) {
            uint256 pendingAmount = (user.amount * pool.accumulatedERC20PerShare / 1e36) - user.rewardDebt;
            erc20Transfer(msg.sender, pendingAmount);
        }

        pool.totalDeposits = pool.totalDeposits + _amount;
        pool.lpToken.safeTransferFrom(address(msg.sender), address(this), _amount);
        user.amount = user.amount + _amount;
        user.rewardDebt = user.amount * pool.accumulatedERC20PerShare / 1e36;
        emit Deposit(msg.sender, _pid, _amount);
    }
    function withdraw(uint256 _pid, uint256 _amount) public {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];

        require(user.amount >= _amount, "Farm: you can't withdraw more than deposit");
        updatePool(_pid);

        uint256 pendingAmount = (user.amount * pool.accumulatedERC20PerShare / 1e36) - user.rewardDebt;
        erc20Transfer(address(msg.sender), pendingAmount);

        pool.totalDeposits = pool.totalDeposits - _amount;
        // 不能使用 `safeTransferFrom`，该方法会校验allowance，会出问题
        // `safeTransferFrom` 是第三方合约得到授权后，将资产从账户A转移到账户B的过程
        // pool.lpToken.safeTransferFrom(address(this), msg.sender, pendingAmount);

        // `safeTransfer` 是直接转移，不需要代理合约
        pool.lpToken.safeTransfer(address(msg.sender), _amount);
        user.amount = user.amount - _amount;
        user.rewardDebt = user.amount * pool.accumulatedERC20PerShare / 1e36;

        emit Withdraw(msg.sender, _pid, _amount);
    }
    function emergencyWithdraw(uint256 _pid) public {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];

        pool.lpToken.safeTransfer(address(msg.sender), user.amount);
        pool.totalDeposits = pool.totalDeposits - user.amount;
        user.amount = 0;
        user.rewardDebt = 0;
    }
    function erc20Transfer(address _to, uint256 _amount) internal {
        erc20Token.safeTransfer(_to, _amount);
        paidOut = paidOut + _amount;
    }
}