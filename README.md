# Thai_Citizen_ID_Card
note ***
store critical field on off chain by hash 

database (off chain)
- postgress 
	- field 
		-  token id
 		-  key

- store encrypdata on chain
  
backend 
-  golang for api to database
-  queue (optional)
	
frontend 
-  next.js 
-  ether.js for connect smart contract

smart contract 
- on chain
 - core contract
   - token contract
- upgrade contract
 -  UpgradeableProxy
	
