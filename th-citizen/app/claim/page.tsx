'use client';
import { useState , useEffect} from 'react'
import CryptoJS from 'crypto-js';
import { abi } from "../../contractABI";
import { useWalletClient,useContractWrite } from 'wagmi'
import axios from 'axios';
import {uploadIPFS} from '../../uploader/uploadIPFS'
export interface PostUserReq {
    key: string;
    wallet: string;
}

export interface PostUserRes {
    key: string;
    wallet: string;
}

export default function Claim() {
    const contractAddr = '0x7367dc09ed2e86cA29eb8424822AD4d060F40007'
    const { data: walletClient, isError, isLoading } = useWalletClient()
    const [fullName, setFullName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [citizenId, setCitizenId] = useState('');
    const [issueDate, setIssueDate] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [encryptedData,setEncryptedData] = useState('');
    const [contractWritePending, setContractWritePending] = useState(false);
    const [uri ,setUri] = useState('');
    const wallet = walletClient?.account.address;
    useEffect(() => {
        if (encryptedData !== ''&& contractWritePending){
            contractWrite.write?.()
            setContractWritePending(false);
        }
    },[encryptedData,contractWritePending])

    const contractWrite = useContractWrite({
        address: contractAddr,
        abi: abi,
        functionName: 'safeMint',
        account: wallet,
        args : [wallet,encryptedData,issueDate,expiryDate,uri],
          onError(error) {
            axios.delete(process.env.BACKEND_URL + "users/" + wallet as string);
            alert("write contract error is :"+error)
          },
    })
    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        // console.log(contractRead.data)
        // return 
        const data = JSON.stringify({
            name: fullName,
            age: age,
            gender: gender,
            citizenId: citizenId,
            issueDate: issueDate,
            expiryDate: expiryDate
        });
        try {
            // Generate the salt asynchronously
            const salt = await generateSalt();
            // Derive the key asynchronously using PBKDF2
            const key = await deriveKey(data, salt);
            const encryp =await encryptData(data, key).toString()
            const urlIpfs = await uploadIPFS(encryp,issueDate,expiryDate)
            setUri(urlIpfs)
            setEncryptedData(encryp);
            setContractWritePending(true);
            const reqBody = JSON.stringify({
                key:key.toString(),
                wallet : wallet?.toString()
            });
            const { status } = await axios.post(process.env.BACKEND_URL+"users" as string ,reqBody);
            if (status !== 200){
                alert("error post users")
                return 
            }

        } catch (error) {
            console.error("An error occurred:", error);
            return 
        }
    };

    // Function to generate a random salt
    const generateSalt = (): Promise<CryptoJS.lib.WordArray> => {
        return new Promise((resolve) => {
            const salt = CryptoJS.lib.WordArray.random(128 / 8);
            resolve(salt);
        });
    };
    // Function to derive the key using PBKDF2
    const deriveKey = (data: string | CryptoJS.lib.WordArray, salt: string | CryptoJS.lib.WordArray):  Promise<CryptoJS.lib.WordArray> => {
        return new Promise((resolve) => {
            const key = CryptoJS.PBKDF2(data, salt, { keySize: 512 / 32, iterations: 1000 });
            resolve(key);
        });
    };

    // Function to encrypt the data using the derived key
    const encryptData = (data: string | CryptoJS.lib.WordArray, key: string | CryptoJS.lib.WordArray) => {
        const encryptedData = CryptoJS.AES.encrypt(data, key.toString());
        return encryptedData;
    };
    
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Enter Your Token Information</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <label>
                        Full Name:
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full border p-2 bg-black text-white"
                        />
                    </label>
                    <label>
                        Age:
                        <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="w-full border p-2 bg-black text-white"
                        />
                    </label>
                    <label>
                        Gender:
                        <input
                            type="text"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="w-full border p-2 bg-black text-white"
                        />
                    </label>
                    <label>
                        Citizen ID:
                        <input
                            type="text"
                            value={citizenId}
                            onChange={(e) => setCitizenId(e.target.value)}
                            className="w-full border p-2 bg-black text-white"
                        />
                    </label>
                    <label>
                        Issue Date:
                        <input
                            type="date"
                            value={issueDate}
                            onChange={(e) => setIssueDate(e.target.value)}
                            className="w-full border p-2 bg-black text-white"
                        />
                    </label>
                    <label>
                        Expiry Date:
                        <input
                            type="date"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            className="w-full border p-2 bg-black text-white"
                        />
                    </label>
                    <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                        Submit
                    </button>
                </form>
            </div>
        </main>
    )
}
