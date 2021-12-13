import { Request, Response } from 'express'
import axios from 'axios'

import {
  defaultConfig,
  RouteCreator,
  RouteRegistrator,
  setSession
} from '../pkg'

import {
  V0alpha2Api as OpenSourceV0alpha2Api,
  V0alpha2ApiInterface
} from '@ory/kratos-client'
import React from 'react'

export const createDashboardRoute: RouteCreator =
(createHelpers) => async (req, res) => {
    res.locals.projectName = 'Dashboard'

    let[clientData, setClientData] = React.useState('')
    const { sdk } = createHelpers(req)
    const session = req.session

    axios({
      method:'post',
      url: 'http://192.168.1.131:3005/v1/client',
      headers: {
        'Content-Type' : 'application/json'
      },
      data: session
    })
    .then(response => {
        setClientData(response.data)
        console.log(JSON.stringify(response.data))
    })
    .catch((error) => {
      console.log(error)
    })

    // const axios = require('axios')
    // const client = await axios.get('192.168.0.6:3005/v1/client', session)

    // client.headers['content-type']
    
    // const Url = '192.168.0.6:3005/v1/client'
    // axios.get(Url, session.json())
    // .then(data=>console.log(data))
    // .catch(err=>console.log(err))

    // axios({
    //   method: 'post',
    //   url: Url,
    //   data: {
    //     session
    //   }
    // })
    // .then(data=>console.log(data))
    // .catch(err=>console.log(err))

    // const csapiUrl = 
    // (
    //     await sdk
    //     .
    // )

    // const immediatelyResolvedPromise = (url: string) => {
    //     const resultPromise = new Promise((resolve, reject) => {
    //         resolve(fetch(csapiUrl))
    //     })
    //     return  resultPromise
    // }


    // Create a logout URL
    const logoutUrl =
      (
        await sdk
          .createSelfServiceLogoutFlowUrlForBrowsers(req.header('cookie'))
          .catch(() => ({ data: { logout_url: '' } }))
      ).data.logout_url || ''

      res.render('dashboard', {
        session: session
          ? JSON.stringify(session, null, 2)
          : `No valid Ory Session was found.
  Please sign in to receive one.`,
        hasSession: Boolean(session),
        logoutUrl
      })
    }

    export const registerDashboardRoute: RouteRegistrator = (
        app,
        createHelpers = defaultConfig,
        route = '/dashboard'
      ) => {
        app.get(route, setSession(createHelpers), createDashboardRoute(createHelpers))
      }