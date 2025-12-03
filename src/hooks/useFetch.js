export const useFetch = () => {
    const fetchData = async (url, body = null, method = "GET", headers = {}) => {
        try {
            const config = {
                method,
                headers: {
                    ...headers
                }
            };

            if (body) {
                if (body instanceof FormData) {
                    config.body = body;
                } else {
                    config.headers["Content-Type"] = "application/json";
                    config.body = JSON.stringify(body);
                }
            }

            const res = await fetch(url, config);

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.msg || "Error en la petición");
            }

            return await res.json();

        } catch (error) {
            console.error("❌ Error en useFetch:", error);
            throw error;
        }
    };

    return fetchData;
};
