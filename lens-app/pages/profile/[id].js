import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { client, getProfiles, getPublications } from '../../api'
import Image from 'next/image'
import ABI from '../../abi'
import { ethers } from 'ethers'

const address = "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d"

export default function Profile() {
    const [profile, setProfile] = useState()
    const [publications, setPublications] = useState([])
    const router = useRouter()
    const { id } = router.query
    useEffect(() => {
        if (id) {
            fetchProfile()
        }
    }, [id])

    async function fetchProfile() {
        try {
            const response = await client.query(getProfiles, { id }).toPromise()
            console.log('response: ', response)
            setProfile(response.data.profiles.items[0])

            const pubs = await client.query(getPublications, { id, limit: 50 }).toPromise()

            setPublications(pubs.data.publications.items)
            console.log({ publications })
        }   catch (err) {
            console.log('error fetching profile...', err)
        }
    }

    async function connect() {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts"
        })
        console.log({ accounts })
    }

    if (!profile) return null

    return (
        <div>
            <button onClick={connect}>Connect</button>
            {
                profile.picture && profile.picture.original ? (
                    <Image
                        src={profile.picture.original.url} 
                        width="200px"
                        height="200px"
                        alt="Profile Picture"
                    />
                ) : (
                    <div style={{ width: '200px', height: '200px', backgroundColor: 'black' }}/>
                )
            }
            <div>
                <h4>{profile.handle}</h4>
                <p>{profile.bio}</p>
                <p>Followers: {profile.stats.totalFollowers}</p>
                <p>Following: {profile.stats.totalFollowing}</p>
            </div>
            <div>
            {
                publications.map((pub, index) => (
                    <div key={index} style={{ padding: '20px', borderTop: '1px solid #ededed' }}>
                        <p>{pub.metadata.content}</p>
                    </div>
                ))
            }      
            </div>
        </div>
    )
}