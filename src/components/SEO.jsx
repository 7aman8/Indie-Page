import React from 'react';

const SEO = ({ title, description, path, image = "/Opengraph.png" }) => {
  const siteUrl = "https://www.arjbuilds.dev";
  const canonicalUrl = `${siteUrl}${path}`;
  
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={`${siteUrl}${image}`} />
      
      {/* Twitter */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:image" content={`${siteUrl}${image}`} />
    </>
  );
};

export default SEO;
