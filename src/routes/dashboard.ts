import { Request, response, Response } from 'express'
import axios from 'axios'

import {
  defaultConfig,
  redirectOnSoftError,
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

    const { sdk } = createHelpers(req)
    const axios = require('axios')
    const session = req.session
    var output
    

    var config = {
      method:'get',
      url: 'http://192.168.1.131:3005/v1/client?c_uuid=1f4f0e08-3b63-4be3-aeea-2eaa8d3d0c8b',
      headers: {
        'Content-Type' : 'application/json'
      },
      data: session
    }
      const clientData = await axios(config);
      //console.log("clientData: " , clientData)
      output = clientData.data;
    
      
    
    

    
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
        output: output
          ? JSON.stringify(output, null, 2)
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


