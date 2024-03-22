/** @jsxImportSource frog/jsx */

require('dotenv').config();

import { Button, Frog, TextInput } from 'frog'
//import { neynar } from 'frog/hubs'
import { handle } from 'frog/next'
import axios from 'axios'
import cheerio from 'cheerio'

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
  
  let dummyURL = "https://make-like.vercel.app/api";
  let metaTagsMessage = '';

  async function fetchMetaTags() {
    
    try {
      const response = await fetch(dummyURL);
      const html = await response.text();
      const $ = cheerio.load(html);
      const metaTags = $('meta');
      
      metaTags.each(function() {
        metaTagsMessage += '\n' + $.html(this);
      });
    } catch (error) {
      console.error(error);
    }
  
    return metaTagsMessage;
  }

  let displayMessage = status === 'response' ? await fetchMetaTags() : 'FRAME IN FRAME';



  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background: 'black',
          display: 'flex',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        {displayMessage.split('\n').map((line, index) => (
  <div
    key={index}
    style={{
      color: 'gray',
      fontSize: 36,
      fontStyle: 'normal',
      fontFamily: 'mono',
      position: 'absolute',
      top: -36 + index * 36,
      left: 18,
    }}
  >
    {line}
  </div>
))}

        <div
          style={{
            color: 'gray',
            fontSize: 36,
            fontStyle: 'normal',
            fontFamily: 'mono',
            position: 'absolute',
            bottom: 18,
            
          }}
        >
          {dummyURL}
        </div>

      </div>
    ),
    imageAspectRatio: '1.91:1',
    intents: [
      <TextInput placeholder="ENTER FRAME URL..." />,
      <Button value="frameRender">RENDER</Button>,
    ]
  })
})

export const GET = handle(app)
export const POST = handle(app)
