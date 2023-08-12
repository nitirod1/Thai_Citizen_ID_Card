# Thai_Citizen_ID_Card
claim sig by soulbound
1.only the designated owner of the TDIC token and the
parties explicitly authorized by the owner shall have access to view this data.
	1.1 owner and parties can authorized role to view data 
	1.2 data management 
2. Thai citizens aged 18 or above are eligible to apply for TDIC.
	2.1 check citizen age
3. On the designated release date, the government is responsible for distributing
TDICs to all eligible citizens, approximating 60 million individuals.
	3.1 recived TDICs

4. The necessary software architecture must encompass frontend, backend, database,
and Blockchain components

use case by req
1. owner give role to new party
	3.1 owner -> check only owner -> give role
2. owner view data and citizens view your own data
	3.1 owner -> check auth owner -> view data 
	3.2 citizens -> check auth citizens -> view data
3. citizens received TDICs 
	3.1 citizens -> received -> check age if ture -> contract create TDICs token 
4. contract create TDICs token 

note ***
store critical field on off chain by hash 

database 
- postgress 
	- field 1. Full Name
		2. Age
		3. Gender
		4. Citizen ID
		5. Issue Date
		6. Expiry Date
		7.  Hash for off chain
IPFS
- pinata provide public uri
	- metadata 
		1. uri
		2. 
backend 

frontend 


smart contract 
- on chain

- off chain
