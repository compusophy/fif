/** @jsxImportSource frog/jsx */

require('dotenv').config();

import { Button, Frog, TextInput } from 'frog'
import { neynar } from 'frog/hubs'
import { handle } from 'frog/next'

const apiKeyNeynar = process.env.NEYNAR_API_KEY || ''; // Provide a default value for apiKeyNeynar
const signerUUID = process.env.SIGNER_UUID;

const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  // Supply a Hub to enable frame verification.
  hub: neynar({ apiKey: apiKeyNeynar })
})

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame('/', async (c) => {
  const { buttonValue, status, verified, frameData } = c
  
  if (status === 'response') {
    try {
      // Make an external API call to https://api.neynar.com/v2/farcaster/user/follow
      const response = await fetch('https://api.neynar.com/v2/farcaster/user/follow', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          api_key: apiKeyNeynar, // Replace this with your actual API key
        },
        body: JSON.stringify({
          signer_uuid: signerUUID, // Replace this with your actual signer UUID
          target_fids: [frameData!.fid], // Assuming fid is a string
        }),
      });

      const data = await response.json();
      // Handle the response data here
    } catch (error) {
      // Handle any errors here
    }
  }

  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background: 'black',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {status === 'response'
            ? `success!!`
            : 'make compusophy follow you'}
        </div>
      </div>
    ),
    intents: [
      // Only show the initial button if status is not 'response'
      status !== 'response' && <Button value="followButton">make compusophy follow you</Button>,
      // Only show the Reset button if status is 'response'
      status === 'response' && <Button.Reset>reset</Button.Reset>,
    ].filter(Boolean),
  })
})

export const GET = handle(app)
export const POST = handle(app)
