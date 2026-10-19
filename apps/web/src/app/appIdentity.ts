import { APP_IDENTITY, getAppConfig, type AppIdentity } from '../config';

// Name and icons of the app this deploy is, so screens never read the config.
export function currentApp(): AppIdentity {
  return APP_IDENTITY[getAppConfig().kind];
}
