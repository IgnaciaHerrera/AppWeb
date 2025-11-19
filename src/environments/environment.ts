// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // ID de usuario fijo para pruebas/local
  userId: 1,
  servicios: {
    examenes: 'http://localhost:4002'
  }
  ,
  // URL del API Gateway (usada como fallback directo si el proxy no está aplicado)
  apiGateway: 'https://05ub3vgx02.execute-api.us-east-1.amazonaws.com'
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
