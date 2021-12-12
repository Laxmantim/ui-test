import { Request, Response } from 'express'

import {
  defaultConfig,
  RouteCreator,
  RouteRegistrator,
  setSession
} from '../pkg'

export const createDashboardRoute: RouteCreator =
(createHelpers) => async (req, res) => {
    res.locals.projectName = 'Dashboard'

    const { sdk } = createHelpers(req)
    const session = req.session
    // const client = req.

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