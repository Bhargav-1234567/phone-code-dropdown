import { useEffect, useState } from "react";

const baseURL = process.env.REACT_APP_BASEURL;

const useApiCall = <T = any, BodyType = undefined, QueryParamsType = undefined>(
  url: string,
  options: RequestInit = {},
  isQuery: boolean = false
) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const getToken = async () => {
    let token = localStorage.getItem("token");
    if (!token) {
      setLoading(true);
      try {
        const res = await fetch(`${baseURL}access_token?corporate_id=10`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Api-key": process.env.REACT_APP_API_KEY || "",
          },
        });
        const data = await res.json();
        token = data.access_token;
        if (token) {
          setToken(token);
          localStorage.setItem("token", token);
        }
      } catch (err) {
        setError(err);
      }
    }
    return token;
  };

  const getQueryString = (
    params: Record<string, string | number | boolean | undefined>
  ) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    return searchParams.toString();
  };

   const fetchData = async (
    args?: {
      body?: BodyType;
      queryParams?: Record<string, string | number | boolean | undefined>;
    }
  ): Promise<void> => {
    let currentToken = token;
    if (!currentToken) {
      currentToken = await getToken();
    }

    const queryString = args?.queryParams
      ? `?${getQueryString(args.queryParams)}`
      : "";

    const finalUrl = `${baseURL}${url}${queryString}`;

    setLoading(true);
    try {
      const response = await fetch(finalUrl, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
        body: args?.body ? JSON.stringify(args.body) : options.body,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData: T = await response.json();
      setData(responseData);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isQuery) {
      fetchData();
    }
  }, [isQuery]);

  return {
    data,
    error,
    loading,
    fetchData: !isQuery ? fetchData : null,
  };
};

export default useApiCall;
