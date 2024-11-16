// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "hardhat/console.sol";

// 继承 Context，IERC20
contract C2NToken is Context, IERC20 {
    using Math for uint256;
    /**
     * constructor(_name, _symbol, _decimals)
     * name()
     * symbol()
     * decimals()
     * totalSupply()
     * balanceOf(account)
     * transfer(to, value)
     * allowance(owner, spender)
     * approve(spender, value)
     * transferFrom(from, to, value)
     * 
     * _transfer(from, to, value)
     * _update(from, to, value)
     * _mint(account, value)
     * _burn(account, value)
     * _approve(owner, spender, value)
     * _approve(owner, spender, value, emitEvent)
     * _spendAllowance(owner, spender, value)
     */

    // 当继承的父类合约中已定义事件，直接使用即可
    // event Transfer(address indexed from, address indexed to, uint256 value);
    // event Approval(address indexed owner, address indexed spender, uint256 value);

    string private _name;
    string private _symbol;
    string private _decimals;

    uint256 private _totalSupply;
    mapping (address => uint256) private _balances;
    mapping (address owner => mapping(address spender => uint256)) private _allowances;

    function name() public view virtual returns (string memory) {
        return _name;
    }

    function symbol() public view virtual returns (string memory) {
        return _symbol;
    }

    function decimals() public view virtual returns (string memory) {
        return _decimals;
    }

    function totalSupply() public view virtual override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view virtual override returns (uint256) {
        return _balances[account];
    }

    function allowance(address owner, address spender) public view virtual override returns (uint256) {
        return _allowances[owner][spender];
    }

    function transfer(address recipient, uint256 value) public virtual override returns (bool) {
        _transfer(_msgSender(), recipient, value);
        return true;
    }

    function approve(address spender, uint256 value) public virtual override returns (bool) {
        _approve(_msgSender(), spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) public virtual override returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, value);
        _transfer(from, to, value);
        return true;
    }

    function _transfer(address from, address to, uint256 value) internal virtual {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");

        _update(from, to, value);
    }

    function _approve(address owner, address spender, uint256 value) internal virtual {
        _approve(owner, spender, value, true);
    }

    function _approve(address owner, address spender, uint256 value, bool emitEvent) internal virtual {
        require(owner != address(0), "ERC20: Invalid Approver");
        require(spender != address(0), "ERC20: Invalid Spender");

        _allowances[owner][spender] = value;
        if (emitEvent) {
            emit Approval(owner, spender, value);
        }
    }

    function _update(address from, address to, uint256 value) internal virtual {
        if (from == address(0)) {
            _totalSupply += value;
        } else {
            uint256 fromBalance = _balances[from];
            require(fromBalance >= value, "ERC20: insufficient balance");
            unchecked {
                _balances[from] = fromBalance - value;
            }
        }

        if (to == address(0)) {
            unchecked {
                _totalSupply -= value;
            }
        } else {
            unchecked {
                _balances[to] += value;
            }
        }

        emit Transfer(from, to, value);
    }

    function _mint(address account, uint256 value) internal {
        require(account != address(0), "ERC20: Invalid receiver");
        _update(address(0), account, value);
    }

    function _burn(address account, uint256 value) internal {
        require(account != address(0), "ERC20: Invalid Sender");
        _update(account, address(0), value);
    }

    function _spendAllowance(address owner, address spender, uint256 value) internal virtual {
        uint256 currentAllowance = _allowances[owner][spender];

        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= value, "ERC20: Insufficient allowance");

            _approve(owner, spender, currentAllowance - value, false);
        }
    }
}
