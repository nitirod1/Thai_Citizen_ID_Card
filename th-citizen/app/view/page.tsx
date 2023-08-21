'use client';
import './view.css'
import { useWalletClient,useContractWrite,useContractRead } from 'wagmi'
import { abi } from "../../contractABI";
import { useState , useEffect} from 'react'
import CryptoJS from 'crypto-js';
import axios from 'axios';
interface UserResponse {
    key: string;
}
interface Citizen {
    age: string;
    citizenId: string;
    expiryDate: string;
    gender: string;
    issueDate: string;
    name: string;
  }
  
export default function View() {
    const contractAddr = '0x7367dc09ed2e86cA29eb8424822AD4d060F40007'
    const { data: walletClient, isError, isLoading } = useWalletClient()
    const [tokenId,setTokenId] = useState(1);
    const [encrypdata, setEnrypdata] = useState('');
    const wallet = walletClient?.account.address;
    const [citizenData, setCitizenData] = useState<Citizen>({
        age: "",
        citizenId: "",
        expiryDate: "",
        gender: "",
        issueDate: "",
        name: "",
    })
    const contractTokenId =useContractRead({
        account: wallet,
        address: contractAddr,
        functionName: 'getOwnToken',
        abi: abi,
        onSuccess(data) {
            const tokenId = data;
            setTokenId(tokenId as number)
          },
      })
    const contractRead = useContractRead({
        account: wallet,
        address: contractAddr,
        abi: abi,
        functionName: 'getCitizen',
        args :[tokenId],
        onSuccess(data) {
            const encrpy = data
            setEnrypdata(encrpy as string)
        },
          onError(error) {
            console.log('Error', error)
          },
      })
    const decryptData = (data: string, key: string | CryptoJS.lib.WordArray) => {
        console.log(data)
        console.log(key)
        const decryptedData = CryptoJS.AES.decrypt(data, key.toString()).toString(CryptoJS.enc.Utf8);
        return decryptedData;
    };
 
    useEffect(()=> {
        async function fetchData() {
            // Replace with your actual encrypdata and key
            try {
            const encryptedData = encrypdata[0];
            const { data,status } = await axios.get<UserResponse>(process.env.BACKEND_URL+"users/"+wallet as string );
            if (status !=200){
                alert("error")
                return 
            }      
              const decryptedResult = await decryptData(encryptedData, data.key);
              const jsonDecrypt:Citizen = JSON.parse(decryptedResult)
              const citizen: Citizen = {
                age: jsonDecrypt.age,
                citizenId: jsonDecrypt.citizenId,
                expiryDate: jsonDecrypt.expiryDate,
                gender: jsonDecrypt.gender,
                issueDate: jsonDecrypt.issueDate,
                name: jsonDecrypt.name,
              };
              setCitizenData(citizen)
            } catch (error) {
              console.log('Decryption error:', error);
            }
          }
          fetchData(); 
    },[encrypdata])
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="text-xl font-semibold md:text-3xl">name :{citizenData.name}</div>
            <div className="text-xl font-semibold md:text-3xl">age :{citizenData.age}</div>
            <div className="text-xl font-semibold md:text-3xl">gender :{citizenData.gender}</div>
            <div className="text-xl font-semibold md:text-3xl">citizenId :{citizenData.citizenId}</div>
            <div className="text-xl font-semibold md:text-3xl">issueDate :{citizenData.issueDate}</div>
            <div className="text-xl font-semibold md:text-3xl">expiryDate :{citizenData.expiryDate}</div>
        </main>
    )
}