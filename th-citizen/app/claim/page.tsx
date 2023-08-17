'use client';
import { useState } from 'react'
export default function Claim() {
    const [fullName, setFullName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [citizenId, setCitizenId] = useState('');
    const [issueDate, setIssueDate] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const handleSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        // Handle form submission or validation here
    };
    return (
        <main>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Enter Your Information</h1>
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
