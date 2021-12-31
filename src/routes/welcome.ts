import { Request, Response } from 'express'
import axios from 'axios'
import ReactDOM from 'react-dom'

import {
  defaultConfig,
  RouteCreator,
  RouteRegistrator,
  setSession
} from '../pkg'
import { buttonStyles } from '@ory/themes'

export const createWelcomeRoute: RouteCreator =
  (createHelpers) => async (req, res) => {
    res.locals.projectName = 'Welcome to Ory'

    const { sdk } = createHelpers(req)
    const session = req.session

    // Create a logout URL
    const logoutUrl =
      (
        await sdk
          .createSelfServiceLogoutFlowUrlForBrowsers(req.header('cookie'))
          .catch(() => ({ data: { logout_url: '' } }))
      ).data.logout_url || ''

    res.render('welcome', {
      session: session
        ? JSON.stringify(session, null, 2)
        : `No valid Ory Session was found.
Please sign in to receive one.`,
      hasSession: Boolean(session),
      logoutUrl
    })
  }

export const registerWelcomeRoute: RouteRegistrator = (
  app,
  createHelpers = defaultConfig,
  route = '/welcome'
) => {
  app.get(route, setSession(createHelpers), createWelcomeRoute(createHelpers))
}
