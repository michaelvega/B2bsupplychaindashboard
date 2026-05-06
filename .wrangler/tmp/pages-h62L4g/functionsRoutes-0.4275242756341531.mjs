import { onRequest as __api_azure___path___ts_onRequest } from "/Users/silibama/Documents/B2bsupplychaindashboard-main/functions/api/azure/[[path]].ts"

export const routes = [
    {
      routePath: "/api/azure/:path*",
      mountPath: "/api/azure",
      method: "",
      middlewares: [],
      modules: [__api_azure___path___ts_onRequest],
    },
  ]