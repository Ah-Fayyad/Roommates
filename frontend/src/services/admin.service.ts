import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
};

export const adminService = {
    getStats: async () => {
        const response = await axios.get(`${API_BASE_URL}/admin/stats`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    getUsers: async () => {
        const response = await axios.get(`${API_BASE_URL}/admin/users`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    getReports: async () => {
        const response = await axios.get(`${API_BASE_URL}/admin/reports`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    getRecentActivity: async () => {
        const response = await axios.get(`${API_BASE_URL}/admin/activity`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    getModerationQueue: async () => {
        const response = await axios.get(`${API_BASE_URL}/admin/moderation`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    approveListing: async (listingId: string) => {
        const response = await axios.post(
            `${API_BASE_URL}/admin/approve-listing`,
            { listingId },
            { headers: getAuthHeader() }
        );
        return response.data;
    },

    rejectListing: async (listingId: string, reason: string) => {
        const response = await axios.post(
            `${API_BASE_URL}/admin/reject-listing`,
            { listingId, reason },
            { headers: getAuthHeader() }
        );
        return response.data;
    }
};
