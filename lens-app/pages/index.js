import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { client, recommendProfiles } from '../api'

export default function Profile() {
  const [profiles, setProfiles] = useState([])

  useEffect(() => {
    fetchProfiles()
  }, [])

  async function fetchProfiles() {
    try {
      const response = await client.query(recommendProfiles).toPromise()
      console.log({ response })
      setProfiles(response.data.recommendedProfiles)
    } catch (err) {
      console.log('error fetching recommended profiles: ', err)
    }
  }

  if (!profiles) return null

  return (
    <div>
      {
        profiles.map((profile, index) => (
          <Link href={`/profile/${profile.id}`} key="index">
            <a>
              {
                profile.picture && profile.picture.original ? (
                    <Image
                      src={profile.picture.original.url} 
                      width="60px"
                      height="60px"
                      alt="Profile Picture"
                    />
                  ) : (
                      <div style={{ width: '60px', height: '60px', backgroundColor: 'black' }}/>
                  )
              }
              <h4>{profile.handle}</h4>
              <p>{profile.bio}</p>
            </a>
          </Link>
        ))
      }
    </div>
  )
}