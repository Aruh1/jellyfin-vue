/**
 * Instantiates the Axios instance used for the SDK and requests
 */
import axios, {
  type AxiosError
} from 'axios';
import auth from '../auth';
import { useSnackbar } from '@/composables/use-snackbar';
import { i18n } from '@/plugins/i18n';

class RemotePluginAxios {
  public readonly instance = axios.create();
  private readonly _defaults = this.instance.defaults;

  public resetDefaults(): void {
    this.instance.defaults = this._defaults;
  }

  /**
   * Intercepts 401 (Unathorized) error code and logs out the user inmmediately,
   * as the session probably has been revoked remotely.
   */
  public logoutInterceptor = async (error: AxiosError): Promise<void> => {
    if (
      error.response?.status === 401 &&
      auth.currentUser &&
      !error.config?.url?.includes('/Sessions/Logout')
    ) {
      await auth.logoutCurrentUser(true);
      useSnackbar(i18n.t('kickedOut'), 'error');
    }

    /**
     * Pass the error so it's handled in try/catch blocks afterwards
     */
    throw error;
  };

  public constructor() {
    this.instance.interceptors.response.use(
      undefined,
      this.logoutInterceptor
    );
  }
}

const RemotePluginAxiosInstance = new RemotePluginAxios();

export default RemotePluginAxiosInstance;
