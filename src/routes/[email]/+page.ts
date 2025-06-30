import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
    const { email } = params;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // If the parameter is not an email, throw 404
    if (!emailRegex.test(email)) {
        throw error(404, {
            message: 'Page not found'
        });
    }
    
    // If it's a valid email format, continue to the page
    return {
        email
    };
}; 