// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  BACK_END_HOST: 'https://localhost:44312/api/',
  ACCES_KEY_ID: 'AKIAUJM5HXIVOFJHIDF2',
  SECRET_ACCESS_KEY: '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',
  REGION: 'sa-east-1',
  BUCKET_NAME: 'jabusoft-dev-test-bucket',
  ROLES: 'Admin,Billing,Basic',
  API_KEY: 'AIzaSyBEJ-2v7ewQyGscnXbsKv1y7jMn5qKm64E',
  COMPANY_NAME: 'JABUSOFT',
  SERVERLESS_DEPLOY: false,
  LOGO_URL: 'http://jabusoft-misc.s3-sa-east-1.amazonaws.com/logos/jabusoft.png'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.