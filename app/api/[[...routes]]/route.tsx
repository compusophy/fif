/** @jsxImportSource frog/jsx */

require('dotenv').config();

import { Button, Frog, TextInput } from 'frog'
//import { neynar } from 'frog/hubs'
import { handle } from 'frog/next'

const apiKeyNeynar = process.env.NEYNAR_API_KEY || ''; // Provide a default value for apiKeyNeynar
const signerUUID = process.env.SIGNER_UUID;

const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  // Supply a Hub to enable frame verification.
  //hub: neynar({ apiKey: apiKeyNeynar })
})

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame('/', async (c) => {
  const { buttonValue, status, verified, frameData, inputText } = c
  
  let displayMessage = status === 'response' ? inputText : 'FRAME IN FRAME';

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
            color: 'gray',
            fontSize: 36,
            fontStyle: 'normal',
            fontFamily: 'mono', // The 'mono' font family is used here
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {displayMessage}
        </div>
      </div>
    ),
    intents: [
      <TextInput placeholder="ENTER FRAME URL..." />,
      <Button value="frameRender">RENDER</Button>,
    ]
  })
})

export const GET = handle(app)
export const POST = handle(app)
