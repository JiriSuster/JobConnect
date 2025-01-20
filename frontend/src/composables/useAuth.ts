import { reactive, ref } from 'vue';
import axios from 'axios';
import * as client from 'openid-client';
import {jwtDecode} from "jwt-decode";
import config from "@/config";


// State for auth
const state = reactive({
    accessToken: localStorage.getItem('access_token') || undefined,
    refreshToken: localStorage.getItem('refresh_token') || undefined,
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : undefined,
    authenticated: !!localStorage.getItem('access_token')
});
const error = ref<string | undefined>(undefined);
let codeChallenge: string;
let authConfig: client.Configuration;

export function useAuth() {

    const init = async () => {
        const issuerUri = `${config.keycloak.baseUrl}/realms/${config.keycloak.realm}`;
        authConfig = await client.discovery(
            new URL(issuerUri),
            config.keycloak.clientId!,
            undefined,
            undefined,
            { execute: [client.allowInsecureRequests] } // allow running Keycloak on localhost
        );
    }

    const login = async () => {
        console.log("login");
        /**
         * PKCE: The following MUST be generated for every redirect to the
         * authorization_endpoint. You must store the code_verifier and state in the
         * end-user session such that it can be recovered as the user gets redirected
         * from the authorization server back to your application.
         */
        localStorage.setItem('code_verifier', client.randomPKCECodeVerifier())
        codeChallenge = await client.calculatePKCECodeChallenge(localStorage.getItem('code_verifier'))

        let parameters: Record<string, string> = {
            redirect_uri: config.keycloak.redirectUri,
            code_challenge: codeChallenge,
            code_challenge_method: 'S256',
        }

        localStorage.setItem('state', client.randomState())
        parameters.state = localStorage.getItem('state')

        let redirectTo: URL = client.buildAuthorizationUrl(authConfig, parameters)
        window.location.href = redirectTo.href; // Redirect to Keycloak login page
    };

    /**
     * Handle the callback after login
     */
    const handleCallback = async (callbackUrl: string) => {
        let tokens: client.TokenEndpointResponse = await client.authorizationCodeGrant(
            authConfig,
            new URL(callbackUrl),
            {
                pkceCodeVerifier: localStorage.getItem('code_verifier'),
                expectedState: localStorage.getItem('state'),
            },
        )

        state.authenticated = true;
        state.accessToken = tokens.access_token;
        state.refreshToken = tokens.refresh_token;
        state.user = jwtDecode(tokens.access_token);

        localStorage.setItem('access_token', tokens.access_token);
        localStorage.setItem('refresh_token', tokens.refresh_token);
        localStorage.setItem('user', JSON.stringify(state.user));


    };


    /**
     * Make an authenticated request to the backend
     */
    const authorizedRequest = async (endpoint: string, method: string, options = {}) => {
        await refreshToken()
        if (!state.accessToken) {
            error.value = 'Not authenticated';
            throw new Error(error.value);
        }

        const response = await axios({
            url: `${endpoint}`,
            headers: {
                Authorization: `Bearer ${state.accessToken}`,
            },
            method: method,
            ...options,
        });
        return response.data;
    };

    const refreshToken = async () => {
        const refreshToken = state.refreshToken;
        if (!refreshToken) {
            console.error("No refresh token available.");
            //logout();
            return undefined;
        }

        try {
            const response = await axios.post(
                `${config.keycloak.baseUrl}/realms/${config.keycloak.realm}/protocol/openid-connect/token`,
                new URLSearchParams({
                    client_id: config.keycloak.clientId!,
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken,
                }),
                {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                }
        );

            const newAccessToken = response.data.access_token;
            const newRefreshToken = response.data.refresh_token;
            
            state.accessToken = newAccessToken;
            state.refreshToken = newRefreshToken;
            state.user = jwtDecode(newAccessToken);

            localStorage.setItem('access_token', newAccessToken);
            localStorage.setItem('refresh_token', newRefreshToken);
            localStorage.setItem('user', JSON.stringify(state.user));

            return newAccessToken;
        } catch (err) {
            console.error("Failed to refresh token:", err);
            logout();
            return undefined;
        }
    };

    const logout = () => {
        state.authenticated = false;
        state.accessToken = undefined;
        state.refreshToken = undefined;
        state.user = undefined;
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        localStorage.removeItem('state');
        localStorage.removeItem('code_verifier');
        console.log(location.origin)
        window.location.href = `${config.keycloak.baseUrl}/realms/${config.keycloak.realm}/protocol/openid-connect/logout?redirect_uri=${encodeURIComponent(location.origin)}`;
    };

    const unauthorizedRequest = async (endpoint: string, method: string, options = {}) => {
        const response = await axios({
            url: `${endpoint}`,
            headers: {},
            method: method,
            ...options,
        });
        return response.data;
    };

    const getUsername = () => {
        return state.user?.['preferred_username']
    };

    const getUserRoles = () => {
        return state.user?.['resource_access']?.[config.keycloak.clientId]?.roles ?? []
    }

    const getUserEmail = () => {
        return state.user?.['email']
    }

    return {
        state,
        error,
        init,
        login,
        handleCallback,
        authorizedRequest,
        unauthorizedRequest,
        getUsername,
        getUserRoles,
        getUserEmail,
        logout
    };
}
