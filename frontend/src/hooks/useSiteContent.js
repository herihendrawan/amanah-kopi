import React, { createContext, useContext, useState, useEffect } from 'react';

const SiteContentContext = createContext({});

export const SiteContentProvider = ({ children }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/content`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setContent(d.data); })
      .catch((e) => console.error('Failed to load site content:', e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SiteContentContext.Provider value={{ content, loading }}>
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = () => useContext(SiteContentContext);
