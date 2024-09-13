// src/serviceWorker.js

// This optional code is used to register a service worker.
// Note this is not required for Create React App and only helps with offline caching and PWA features.

const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.includes('127.0.0.1')
  );
  
  function register(config) {
    if ('serviceWorker' in navigator) {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
  
      if (isLocalhost) {
        checkValidServiceWorker(swUrl, config);
        navigator.serviceWorker.ready.then(() => {
          console.log('This web app is being served cache-first by a service worker.');
        });
      } else {
        registerValidSW(swUrl, config);
      }
    }
  }
  
  function registerValidSW(swUrl, config) {
    navigator.serviceWorker
      .register(swUrl)
      .then(registration => {
        registration.onupdateavailable = () => {
          if (config.onUpdate) {
            config.onUpdate(registration);
          }
        };
        registration.onupdatefound = () => {
          if (config.onSuccess) {
            config.onSuccess(registration);
          }
        };
      })
      .catch(error => {
        console.error('Error during service worker registration:', error);
      });
  }
  
  function checkValidServiceWorker(swUrl, config) {
    fetch(swUrl)
      .then(response => {
        const contentType = response.headers.get('content-type');
        if (
          response.status === 404 ||
          (contentType != null && contentType.indexOf('javascript') === -1)
        ) {
          navigator.serviceWorker.ready.then(registration => {
            registration.unregister().then(() => {
              window.location.reload();
            });
          });
        } else {
          registerValidSW(swUrl, config);
        }
      })
      .catch(() => {
        console.log('No internet connection found. App is running in offline mode.');
      });
  }
  
  export { register };
  