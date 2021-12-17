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
      url: 'http://192.168.1.131:3005/v1/client?c_uuid=' + session?.identity.id,
      headers: {
        'Content-Type' : 'application/json'
      },
      data: session
    }
      const clientData = await axios(config);
      output = clientData.data;

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
          : `Hi I'm Paul.
  The guy from Jimmy Neutron.`,
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


