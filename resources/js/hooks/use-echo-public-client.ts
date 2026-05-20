import { useEffect, useRef } from 'react';

/**
 * A client-side-only hook for subscribing to Echo public channels.
 * 
 * SSR-safe: does nothing during server-side rendering.
 * The @laravel/echo-react module is loaded dynamically only in the browser.
 */
export function useEchoPublicClient<T>(
    channelName: string,
    event: string,
    callback: (payload: T) => void,
) {
    const callbackRef = useRef(callback);
    callbackRef.current = callback;

    useEffect(() => {
        let channel: any;
        let handler: any;
        let cancelled = false;

        const init = async () => {
            // Small delay to ensure configureEcho has completed
            await new Promise(r => setTimeout(r, 150));

            if (cancelled) return;

            try {
                const { echoIsConfigured, echo } = await import('@laravel/echo-react');

                if (cancelled) return;
                if (!echoIsConfigured()) return;

                const echoInstance = echo();
                channel = echoInstance.channel(channelName);

                handler = (e: T) => callbackRef.current(e);
                channel.listen(event, handler);
            } catch (err) {
                console.warn('[useEchoPublicClient] Failed to initialize Echo:', err);
            }
        };

        init();

        return () => {
            cancelled = true;
            if (channel && handler) {
                channel.stopListening(event, handler);
            }
        };
    }, [channelName, event]);
}
