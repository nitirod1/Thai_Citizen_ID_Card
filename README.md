# Thai_Citizen_ID_Card
note ***
store critical field on off chain by hash 

database (off chain)
- postgress 
	- field 
		-  Full Name
		-  Age
		-  Gender
		-  Citizen ID
	  	-  Issue Date
		-  Expiry Date
		-  Hash for off chain

IPFS
- pinata provide public uri
	- metadata 
		-  image id card 
		-  token id
		-  property

backend 
-  golang for api to database
-  queue (optional)
	
frontend 
-  next.js 
-  ether.js for connect smart contract

smart contract 
- on chain
	-  core contract
- upgrade contract
	-  UpgradeableProxy
	
