import './App.css';
import { useEffect } from 'react';

import { handleIncomingRedirect, login, fetch, getDefaultSession, logout } from '@inrupt/solid-client-authn-browser';
import { 
  getSolidDataset, 
  getThing,
  getStringNoLocale,
  getUrlAll,
  saveSolidDatasetAt
} from '@inrupt/solid-client';
import { FOAF, VCARD } from "@inrupt/vocab-common-rdf";


function App() {

  useEffect(async () => {
    // 1.
    await handleIncomingRedirect({
      restorePreviousSession: true,
    });
  }, [])

  const handleLogin = async () => {
    // 2. Start the Login Process if not already logged in.
    if (!getDefaultSession().info.isLoggedIn) {
      await login({
        oidcIssuer: "https://inrupt.net",
        redirectUrl: window.location.href,
        clientName: "My First Application"
      })
    }
  }

  // fetch data
  const handleFetch = async () => {
    const session = getDefaultSession()
    if (session.info.isLoggedIn) {
      const webId = session.info.webId
      // const sessionFetch = await session.fetch(webId)
      // const url = sessionFetch.url

      const myDataSet = await getSolidDataset(webId, { fetch: fetch });
      
      const profile = getThing(myDataSet, webId);
      
      const formattedName = getStringNoLocale(profile, VCARD.fn);
      console.log("formattedName:", formattedName)

      
    } else {
      alert("User is not logged in")
    }

    
  }



  const checkCurrentSession = async () => {
    
    let curSession = getDefaultSession()
    console.log(curSession.info.isLoggedIn)
  }

  // sign out from Solid Identity Provider
  const handleLogout = async () => {
    let curSession = getDefaultSession()
    await curSession.logout()
  }

  return (
    <div className="App">
      <button onClick={handleLogin}>Login</button>
      <button onClick={checkCurrentSession}>Check current session</button>
      <button onClick={handleFetch}>Fetch</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default App;