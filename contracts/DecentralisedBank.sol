// SPDX-License-Identifier:UNLICENSED
pragma solidity 0.8.27;

contract DecentralisedBank {
    
    struct Account {
        uint balance;
        bool exist;
    }

    mapping(address => Account) public accounts;

    event deposited(address account, uint amount);
    event withdrawl(address account, uint amount);
    event transfered(address from, address to, uint amount);

    function CreateAccount() external {
        require(!accounts[msg.sender].exist, "account already exists");
        accounts[msg.sender] = Account({balance: 0, exist: true});
    }

    function Deposit() external payable {
        require(accounts[msg.sender].exist, "account does not exist");
        require(msg.value > 0, "invalid amount");
        accounts[msg.sender].balance += msg.value;

        emit deposited(msg.sender, msg.value);
    }

    function withdraw(uint _amount) external {
        require(accounts[msg.sender].exist, "account does not exist");
        require(accounts[msg.sender].balance >= _amount, "insufficient amount");
        require(_amount > 0, "amount should be greater than zero");

        accounts[msg.sender].balance -= _amount;
        payable(msg.sender).transfer(_amount);

        emit withdrawl(msg.sender, _amount);
    }

    function transfer(address _to, uint _amount) external {
        require(accounts[msg.sender].exist, "this account doesn't exist");
        require(accounts[msg.sender].balance >= _amount,"insufficient balance");
        require(_amount > 0, "amount should be greater than zero");

        accounts[msg.sender].balance -= _amount;
        accounts[_to].balance += _amount;

        emit transfered(msg.sender, _to, _amount);
    }

     function accountExists(address _account) public view returns (bool) {
       require(_account != address(0), "Invalid address");
    
    // Instead of reverting, return false if the account does not exist
       if (!accounts[_account].exist) {
          return false;
       }
    
       return true;
    }


   function getAccountBalance(address _account) public view returns (uint256) {
    require(accountExists(_account), "Account does not exist");
    return accounts[_account].balance;
     }

}