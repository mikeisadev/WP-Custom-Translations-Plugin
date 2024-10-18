import axios from "axios";

// Create an axios instance.
const Http = axios.create({});

// Default headers.
Http.defaults.headers.post['Content-Type'] = 'application/json';
Http.defaults.headers.put['Content-Type'] = 'application/json';

Http.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Add a different CSRF token if inside ADMIN area.
if ( window.location.href.includes('/wp-admin') ) {
    Http.defaults.headers.common['X-WP-Nonce'] = ctpMetaData.restNonce;   
}

// Export the Http instance.
export default Http;