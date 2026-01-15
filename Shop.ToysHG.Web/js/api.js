/**
 * Service gọi Backend API
 */
class ApiService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    /**
     * GET request
     */
    async get(endpoint) {
        try {
            console.log(`📡 GET: ${this.baseUrl}${endpoint}`);
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Response:', data);
            return { success: true, data };

        } catch (error) {
            console.error('❌ Error:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * POST request
     */
    async post(endpoint, body) {
        try {
            console.log(`📡 POST: ${this.baseUrl}${endpoint}`);
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ POST Response:', data);
            return { success: true, data };

        } catch (error) {
            console.error('❌ Error:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * PUT request
     */
    async put(endpoint, body) {
        try {
            console.log(`📡 PUT: ${this.baseUrl}${endpoint}`);
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ PUT Response:', data);
            return { success: true, data };

        } catch (error) {
            console.error('❌ Error:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * DELETE request
     */
    async delete(endpoint) {
        try {
            console.log(`📡 DELETE: ${this.baseUrl}${endpoint}`);
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            // DELETE có thể trả về text hoặc JSON
            const contentType = response.headers.get('content-type');
            let data;
            
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = { message: 'Deleted successfully' };
            }
            
            console.log('✅ DELETE Response:', data);
            return { success: true, data };

        } catch (error) {
            console.error('❌ Error:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Test kết nối - gọi /api/products thay vì /swagger
     */
    async testConnection() {
        try {
            console.log('🔍 Testing connection to:', this.baseUrl);
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(`${this.baseUrl}/api/products`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                signal: controller.signal
            });

            clearTimeout(timeout);
            console.log('✅ Connection test result:', response.status);
            return response.ok;
        } catch (error) {
            console.error('❌ Connection test failed:', error.message);
            return false;
        }
    }
}

// Khởi tạo API Service
const api = new ApiService(CONFIG.BACKEND_URL);