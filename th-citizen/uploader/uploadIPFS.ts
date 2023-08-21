import axios from 'axios';

const auth =process.env.AUTH_PINATA
const gateway = process.env.PINATA

export const uploadIPFS = async (encryp:string ,issueData:string,expiredDate:string ) => {
    try {
        const resJSON = await axios({
            method: "post",
            url: "https://api.pinata.cloud/pinning/pinJsonToIPFS",
            data: {
                "data":encryp,
                "issueData":issueData,
                "expiredDate":expiredDate,
                "attributes": [ 
                    {
                        "display_type": "date", 
                        "trait_type": "created date", 
                        "value": new Date().getTime()
                    }
                ]
            },
            headers: {
              Authorization: auth,
            },
        });
        const tokenURI = `ipfs/${resJSON.data.IpfsHash}`;
        return tokenURI
    } catch (error) {
        console.log("JSON to IPFS: ")
        console.log(error);
        return ""
    }
}

// export const saveWillToIPFS = async (e:React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const form = e.target as HTMLFormElement;
//     const files = (form[0] as HTMLInputElement).files;
//     const name = (form[1] as HTMLInputElement).value;
//     const desc = (form[2] as HTMLInputElement).value;
//     if (files) {
//         try {
//           const formData= new FormData();
//             formData.append("file", files[0]);
//             const resFile = await axios({
//                 method: "post",
//                 url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
//                 data: formData,
//                 headers: {
//                     Authorization: auth,
//                     "Content-Type": "multipart/form-data"
//                 },
//             });
//             console.log(resFile.data.IpfsHash);
//             const ImgHash = "https://"+ gateway+`ipfs/${resFile.data.IpfsHash}`;
//             await jsonWillToken(ImgHash,name,desc)
//         } catch (error) {
//             console.log("File to IPFS: " ,error)
//             console.log(error)
//         }
//         form.reset()
//     }
// }