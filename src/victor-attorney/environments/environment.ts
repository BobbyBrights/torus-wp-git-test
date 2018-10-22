// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  api_url: 'https://conduit.productionready.io/api',
  appInsights: {
    instrumentationKey: 'a6953632-7eac-40e7-b083-6939996ccee3',
    enableDebug: false,
    disableExceptionTracking: true,
    disableAjaxTracking: true,
    maxAjaxCallsPerView: 1
  },
  azure_api: 'https://iclaim-dev-e-us-fa-common-001.azurewebsites.net/api'
};
